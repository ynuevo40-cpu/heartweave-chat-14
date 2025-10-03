-- ============================================
-- SISTEMA DE COMUNIDADES Y MODERACIÓN
-- Ejecutar este script en el SQL Editor de Supabase
-- ============================================

-- ============================================
-- SISTEMA DE COMUNIDADES
-- ============================================

-- Crear tabla de comunidades
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  member_count INTEGER DEFAULT 1,
  message_count INTEGER DEFAULT 0
);

-- Crear tabla de miembros de comunidades
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Agregar columna community_id a la tabla messages
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE;

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_messages_community_id ON public.messages(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members(community_id);

-- ============================================
-- SISTEMA DE MODERACIÓN
-- ============================================

-- Crear enum para tipos de advertencia
DO $$ BEGIN
  CREATE TYPE warning_type AS ENUM ('toxic_message', 'spam', 'harassment');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Crear tabla de advertencias
CREATE TABLE IF NOT EXISTS public.user_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  warning_type warning_type NOT NULL,
  message_content TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 3),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de baneos
CREATE TABLE IF NOT EXISTS public.user_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  banned_at TIMESTAMPTZ DEFAULT NOW(),
  banned_until TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Agregar columnas de moderación a la tabla profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS warning_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS banned_until TIMESTAMPTZ;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_user_warnings_user_id ON public.user_warnings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bans_user_id ON public.user_bans(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON public.profiles(is_banned);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas nuevas
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;

-- Políticas para communities
CREATE POLICY "Todos pueden ver comunidades activas"
  ON public.communities FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Usuarios autenticados pueden crear comunidades"
  ON public.communities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creadores pueden actualizar sus comunidades"
  ON public.communities FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Políticas para community_members
CREATE POLICY "Todos pueden ver miembros de comunidades"
  ON public.community_members FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Usuarios pueden unirse a comunidades"
  ON public.community_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden salir de comunidades"
  ON public.community_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para user_warnings (solo lectura del propio usuario)
CREATE POLICY "Usuarios pueden ver sus propias advertencias"
  ON public.user_warnings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para user_bans (solo lectura del propio usuario)
CREATE POLICY "Usuarios pueden ver sus propios baneos"
  ON public.user_bans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS Y FUNCIONES
-- ============================================

-- Función para actualizar member_count en communities
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities
    SET member_count = member_count + 1
    WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities
    SET member_count = GREATEST(0, member_count - 1)
    WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_community_member_count
AFTER INSERT OR DELETE ON public.community_members
FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Función para actualizar message_count en communities
CREATE OR REPLACE FUNCTION update_community_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.community_id IS NOT NULL THEN
    UPDATE public.communities
    SET message_count = message_count + 1
    WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' AND OLD.community_id IS NOT NULL THEN
    UPDATE public.communities
    SET message_count = GREATEST(0, message_count - 1)
    WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_community_message_count
AFTER INSERT OR DELETE ON public.messages
FOR EACH ROW EXECUTE FUNCTION update_community_message_count();

-- Función para auto-unir al creador a su comunidad
CREATE OR REPLACE FUNCTION auto_join_creator_to_community()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.community_members (community_id, user_id)
  VALUES (NEW.id, NEW.creator_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_join_creator
AFTER INSERT ON public.communities
FOR EACH ROW EXECUTE FUNCTION auto_join_creator_to_community();
