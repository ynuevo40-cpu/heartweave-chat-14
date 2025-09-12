import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useBackgroundSettings } from '@/hooks/useBackgroundSettings';

export const BackgroundSelector = () => {
  const { 
    currentBackground, 
    allBackgrounds, 
    loading, 
    changeBackground 
  } = useBackgroundSettings();

  if (loading) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse text-center text-muted-foreground">
            Cargando fondos...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Personalización de Fondo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Background Preview */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Fondo actual:</p>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
            <div 
              className="w-8 h-8 rounded-md border border-border/50"
              style={{ background: currentBackground.preview }}
            />
            <div className="flex-1">
              <p className="font-medium">{currentBackground.name}</p>
              <Badge variant="secondary" className="text-xs">
                {currentBackground.type === 'preset' ? 'Prediseñado' : 'Personalizado'}
              </Badge>
            </div>
            <Check className="h-4 w-4 text-success" />
          </div>
        </div>

        {/* Background Selector Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              Cambiar Fondo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Seleccionar Fondo
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Preset Backgrounds */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Fondos Prediseñados
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allBackgrounds
                    .filter(bg => bg.type === 'preset')
                    .map((background) => (
                      <button
                        key={background.id}
                        onClick={() => changeBackground(background)}
                        className={`relative p-3 rounded-lg border transition-all hover:scale-105 ${
                          currentBackground.id === background.id
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        <div 
                          className="w-full h-16 rounded-md mb-2 border border-border/30"
                          style={{ background: background.preview }}
                        />
                        <p className="text-xs font-medium truncate">
                          {background.name}
                        </p>
                        {currentBackground.id === background.id && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                </div>
              </div>

              {/* Custom Backgrounds Section - Coming Soon */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Fondos Personalizados
                </h3>
                <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-lg">
                  <Palette className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Próximamente: Subir imágenes personalizadas
                  </p>
                  <Badge variant="secondary">En desarrollo</Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};