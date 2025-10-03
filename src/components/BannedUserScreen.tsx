import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Ban, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannedUserScreenProps {
  bannedUntil: string;
  onCheckStatus: () => void;
}

export const BannedUserScreen = ({ bannedUntil, onCheckStatus }: BannedUserScreenProps) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const until = new Date(bannedUntil);
      const diff = until.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('El baneo ha expirado');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [bannedUntil]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Ban className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Cuenta Suspendida</CardTitle>
          <CardDescription>
            Tu cuenta ha sido temporalmente suspendida debido a múltiples advertencias por comportamiento tóxico.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Tiempo restante:</span>
            </div>
            <p className="text-2xl font-bold text-center">{timeRemaining}</p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📋 <strong>¿Por qué fui suspendido?</strong></p>
            <p>Has recibido 3 advertencias por usar lenguaje tóxico, insultos o contenido inapropiado.</p>
            
            <p className="mt-4">🔄 <strong>¿Qué sucede después?</strong></p>
            <p>Una vez expire el baneo, tu cuenta será reactivada automáticamente y tus advertencias se resetearán.</p>
            
            <p className="mt-4">💡 <strong>Recomendación:</strong></p>
            <p>Mantén un lenguaje respetuoso y constructivo para evitar futuras suspensiones.</p>
          </div>

          <Button 
            onClick={onCheckStatus} 
            className="w-full"
            variant="outline"
          >
            Verificar Estado
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
