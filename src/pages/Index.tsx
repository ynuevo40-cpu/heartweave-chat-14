import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { ProjectCard } from "@/components/ProjectCard";
import { QuickActions } from "@/components/QuickActions";
import { CreatePostPrompt } from "@/components/CreatePostPrompt";
import { SuggestedUsers } from "@/components/SuggestedUsers";
import { SuggestedGroups } from "@/components/SuggestedGroups";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

type FilterType = "all" | "proyecto" | "equipo" | "idea" | "evento" | "text";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const projects = [
    {
      author: {
        name: "Emprendedores Tech UNAM",
        role: "Grupo • 342 miembros",
        avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=tech",
        isGroup: true,
      },
      title: "Meetup: Pitch Night este Viernes",
      description:
        "🎤 ¡Únete a nuestra noche de pitches! Estudiantes presentarán sus ideas de startup. Habrá networking, pizza y premios para las mejores presentaciones. Cupos limitados, regístrate en el link.",
      category: "Evento",
      type: "evento" as const,
      likes: 156,
      comments: 34,
      timeAgo: "Hace 1 hora",
      groupName: "Emprendedores Tech UNAM",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop",
    },
    {
      author: {
        name: "Juan Pérez",
        role: "Estudiante de Ingeniería • UNAM",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
      },
      title: "Reflexión sobre el futuro",
      description:
        "Hoy me di cuenta de que la mejor manera de predecir el futuro es creándolo. ¿Están listos para construir algo increíble juntos? 💡",
      category: "Reflexión",
      type: "text" as const,
      likes: 28,
      comments: 7,
      timeAgo: "Hace 30 min",
    },
    {
      author: {
        name: "María González",
        role: "Ingeniería en Sistemas • UNAM",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      },
      title: "App de Mentoría Estudiantil",
      description:
        "Busco desarrolladores y diseñadores para crear una app que conecte estudiantes senior con juniors. ¿Te unes al equipo?",
      category: "Tecnología",
      type: "idea" as const,
      likes: 45,
      comments: 12,
      timeAgo: "Hace 2 horas",
      participants: ["María González", "Carlos Ruiz", "Ana Martínez", "Pedro López", "Laura Torres"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    },
    {
      author: {
        name: "Carlos Ruiz",
        role: "Administración de Empresas • Tec",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      },
      title: "Startup de Sostenibilidad Urbana",
      description:
        "Proyecto en desarrollo para reducir residuos plásticos en universidades. Ya tenemos MVP funcionando y estamos escalando.",
      category: "Emprendimiento",
      type: "proyecto" as const,
      likes: 67,
      comments: 23,
      timeAgo: "Hace 5 horas",
      teamMembers: 8,
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop",
    },
    {
      author: {
        name: "Sostenibilidad Campus",
        role: "Grupo • 203 miembros",
        avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=sustain",
        isGroup: true,
      },
      title: "Nueva iniciativa: Huertos Universitarios",
      description:
        "🌱 Estamos lanzando un proyecto para crear huertos comunitarios en el campus. Ya tenemos el apoyo de la facultad de Biología. Buscamos voluntarios y patrocinadores. ¡Ayúdanos a hacer más verde nuestra universidad!",
      category: "Sustentabilidad",
      type: "proyecto" as const,
      likes: 92,
      comments: 28,
      timeAgo: "Hace 4 horas",
      teamMembers: 15,
      groupName: "Sostenibilidad Campus",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop",
    },
    {
      author: {
        name: "Ana Martínez",
        role: "Diseño Industrial • UAM",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      },
      title: "Plataforma de Freelance Universitario",
      description:
        "Idea: crear un marketplace donde estudiantes ofrezcan sus servicios (diseño, programación, tutorías). ¿Alguien se anima a co-fundar?",
      category: "Diseño",
      type: "idea" as const,
      likes: 34,
      comments: 8,
      timeAgo: "Hace 1 día",
      participants: ["Ana Martínez", "Pedro López", "Sofía Ramírez"],
      image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&auto=format&fit=crop",
    },
    {
      author: {
        name: "Roberto Sánchez",
        role: "Ingeniería Mecatrónica • IPN",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
      },
      title: "Robot Asistente para Laboratorios",
      description:
        "Proyecto en fase de prototipado. Robot móvil que ayuda en laboratorios universitarios. Presentando en competencia nacional próximamente.",
      category: "Tecnología",
      type: "proyecto" as const,
      likes: 89,
      comments: 31,
      timeAgo: "Hace 3 horas",
      teamMembers: 5,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop",
    },
  ];

  const trending = [
    "IA en educación",
    "Fintech estudiantil",
    "Sostenibilidad",
    "Web3 y blockchain",
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.type === activeFilter);

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="pt-4">
        <QuickActions activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        <CreatePostPrompt />

        <div className="mb-6 bg-card border-y border-border">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-sm text-foreground">Tendencias</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {trending.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-muted text-foreground rounded text-xs font-medium hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <SuggestedUsers />

        <SuggestedGroups />

        {activeFilter !== "all" && (
          <div className="mb-4 bg-primary/10 border-y border-primary/30">
            <div className="flex items-center justify-between text-primary px-4 py-3">
              <p className="text-sm font-medium">
                Mostrando {filteredProjects.length} {filteredProjects.length === 1 ? "resultado" : "resultados"}
              </p>
              <button
                onClick={() => setActiveFilter("all")}
                className="text-xs underline hover:no-underline"
              >
                Ver todo
              </button>
            </div>
          </div>
        )}

        <div className="space-y-0">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))
          ) : (
            <div className="p-12 text-center bg-card border-y border-border">
              <p className="text-muted-foreground">No hay publicaciones de este tipo</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
