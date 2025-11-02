import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

const groups = [
  {
    name: "Emprendedores Tech UNAM",
    members: 342,
    category: "Emprendimiento",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=tech",
    description: "Comunidad de estudiantes creando startups tecnológicas"
  },
  {
    name: "IA y Machine Learning",
    members: 289,
    category: "Tecnología",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=ai",
    description: "Compartiendo conocimiento sobre IA y ML"
  },
  {
    name: "Diseñadores UX/UI",
    members: 156,
    category: "Diseño",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=design",
    description: "Diseño de experiencias digitales"
  },
  {
    name: "Sostenibilidad Campus",
    members: 203,
    category: "Sustentabilidad",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=sustain",
    description: "Proyectos verdes y ecológicos"
  }
];

export const SuggestedGroups = () => {
  return (
    <div className="mb-6 bg-card border-y border-border">
      <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-foreground">Grupos Sugeridos</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          Ver todos
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {groups.map((group) => (
          <div
            key={group.name}
            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
          >
            <img
              src={group.image}
              alt={group.name}
              className="w-12 h-12 rounded-lg bg-primary/10"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {group.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                {group.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {group.members} miembros
                </span>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-primary">
                  <Plus className="h-3 w-3 mr-1" />
                  Unirse
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};
