import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  completed: boolean;
  triggerEvent: 'immediate' | 'after_first_message' | 'after_hearts' | 'after_banner_unlock';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a H Chat!',
    description: 'Escribe tu primer mensaje y comienza a ganar corazones',
    targetElement: 'message-input',
    completed: false,
    triggerEvent: 'immediate'
  },
  {
    id: 'first_message',
    title: '¡Excelente!',
    description: 'Has enviado tu primer mensaje. Ahora revisa tu posición en la Tabla de Popularidad',
    targetElement: 'leaderboard-nav',
    completed: false,
    triggerEvent: 'after_first_message'
  },
  {
    id: 'hearts_earned',
    title: '¡Corazones ganados!',
    description: 'Usa tus corazones para desbloquear nuevos banners increíbles',
    targetElement: 'banners-nav',
    completed: false,
    triggerEvent: 'after_hearts'
  },
  {
    id: 'banner_unlocked',
    title: '¡Banner desbloqueado!',
    description: 'Configura los banners que mostrarás en tu perfil',
    targetElement: 'profile-nav',
    completed: false,
    triggerEvent: 'after_banner_unlock'
  }
];

export const useOnboarding = () => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<OnboardingStep[]>(ONBOARDING_STEPS);
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOnboardingProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Check if user profile was created recently (within last 24 hours)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      const createdAt = new Date(profileData.created_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      // Check localStorage for onboarding completion
      const onboardingCompleted = localStorage.getItem(`onboarding_${user.id}`) === 'true';
      
      // Consider new user if created within last 24 hours and onboarding not completed
      const isNew = hoursDiff <= 24 && !onboardingCompleted;
      setIsNewUser(isNew);

      if (isNew) {
        // Show immediate welcome step
        const welcomeStep = steps.find(step => step.triggerEvent === 'immediate');
        if (welcomeStep) {
          setCurrentStep(welcomeStep);
        }
      }

    } catch (error: any) {
      console.error('Error fetching onboarding progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeStep = async (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
    
    setCurrentStep(null);

    // If this is the last step, mark onboarding as completed
    const allCompleted = steps.every(step => step.completed || step.id === stepId);
    if (allCompleted && user) {
      localStorage.setItem(`onboarding_${user.id}`, 'true');
    }
  };

  const triggerStep = (triggerEvent: OnboardingStep['triggerEvent']) => {
    if (!isNewUser || !user) return;

    const nextStep = steps.find(step => 
      step.triggerEvent === triggerEvent && !step.completed
    );

    if (nextStep) {
      setCurrentStep(nextStep);
    }
  };

  const dismissCurrentStep = () => {
    if (currentStep) {
      completeStep(currentStep.id);
    }
  };

  useEffect(() => {
    fetchOnboardingProgress();
  }, [user]);

  return {
    steps,
    currentStep,
    isNewUser,
    loading,
    completeStep,
    triggerStep,
    dismissCurrentStep,
    refetch: fetchOnboardingProgress
  };
};