import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ModerationWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warningCount: number;
  reason: string;
}

export const ModerationWarningDialog = ({ 
  open, 
  onOpenChange, 
  warningCount,
  reason 
}: ModerationWarningDialogProps) => {
  const getWarningMessage = () => {
    switch (warningCount) {
      case 1:
        return {
          title: '⚠️ Primera Advertencia',
          description: `Tu mensaje ha sido bloqueado por contenido inapropiado.\n\nRazón: ${reason}\n\nPor favor, mantén un lenguaje respetuoso. La próxima advertencia resultará en pérdida de corazones.`
        };
      case 2:
        return {
          title: '🚨 Segunda Advertencia',
          description: `Tu mensaje ha sido bloqueado y se han descontado 20 corazones.\n\nRazón: ${reason}\n\nUna tercera advertencia resultará en suspensión temporal de 24 horas.`
        };
      default:
        return {
          title: '🚫 Cuenta Suspendida',
          description: `Tu cuenta ha sido suspendida por 24 horas debido a comportamiento tóxico reiterado.\n\nRazón: ${reason}\n\nSe han descontado 50 corazones adicionales.`
        };
    }
  };

  const { title, description } = getWarningMessage();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="whitespace-pre-line text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Entendido</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
