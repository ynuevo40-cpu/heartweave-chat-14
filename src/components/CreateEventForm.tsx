import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CreateEventForm = () => {
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
      title: "Evento creado",
      description: "Tu evento ha sido publicado",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="event-name" className="text-base font-semibold">Nombre del evento</Label>
        <Input id="event-name" placeholder="Ej: Hackathon Universitario 2024" className="h-11" required />
      </div>

      <div className="space-y-3">
        <Label htmlFor="event-description" className="text-base font-semibold">Descripción</Label>
        <Textarea
          id="event-description"
          placeholder="Describe el evento, agenda, qué pueden esperar los asistentes..."
          className="min-h-[140px]"
          required
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="event-type" className="text-base font-semibold">Tipo de evento</Label>
        <Select required>
          <SelectTrigger id="event-type">
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="hackathon">Hackathon</SelectItem>
            <SelectItem value="conferencia">Conferencia</SelectItem>
            <SelectItem value="networking">Networking</SelectItem>
            <SelectItem value="competencia">Competencia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="event-date" className="text-base font-semibold">Fecha</Label>
          <Input id="event-date" type="date" className="h-11" required />
        </div>
        <div className="space-y-3">
          <Label htmlFor="event-time" className="text-base font-semibold">Hora</Label>
          <Input id="event-time" type="time" className="h-11" required />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="event-location" className="text-base font-semibold">Ubicación</Label>
        <Input id="event-location" placeholder="Ej: Auditorio Principal, UNAM" className="h-11" required />
      </div>

      <div className="space-y-3">
        <Label htmlFor="event-mode" className="text-base font-semibold">Modalidad</Label>
        <Select required>
          <SelectTrigger id="event-mode">
            <SelectValue placeholder="Selecciona la modalidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="presencial">Presencial</SelectItem>
            <SelectItem value="virtual">Virtual</SelectItem>
            <SelectItem value="hibrido">Híbrido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="event-capacity" className="text-base font-semibold">Capacidad (opcional)</Label>
        <Input id="event-capacity" type="number" min="1" placeholder="Número máximo de asistentes" className="h-11" />
      </div>

      <div className="space-y-3">
        <Label htmlFor="event-image" className="text-base font-semibold">Imagen del evento (opcional)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="event-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("event-image")?.click()}
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
        Publicar evento
      </Button>
    </form>
  );
};
