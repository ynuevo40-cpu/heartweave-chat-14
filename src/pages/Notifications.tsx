import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, UserPlus, Lightbulb, Briefcase, Users, ThumbsUp } from "lucide-react";

interface Notification {
  id: number;
  type: "like" | "comment" | "follow" | "join" | "mention";
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timeAgo: string;
  isRead: boolean;
  postPreview?: string;
}

const Notifications = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: "like",
      user: {
        name: "María González",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      },
      content: "le gustó tu publicación",
      postPreview: "App de Mentoría Estudiantil",
      timeAgo: "Hace 5 min",
      isRead: false,
    },
    {
      id: 2,
      type: "comment",
      user: {
        name: "Carlos Ruiz",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      },
      content: "comentó en tu idea",
      postPreview: "Plataforma de Freelance Universitario",
      timeAgo: "Hace 15 min",
      isRead: false,
    },
    {
      id: 3,
      type: "follow",
      user: {
        name: "Ana Martínez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      },
      content: "comenzó a seguirte",
      timeAgo: "Hace 1 hora",
      isRead: false,
    },
    {
      id: 4,
      type: "join",
      user: {
        name: "Pedro López",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
      },
      content: "se unió a tu idea",
      postPreview: "App de Mentoría Estudiantil",
      timeAgo: "Hace 2 horas",
      isRead: true,
    },
    {
      id: 5,
      type: "like",
      user: {
        name: "Laura Torres",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
      },
      content: "reaccionó con ❤️ a tu proyecto",
      postPreview: "Robot Asistente para Laboratorios",
      timeAgo: "Hace 3 horas",
      isRead: true,
    },
    {
      id: 6,
      type: "mention",
      user: {
        name: "Roberto Sánchez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
      },
      content: "te mencionó en un comentario",
      postPreview: "¿Alguien conoce a @tech_innovator?",
      timeAgo: "Hace 5 horas",
      isRead: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "join":
        return <Users className="w-4 h-4 text-purple-500" />;
      case "mention":
        return <ThumbsUp className="w-4 h-4 text-yellow-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-primary" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />

      <main className="max-w-screen-xl mx-auto px-0 md:px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-4 md:px-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notificaciones</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Tienes {unreadCount} notificación{unreadCount !== 1 ? "es" : ""} nueva{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-3 py-1">
              {unreadCount} nuevas
            </Badge>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full px-4 md:px-0">
          <TabsList className="w-full grid grid-cols-4 mb-6 bg-card border border-border h-12">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
              Todas
            </TabsTrigger>
            <TabsTrigger value="likes" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
              <Heart className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="comments" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
              <MessageSquare className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="people" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10">
              <Users className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          {/* All Notifications */}
          <TabsContent value="all" className="space-y-2">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-all cursor-pointer border-border hover:shadow-[var(--shadow-hover)] ${
                  !notification.isRead ? "bg-primary/5 border-l-4 border-l-primary" : ""
                }`}
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                        {notification.user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-full flex items-center justify-center border-2 border-card shadow-md">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold text-foreground">
                        {notification.user.name}
                      </span>{" "}
                      <span className="text-muted-foreground">{notification.content}</span>
                    </p>
                    {notification.postPreview && (
                      <p className="text-sm text-primary/80 mt-1 truncate">
                        "{notification.postPreview}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.timeAgo}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Likes Tab */}
          <TabsContent value="likes" className="space-y-2">
            {notifications
              .filter((n) => n.type === "like")
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 transition-all cursor-pointer border-border hover:shadow-[var(--shadow-hover)] ${
                    !notification.isRead ? "bg-primary/5 border-l-4 border-l-red-500" : ""
                  }`}
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-red-500/20">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>{notification.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{notification.user.name}</span>{" "}
                        <span className="text-muted-foreground">{notification.content}</span>
                      </p>
                      {notification.postPreview && (
                        <p className="text-sm text-primary/80 mt-1">"{notification.postPreview}"</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{notification.timeAgo}</p>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-2">
            {notifications
              .filter((n) => n.type === "comment" || n.type === "mention")
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 transition-all cursor-pointer border-border hover:shadow-[var(--shadow-hover)] ${
                    !notification.isRead ? "bg-primary/5 border-l-4 border-l-blue-500" : ""
                  }`}
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-blue-500/20">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>{notification.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{notification.user.name}</span>{" "}
                        <span className="text-muted-foreground">{notification.content}</span>
                      </p>
                      {notification.postPreview && (
                        <p className="text-sm text-primary/80 mt-1">"{notification.postPreview}"</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{notification.timeAgo}</p>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>

          {/* People Tab */}
          <TabsContent value="people" className="space-y-2">
            {notifications
              .filter((n) => n.type === "follow" || n.type === "join")
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 transition-all cursor-pointer border-border hover:shadow-[var(--shadow-hover)] ${
                    !notification.isRead ? "bg-primary/5 border-l-4 border-l-green-500" : ""
                  }`}
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-green-500/20">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback>{notification.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{notification.user.name}</span>{" "}
                        <span className="text-muted-foreground">{notification.content}</span>
                      </p>
                      {notification.postPreview && (
                        <p className="text-sm text-primary/80 mt-1">"{notification.postPreview}"</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{notification.timeAgo}</p>
                    </div>
                  </div>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Notifications;
