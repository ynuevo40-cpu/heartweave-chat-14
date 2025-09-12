import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

export const OnboardingTooltip = () => {
  const { currentStep, dismissCurrentStep, isNewUser } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (currentStep && isNewUser) {
      // Small delay to ensure element is rendered
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [currentStep, isNewUser]);

  if (!currentStep || !isVisible || !isNewUser) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      dismissCurrentStep();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop with subtle overlay */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-sm pointer-events-auto" />
      
      {/* Floating tooltip */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <Card className="glass border-primary/50 max-w-sm mx-4 animate-scale-in glow-primary">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  {currentStep.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentStep.description}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 h-auto text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleDismiss}
                size="sm"
                className="bg-gradient-primary hover:scale-105 transition-all"
              >
                Entendido
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Highlight target element if specified */}
      {currentStep.targetElement && (
        <style>
          {`
            [data-onboarding="${currentStep.targetElement}"] {
              position: relative;
              z-index: 51;
              box-shadow: 0 0 0 4px hsl(var(--primary) / 0.3), 0 0 20px hsl(var(--primary) / 0.5);
              border-radius: 8px;
              animation: onboarding-pulse 2s ease-in-out infinite;
            }
            
            @keyframes onboarding-pulse {
              0%, 100% {
                box-shadow: 0 0 0 4px hsl(var(--primary) / 0.3), 0 0 20px hsl(var(--primary) / 0.5);
              }
              50% {
                box-shadow: 0 0 0 8px hsl(var(--primary) / 0.2), 0 0 30px hsl(var(--primary) / 0.7);
              }
            }
          `}
        </style>
      )}
    </div>
  );
};