import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface BackgroundOption {
  id: string;
  name: string;
  className: string;
  preview: string;
  type: 'preset' | 'custom';
  url?: string;
}

const PRESET_BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'default',
    name: 'Cyber Gradient',
    className: 'bg-gradient-hero',
    preview: 'linear-gradient(135deg, hsl(271 91% 65% / 0.1), hsl(200 100% 50% / 0.1))',
    type: 'preset'
  },
  {
    id: 'dark-space',
    name: 'Espacio Oscuro',
    className: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    preview: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
    type: 'preset'
  },
  {
    id: 'neon-city',
    name: 'Ciudad Neón',
    className: 'bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900',
    preview: 'linear-gradient(to bottom right, #164e63, #1e3a8a, #581c87)',
    type: 'preset'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    className: 'bg-gradient-to-br from-green-900 via-teal-900 to-blue-900',
    preview: 'linear-gradient(to bottom right, #14532d, #134e4a, #1e3a8a)',
    type: 'preset'
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    className: 'bg-gradient-to-br from-orange-900 via-red-900 to-purple-900',
    preview: 'linear-gradient(to bottom right, #9a3412, #7f1d1d, #581c87)',
    type: 'preset'
  }
];

export const useBackgroundSettings = () => {
  const { user } = useAuth();
  const [currentBackground, setCurrentBackground] = useState<BackgroundOption>(PRESET_BACKGROUNDS[0]);
  const [customBackgrounds, setCustomBackgrounds] = useState<BackgroundOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBackground = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user's selected background from profile (for now use localStorage)
      const savedBackground = localStorage.getItem(`background_${user.id}`);
      
      if (savedBackground) {
        const backgroundId = savedBackground;
        const presetBg = PRESET_BACKGROUNDS.find(bg => bg.id === backgroundId);
        if (presetBg) {
          setCurrentBackground(presetBg);
        }
      }
    } catch (error: any) {
      console.error('Error fetching background setting:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeBackground = async (background: BackgroundOption) => {
    if (!user) return;

    try {
      // Save background setting to localStorage for now
      localStorage.setItem(`background_${user.id}`, background.id);

      setCurrentBackground(background);
      toast.success(`Fondo cambiado a: ${background.name}`);
    } catch (error: any) {
      console.error('Error changing background:', error);
      toast.error('Error al cambiar el fondo');
    }
  };

  useEffect(() => {
    fetchUserBackground();
  }, [user]);

  const getAllBackgrounds = () => [...PRESET_BACKGROUNDS, ...customBackgrounds];

  return {
    currentBackground,
    presetBackgrounds: PRESET_BACKGROUNDS,
    customBackgrounds,
    allBackgrounds: getAllBackgrounds(),
    loading,
    changeBackground,
    refetch: fetchUserBackground
  };
};