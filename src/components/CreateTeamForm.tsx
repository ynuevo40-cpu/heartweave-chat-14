import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CreateTeamForm = () => {
  const [image, setImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Equipo creado",
      description: "Tu equipo ha sido publicado",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="team-name" className="text-base font-semibold">Nombre del equipo</Label>
        <Input id="team-name" placeholder="Ej: Equipo de Desarrollo Web" className="h-11" required />
      </div>

      <div className="space-y-3">
        <Label htmlFor="team-description" className="text-base font-semibold">Descripción</Label>
        <Textarea
          id="team-description"
          placeholder="Describe el propósito del equipo, área de enfoque y tipo de miembros que buscas..."
          className="min-h-[140px]"
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="team-area" className="text-base font-semibold">Área de enfoque</Label>
        <Select required>
          <SelectTrigger id="team-area">
            <SelectValue placeholder="Selecciona un área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tecnologia">Tecnología</SelectItem>
            <SelectItem value="diseno">Diseño</SelectItem>
            <SelectItem value="negocios">Negocios</SelectItem>
            <SelectItem value="investigacion">Investigación</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="team-size-limit" className="text-base font-semibold">Límite de miembros (opcional)</Label>
        <Input id="team-size-limit" type="number" min="2" placeholder="Número máximo de miembros" className="h-11" />
      </div>

      <div className="space-y-3">
        <Label htmlFor="team-skills" className="text-base font-semibold">Habilidades requeridas</Label>
        <Input id="team-skills" placeholder="Ej: React, Node.js, UI/UX, SEO" className="h-11" required />
      </div>

      <div className="space-y-3">
        <Label htmlFor="team-image" className="text-base font-semibold">Imagen del equipo (opcional)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="team-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("team-image")?.click()}
            className="w-full h-11"
          >
            <Upload className="h-4 w-4 mr-2" />
            {image ? "Cambiar imagen" : "Subir imagen"}
          </Button>
        </div>
        {image && (
          <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg mt-3 border border-border" />
        )}
      </div>

      <Button type="submit" className="w-full h-11 mt-2">
        Crear equipo
      </Button>
    </form>
  );
};
