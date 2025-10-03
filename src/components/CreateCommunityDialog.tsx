import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, description: string) => Promise<void>;
}

export const CreateCommunityDialog = ({ 
  open, 
  onOpenChange, 
  onCreate 
}: CreateCommunityDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setIsCreating(true);
    await onCreate(name, description);
    setIsCreating(false);
    
    // Reset y cerrar
    setName('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Comunidad</DialogTitle>
          <DialogDescription>
            Crea un espacio para reunir personas con intereses comunes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Comunidad *</Label>
            <Input
              id="name"
              placeholder="Ej: Gamers, Música, Tecnología..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              {name.length}/50 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe de qué trata esta comunidad..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/200 caracteres
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!name.trim() || isCreating}
          >
            {isCreating ? 'Creando...' : 'Crear Comunidad'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
