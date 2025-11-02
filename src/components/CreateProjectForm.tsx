import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CreateProjectForm = () => {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const { toast } = useToast();

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
        setMediaType(type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Proyecto publicado",
      description: "Tu proyecto ha sido compartido con la comunidad",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="project-title" className="text-base font-semibold text-foreground">Nombre del proyecto</Label>
        <Input id="project-title" placeholder="Ej: Startup de Sostenibilidad Urbana" className="h-11" required />
      </div>

      <div className="space-y-4">
        <Label htmlFor="project-description" className="text-base font-semibold text-foreground">Descripción del proyecto</Label>
        <Textarea
          id="project-description"
          placeholder="Describe el estado actual del proyecto, objetivos y logros..."
          className="min-h-[140px]"
          required
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="project-category" className="text-base font-semibold text-foreground">Categoría</Label>
        <Select required>
          <SelectTrigger id="project-category">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tecnologia">Tecnología</SelectItem>
            <SelectItem value="diseno">Diseño</SelectItem>
            <SelectItem value="emprendimiento">Emprendimiento</SelectItem>
            <SelectItem value="investigacion">Investigación</SelectItem>
            <SelectItem value="social">Impacto Social</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="project-stage" className="text-base font-semibold text-foreground">Etapa del proyecto</Label>
        <Select required>
          <SelectTrigger id="project-stage">
            <SelectValue placeholder="Selecciona la etapa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mvp">MVP / Prototipo</SelectItem>
            <SelectItem value="desarrollo">En desarrollo</SelectItem>
            <SelectItem value="beta">Fase beta</SelectItem>
            <SelectItem value="lanzado">Lanzado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="team-size" className="text-base font-semibold text-foreground">Tamaño del equipo</Label>
        <Input id="team-size" type="number" min="1" placeholder="Número de miembros" className="h-11" required />
      </div>

      <div className="space-y-4">
        <Label htmlFor="project-url" className="text-base font-semibold text-foreground">Sitio web o repositorio (opcional)</Label>
        <Input id="project-url" type="url" placeholder="https://..." className="h-11" />
      </div>

      <div className="space-y-4 py-2">
        <Label className="text-base font-semibold text-foreground">Medios del proyecto (opcional)</Label>
        <div className="flex gap-3">
          <Input
            id="project-image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleMediaChange(e, "image")}
            className="hidden"
          />
          <Input
            id="project-video-upload"
            type="file"
            accept="video/*"
            onChange={(e) => handleMediaChange(e, "video")}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("project-image-upload")?.click()}
            className="flex-1 h-11 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:bg-primary/20 transition-all group"
          >
            <ImagePlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Imagen
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("project-video-upload")?.click()}
            className="flex-1 h-11 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 hover:bg-accent/20 transition-all group"
          >
            <Video className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Video
          </Button>
        </div>
        {mediaPreview && (
          <div className="relative mt-4">
            {mediaType === "image" ? (
              <img src={mediaPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-border" />
            ) : (
              <video src={mediaPreview} controls className="w-full h-48 object-cover rounded-lg border border-border" />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setMediaPreview(null);
                setMediaType(null);
              }}
              className="absolute top-2 right-2 h-8 w-8 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white shadow-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full h-11 mt-8 font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
        Publicar proyecto
      </Button>
    </form>
  );
};
