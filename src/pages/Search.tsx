import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, TrendingUp, Users, Lightbulb, Briefcase } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingTopics = [
    { name: "IA en educación", count: "2.3K publicaciones", icon: Lightbulb, color: "from-yellow-500 to-orange-500" },
    { name: "Fintech estudiantil", count: "1.8K publicaciones", icon: Briefcase, color: "from-green-500 to-emerald-500" },
    { name: "Sostenibilidad", count: "3.1K publicaciones", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
    { name: "Web3 y blockchain", count: "1.2K publicaciones", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
  ];

  const suggestedUsers = [
    {
      name: "Dr. Luis Hernández",
      role: "Profesor de IA • MIT",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis",
      followers: "15.2K",
    },
    {
      name: "Ana Rodríguez",
      role: "Emprendedora Tech • YC Alumni",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaR",
      followers: "8.9K",
    },
    {
      name: "Carlos Mendoza",
      role: "Investigador Blockchain • Stanford",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosM",
      followers: "12.4K",
    },
  ];

  const recentProjects = [
    {
      author: {
        name: "Sofía Ramírez",
        role: "Ingeniería en Sistemas • ITESM",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
      },
      title: "Asistente IA para Estudiantes",
      description: "Chatbot inteligente que ayuda a estudiantes con dudas académicas 24/7. Integración con GPT-4.",
      category: "Inteligencia Artificial",
      type: "proyecto" as const,
      likes: 124,
      comments: 34,
      timeAgo: "Hace 1 hora",
      teamMembers: 6,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
    },
    {
      author: {
        name: "Miguel Torres",
        role: "Finanzas • UNAM",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel",
      },
      title: "App de Inversión para Jóvenes",
      description: "Plataforma que enseña a estudiantes sobre inversiones mientras invierten cantidades pequeñas.",
      category: "Fintech",
      type: "idea" as const,
      likes: 89,
      comments: 23,
      timeAgo: "Hace 3 horas",
      participants: ["Miguel Torres", "Laura Gómez", "Roberto Cruz"],
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="max-w-screen-xl mx-auto px-0 md:px-4 pt-4">
        {/* Search Bar */}
        <div className="relative mb-6 px-4 md:px-0">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ideas, proyectos, personas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-card border-border focus:border-primary/50 transition-colors"
          />
        </div>

        <Tabs defaultValue="trending" className="w-full px-4 md:px-0">
          <TabsList className="w-full grid grid-cols-3 mb-6 bg-card border border-border h-12">
            <TabsTrigger value="trending" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
              <TrendingUp className="w-4 h-4" />
              Tendencias
            </TabsTrigger>
            <TabsTrigger value="people" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
              <Users className="w-4 h-4" />
              Personas
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
              <Lightbulb className="w-4 h-4" />
              Recientes
            </TabsTrigger>
          </TabsList>

          {/* Trending Topics Tab */}
          <TabsContent value="trending" className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <Card
                key={index}
                className="p-4 hover:shadow-[var(--shadow-hover)] transition-all cursor-pointer border-border group"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <topic.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      #{topic.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{topic.count}</p>
                  </div>
                  <Badge variant="secondary" className="font-medium">
                    Tendencia
                  </Badge>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* People Tab */}
          <TabsContent value="people" className="space-y-3">
            {suggestedUsers.map((user, index) => (
              <Card
                key={index}
                className="p-4 hover:shadow-[var(--shadow-hover)] transition-all cursor-pointer border-border group"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                      {user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.followers} seguidores
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0">
                    Seguir
                  </Badge>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Recent Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {recentProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
