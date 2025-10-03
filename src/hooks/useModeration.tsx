import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ModerationResult {
  allowed: boolean;
  action?: string;
  warningCount?: number;
  heartsLost?: number;
  bannedUntil?: string;
  reason?: string;
}

export const useModeration = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkMessage = async (message: string, userId: string): Promise<ModerationResult> => {
    setIsChecking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('moderate-message', {
        body: { message, userId }
      });

      if (error) throw error;

      // Si el mensaje no fue permitido, mostrar notificación apropiada
      if (!data.allowed) {
        switch (data.action) {
          case 'warning_1':
            toast.error('⚠️ Tu mensaje contiene lenguaje inapropiado y ha sido bloqueado', {
              description: `Razón: ${data.reason}`
            });
            break;
          case 'warning_2':
            toast.error(`🚨 Segunda advertencia - Se han descontado ${data.heartsLost} corazones`, {
              description: `Razón: ${data.reason}`
            });
            break;
          case 'banned':
            toast.error('🚫 Tu cuenta ha sido suspendida por 24 horas', {
              description: `Razón: ${data.reason}. Corazones descontados: ${data.heartsLost}`
            });
            break;
        }
      }

      return data;
    } catch (error: any) {
      console.error('Error checking message:', error);
      
      // En caso de error, permitir el mensaje pero notificar
      toast.error('Error al verificar mensaje. Se enviará de todas formas.');
      return { allowed: true };
    } finally {
      setIsChecking(false);
    }
  };

  const checkBanStatus = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_banned, banned_until')
        .eq('id', userId)
        .single();

      if (!profile) return { isBanned: false };

      // Verificar si el baneo ya expiró
      if (profile.is_banned && profile.banned_until) {
        const bannedUntil = new Date(profile.banned_until);
        const now = new Date();

        if (now > bannedUntil) {
          // Baneo expirado - desbanear automáticamente
          await supabase
            .from('profiles')
            .update({
              is_banned: false,
              banned_until: null,
              warning_count: 0 // Reset de advertencias
            })
            .eq('id', userId);

          return { isBanned: false };
        }

        return { 
          isBanned: true, 
          bannedUntil: profile.banned_until 
        };
      }

      return { isBanned: false };
    } catch (error) {
      console.error('Error checking ban status:', error);
      return { isBanned: false };
    }
  };

  return {
    checkMessage,
    checkBanStatus,
    isChecking
  };
};
