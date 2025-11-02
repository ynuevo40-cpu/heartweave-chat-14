import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid3x3, Award, Bookmark, GraduationCap, Calendar, TrendingUp, MapPin, Link as LinkIcon, Github, Linkedin, Mail } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

const Profile = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("grid");

  const userPosts = [
    { id: 1, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop" },
    { id: 2, image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop" },
    { id: 3, image: "https://images.unsplash.com/photo-1488590286598-408f3b3d7f5f?w=400&h=400&fit=crop" },
    { id: 4, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop" },
    { id: 5, image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop" },
    { id: 6, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <div className="container mx-auto px-0 md:px-4 pt-20 pb-24 max-w-2xl">
        {/* Profile Header */}
        <div className="bg-card rounded-t-3xl p-8 border border-border shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div className="relative">
              <Avatar className="w-28 h-28 border-4 border-primary/20 shadow-xl ring-4 ring-primary/10">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold">TI</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-xl shadow-lg hover:scale-110 transition-all hover:bg-primary/90">
                +
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
                className="shadow-sm"
              >
                {isFollowing ? "Siguiendo" : "Seguir"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm"
              >
                Editar portada
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around py-6 my-6 border-y border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">42</div>
              <div className="text-sm text-muted-foreground font-medium">Posts</div>
            </div>
            <div className="w-px bg-border"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">1.2K</div>
              <div className="text-sm text-muted-foreground font-medium">Seguidores</div>
            </div>
            <div className="w-px bg-border"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">324</div>
              <div className="text-sm text-muted-foreground font-medium">Seguidos</div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Innovador Tech</h2>
            <p className="text-base text-foreground/90 mb-2 font-medium">
              Desarrollador Full Stack | Creador de Ideas 💡
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Conectando personas con proyectos innovadores y creando soluciones tecnológicas
            </p>
            
            {/* Enlaces rápidos */}
            <div className="flex gap-3 mt-3">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Información Académica */}
        <Card className="mt-6 border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Información Académica</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground">Universidad Tecnológica Nacional</p>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    Verificada
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Buenos Aires, Argentina</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Carrera</p>
                  <p className="text-sm font-medium text-foreground">Ingeniería en Sistemas</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Año Actual</p>
                  <p className="text-sm font-medium text-foreground">4to Año</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Graduación</p>
                    <p className="text-sm font-medium text-foreground">Diciembre 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Promedio</p>
                    <p className="text-sm font-medium text-foreground">8.7/10</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habilidades e Intereses */}
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Habilidades e Intereses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-secondary">React</Badge>
              <Badge variant="secondary" className="bg-secondary">TypeScript</Badge>
              <Badge variant="secondary" className="bg-secondary">Node.js</Badge>
              <Badge variant="secondary" className="bg-secondary">Python</Badge>
              <Badge variant="secondary" className="bg-secondary">IA & ML</Badge>
              <Badge variant="secondary" className="bg-secondary">Cloud Computing</Badge>
              <Badge variant="secondary" className="bg-secondary">DevOps</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Proyectos Destacados */}
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Proyectos Destacados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <h4 className="font-semibold text-sm text-foreground mb-1">Sistema de Gestión Universitaria</h4>
              <p className="text-xs text-muted-foreground mb-2">Plataforma web para administración de cursos y estudiantes</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">React</Badge>
                <Badge variant="outline" className="text-xs">MongoDB</Badge>
                <Badge variant="outline" className="text-xs">Express</Badge>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <h4 className="font-semibold text-sm text-foreground mb-1">App de Estudio Colaborativo</h4>
              <p className="text-xs text-muted-foreground mb-2">Aplicación móvil para grupos de estudio y compartir recursos</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">React Native</Badge>
                <Badge variant="outline" className="text-xs">Firebase</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-card border-x border-border rounded-none h-16 p-0 shadow-sm">
            <TabsTrigger 
              value="grid" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full text-muted-foreground data-[state=active]:text-primary transition-all"
            >
              <Grid3x3 className="w-6 h-6" />
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full text-muted-foreground data-[state=active]:text-primary transition-all"
            >
              <Award className="w-6 h-6" />
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full text-muted-foreground data-[state=active]:text-primary transition-all"
            >
              <Bookmark className="w-6 h-6" />
            </TabsTrigger>
          </TabsList>

          {/* Grid Content */}
          <TabsContent value="grid" className="mt-0 bg-card rounded-b-3xl border-x border-b border-border p-2 shadow-lg">
            <div className="grid grid-cols-3 gap-2">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square bg-muted rounded-xl overflow-hidden hover:scale-[1.02] transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <img
                    src={post.image}
                    alt={`Post ${post.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-0 bg-card rounded-b-3xl border-x border-b border-border p-8 shadow-lg">
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground font-medium">Logros y reconocimientos próximamente</p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0 bg-card rounded-b-3xl border-x border-b border-border p-8 shadow-lg">
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground font-medium">Publicaciones guardadas próximamente</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
