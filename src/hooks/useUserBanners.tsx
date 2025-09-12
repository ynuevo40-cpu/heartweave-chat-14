import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserBanner {
  id: string;
  emoji: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  hearts_required: number;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface BannerStats {
  total: number;
  unlocked: number;
  userHearts: number;
}

export const useUserBanners = () => {
  const { user } = useAuth();
  const [banners, setBanners] = useState<UserBanner[]>([]);
  const [stats, setStats] = useState<BannerStats>({
    total: 0,
    unlocked: 0,
    userHearts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBanners = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get user's hearts count
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('hearts_count')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      const userHearts = profileData?.hearts_count || 0;

      // Get all banners
      const { data: bannersData, error: bannersError } = await supabase
        .from('banners')
        .select('*')
        .order('hearts_required');

      if (bannersError) throw bannersError;

      // Get user's unlocked banners
      const { data: userBannersData, error: userBannersError } = await supabase
        .from('user_banners')
        .select('banner_id, unlocked_at')
        .eq('user_id', user.id);

      if (userBannersError) throw userBannersError;

      const unlockedBannerIds = new Set(userBannersData?.map(ub => ub.banner_id) || []);

      // Combine data and detect newly unlocked banners
      const combinedBanners: UserBanner[] = (bannersData || []).map(banner => {
        const wasUnlocked = unlockedBannerIds.has(banner.id);
        const isUnlocked = wasUnlocked || userHearts >= banner.hearts_required;
        
        // Auto-equip newly unlocked banners
        if (isUnlocked && !wasUnlocked && userHearts >= banner.hearts_required) {
          autoEquipBanner(banner.id);
        }
        
        return {
          id: banner.id,
          emoji: banner.emoji,
          name: banner.name,
          rarity: banner.rarity as 'common' | 'rare' | 'epic' | 'legendary',
          hearts_required: banner.hearts_required,
          unlocked: isUnlocked,
          unlocked_at: userBannersData?.find(ub => ub.banner_id === banner.id)?.unlocked_at
        };
      });

      setBanners(combinedBanners);
      
      const unlockedCount = combinedBanners.filter(b => b.unlocked).length;
      
      setStats({
        total: combinedBanners.length,
        unlocked: unlockedCount,
        userHearts
      });

    } catch (err: any) {
      console.error('Error fetching user banners:', err);
      setError(err.message || 'Error al cargar los banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBanners();
  }, [user]);

  const autoEquipBanner = async (bannerId: string) => {
    if (!user) return;

    try {
      // Get currently equipped banners
      const { data: equippedBanners, error: equippedError } = await supabase
        .from('equipped_banners')
        .select('*')
        .eq('user_id', user.id)
        .order('position');

      if (equippedError) throw equippedError;

      // If less than 2 banners equipped, just add the new one
      if (!equippedBanners || equippedBanners.length < 2) {
        const position = equippedBanners ? equippedBanners.length + 1 : 1;
        
        const { error: equipError } = await supabase
          .from('equipped_banners')
          .insert({
            user_id: user.id,
            banner_id: bannerId,
            position
          });

        if (equipError) throw equipError;
      } else {
        // Replace the oldest equipped banner (position 1)
        const { error: updateError } = await supabase
          .from('equipped_banners')
          .update({ banner_id: bannerId })
          .eq('user_id', user.id)
          .eq('position', 1);

        if (updateError) throw updateError;
      }

      // Add to user_banners if not already there
      const { error: userBannerError } = await supabase
        .from('user_banners')
        .upsert({
          user_id: user.id,
          banner_id: bannerId,
          unlocked_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,banner_id'
        });

      if (userBannerError) throw userBannerError;

      // Get banner info for notification
      const banner = (await supabase
        .from('banners')
        .select('name, emoji')
        .eq('id', bannerId)
        .single()).data;

      if (banner) {
        const { toast } = await import('sonner');
        toast.success(`🎉 ¡Banner "${banner.name}" ${banner.emoji} desbloqueado y equipado automáticamente!`);
      }

    } catch (error: any) {
      console.error('Error auto-equipping banner:', error);
    }
  };

  return {
    banners,
    stats,
    loading,
    error,
    refetch: fetchUserBanners
  };
};