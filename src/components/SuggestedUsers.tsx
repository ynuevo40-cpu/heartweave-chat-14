import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SuggestedUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  followers: string;
  postsPerDay: string;
  coverImage?: string;
  mutualConnections?: number;
}

const mockSuggestedUsers: SuggestedUser[] = [
  {
    id: "1",
    name: "Dr. Elena Ramírez",
    role: "Profesora de IA • MIT",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    followers: "89 mil seguidores",
    postsPerDay: "+15 publicaciones al día",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=100&fit=crop",
    mutualConnections: 12,
  },
  {
    id: "2",
    name: "Miguel Ángel Torres",
    role: "Founder @ TechStart • Ex-Google",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel",
    followers: "67 mil seguidores",
    postsPerDay: "+8 publicaciones al día",
    coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=100&fit=crop",
    mutualConnections: 8,
  },
  {
    id: "3",
    name: "Sofía Mendoza",
    role: "UX Designer • Fintech Leader",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    followers: "45 mil seguidores",
    postsPerDay: "+12 publicaciones al día",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=100&fit=crop",
    mutualConnections: 5,
  },
  {
    id: "4",
    name: "Dr. Ricardo Campos",
    role: "Investigador • Stanford • Blockchain",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo",
    followers: "92 mil seguidores",
    postsPerDay: "+6 publicaciones al día",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=100&fit=crop",
    mutualConnections: 15,
  },
  {
    id: "5",
    name: "Laura Vega",
    role: "Emprendedora Serial • Sostenibilidad",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
    followers: "54 mil seguidores",
    postsPerDay: "+10 publicaciones al día",
    coverImage: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=400&h=100&fit=crop",
    mutualConnections: 7,
  },
  {
    id: "6",
    name: "Alejandro Ruiz",
    role: "CTO @ StartupHub • Full Stack Dev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alejandro",
    followers: "38 mil seguidores",
    postsPerDay: "+7 publicaciones al día",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=100&fit=crop",
    mutualConnections: 4,
  },
  {
    id: "7",
    name: "Diana Herrera",
    role: "Product Manager • EdTech Pioneer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
    followers: "76 mil seguidores",
    postsPerDay: "+9 publicaciones al día",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=100&fit=crop",
    mutualConnections: 11,
  },
  {
    id: "8",
    name: "Fernando López",
    role: "Angel Investor • Mentor • Speaker",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fernando",
    followers: "125 mil seguidores",
    postsPerDay: "+5 publicaciones al día",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=100&fit=crop",
    mutualConnections: 20,
  },
];

export const SuggestedUsers = () => {
  const [users, setUsers] = useState(mockSuggestedUsers);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleFollow = (userId: string, userName: string) => {
    setFollowedUsers(prev => new Set(prev).add(userId));
    toast({
      title: "Usuario seguido",
      description: `Ahora sigues a ${userName}`,
    });
  };

  const handleSuppress = (userId: string, userName: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuario suprimido",
      description: `${userName} ya no aparecerá en tus sugerencias`,
    });
  };

  const handleSeeMore = () => {
    toast({
      title: "Próximamente",
      description: "Más sugerencias de usuarios estarán disponibles pronto",
    });
  };

  if (users.length === 0) return null;

  return (
    <div className="mb-6 bg-card border-y border-border">
      <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-foreground">Tus sugerencias de usuarios</h2>
        </div>
      </div>

      {/* Carrusel horizontal */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex-shrink-0 w-[280px] snap-start"
            >
              <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow">
                {/* Cover Image */}
                {user.coverImage && (
                  <div
                    className="h-20 bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.coverImage})` }}
                  />
                )}

                <div className="p-4">
                  {/* Avatar */}
                  <div className={`flex justify-center ${user.coverImage ? '-mt-10' : ''} mb-3`}>
                    <Avatar className="h-16 w-16 border-4 border-background">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </div>

                  {/* User Info */}
                  <div className="text-center mb-3">
                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {user.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {user.role}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-1 mb-4">
                    <p className="text-xs text-muted-foreground text-center">
                      {user.followers}
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      {user.postsPerDay}
                    </p>
                    {user.mutualConnections && user.mutualConnections > 0 && (
                      <p className="text-xs text-primary text-center font-medium">
                        {user.mutualConnections} {user.mutualConnections === 1 ? 'conexión mutua' : 'conexiones mutuas'}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant={followedUsers.has(user.id) ? "secondary" : "default"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleFollow(user.id, user.name)}
                      disabled={followedUsers.has(user.id)}
                    >
                      {followedUsers.has(user.id) ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Siguiendo
                        </>
                      ) : (
                        'Seguir'
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSuppress(user.id, user.name)}
                      className="px-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Ver más */}
      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSeeMore}
          className="text-primary hover:text-primary/80"
        >
          Ver más usuarios →
        </Button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      </div>
    </div>
  );
};
