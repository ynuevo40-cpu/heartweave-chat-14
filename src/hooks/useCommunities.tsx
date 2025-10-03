import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Community {
  id: string;
  name: string;
  description: string | null;
  creator_id: string;
  created_at: string;
  is_active: boolean;
  member_count: number;
  message_count: number;
  is_member?: boolean;
  creator?: {
    username: string;
  };
}

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCommunities();

    // Suscripción a cambios en tiempo real
    const channel = supabase
      .channel('communities')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'communities' },
        () => {
          fetchCommunities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchCommunities = async () => {
    try {
      const { data: communitiesData, error } = await supabase
        .from('communities')
        .select(`
          *,
          creator:profiles!communities_creator_id_fkey(username)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Verificar membresía del usuario actual
      if (user) {
        const { data: memberships } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', user.id);

        const membershipIds = new Set(memberships?.map(m => m.community_id) || []);

        const enrichedCommunities = communitiesData?.map(c => ({
          ...c,
          is_member: membershipIds.has(c.id)
        })) || [];

        setCommunities(enrichedCommunities);
      } else {
        setCommunities(communitiesData || []);
      }
    } catch (error: any) {
      console.error('Error fetching communities:', error);
      toast.error('Error al cargar comunidades');
    } finally {
      setLoading(false);
    }
  };

  const createCommunity = async (name: string, description: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('communities')
        .insert({
          name: name.trim(),
          description: description.trim(),
          creator_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-unirse a la comunidad creada
      await supabase
        .from('community_members')
        .insert({
          community_id: data.id,
          user_id: user.id
        });

      toast.success('¡Comunidad creada exitosamente! 🎉');
      fetchCommunities();
      return data;
    } catch (error: any) {
      console.error('Error creating community:', error);
      toast.error('Error al crear comunidad');
      return null;
    }
  };

  const joinCommunity = async (communityId: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      return;
    }

    try {
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: user.id
        });

      if (error) throw error;

      toast.success('¡Te has unido a la comunidad! 👥');
      fetchCommunities();
    } catch (error: any) {
      console.error('Error joining community:', error);
      if (error.code === '23505') {
        toast.error('Ya eres miembro de esta comunidad');
      } else {
        toast.error('Error al unirse a la comunidad');
      }
    }
  };

  const leaveCommunity = async (communityId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Has salido de la comunidad');
      fetchCommunities();
    } catch (error: any) {
      console.error('Error leaving community:', error);
      toast.error('Error al salir de la comunidad');
    }
  };

  const deleteCommunity = async (communityId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('communities')
        .update({ is_active: false })
        .eq('id', communityId)
        .eq('creator_id', user.id);

      if (error) throw error;

      toast.success('Comunidad eliminada');
      fetchCommunities();
    } catch (error: any) {
      console.error('Error deleting community:', error);
      toast.error('Error al eliminar comunidad');
    }
  };

  return {
    communities,
    loading,
    createCommunity,
    joinCommunity,
    leaveCommunity,
    deleteCommunity,
    refetch: fetchCommunities
  };
};
