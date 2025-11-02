import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, ThumbsUp, Lightbulb, Flame, Users, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ReactionsDialog from "./ReactionsDialog";
import { ImageLightbox } from "./ImageLightbox";
import { CommentsSection } from "./CommentsSection";

interface ProjectCardProps {
  author: {
    name: string;
    role: string;
    avatar: string;
    isGroup?: boolean;
  };
  title: string;
  description: string;
  category: string;
  type: "idea" | "proyecto" | "text" | "evento" | "equipo";
  likes: number;
  comments: number;
  timeAgo: string;
  teamMembers?: number;
  participants?: string[];
  image?: string;
  groupName?: string;
}

export const ProjectCard = ({
  author,
  title,
  description,
  category,
  type,
  likes,
  comments,
  timeAgo,
  teamMembers = 0,
  participants = [],
  image,
  groupName,
}: ProjectCardProps) => {
  const [hasJoined, setHasJoined] = useState(false);
  const [localParticipants, setLocalParticipants] = useState(participants);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [localLikes, setLocalLikes] = useState(likes);
  const [showReactionsDialog, setShowReactionsDialog] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  // Mock reactions data
  const mockReactions = [
    { userId: "1", userName: "María González", userAvatar: "https://i.pravatar.cc/150?img=1", type: "like" as const },
    { userId: "2", userName: "Carlos Ruiz", userAvatar: "https://i.pravatar.cc/150?img=2", type: "love" as const },
    { userId: "3", userName: "Ana López", userAvatar: "https://i.pravatar.cc/150?img=3", type: "idea" as const },
    { userId: "4", userName: "Pedro Sánchez", userAvatar: "https://i.pravatar.cc/150?img=4", type: "fire" as const },
    { userId: "5", userName: "Laura Martínez", userAvatar: "https://i.pravatar.cc/150?img=5", type: "like" as const },
  ];

  // Mock comments data (ordenados por relevancia)
  const mockComments = [
    {
      id: "1",
      author: { name: "María González", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
      content: "¡Excelente idea! Me encantaría colaborar en esto. Tengo experiencia en el área y creo que podríamos hacer algo increíble.",
      likes: 24,
      hasLiked: false,
      timeAgo: "Hace 2 horas",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      id: "2",
      author: { name: "Carlos Ruiz", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" },
      content: "Totalmente de acuerdo. ¿Tienen algún timeline definido?",
      likes: 15,
      hasLiked: false,
      timeAgo: "Hace 3 horas",
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
    },
    {
      id: "3",
      author: { name: "Ana López", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
      content: "Esto es justo lo que necesitamos ahora mismo",
      likes: 8,
      hasLiked: false,
      timeAgo: "Hace 4 horas",
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
    },
  ];

  const handleReaction = (reactionLabel: string) => {
    if (selectedReaction === reactionLabel) {
      setSelectedReaction(null);
      setLocalLikes(localLikes - 1);
    } else {
      if (!selectedReaction) {
        setLocalLikes(localLikes + 1);
      }
      setSelectedReaction(reactionLabel);
    }
    setShowReactions(false);
    toast({
      title: "Reacción añadida",
      description: `Has reaccionado con: ${reactionLabel}`,
    });
  };

  const handleJoinIdea = () => {
    if (!hasJoined) {
      setHasJoined(true);
      setLocalParticipants([...localParticipants, "Tú"]);
      toast({
        title: "¡Te has unido!",
        description: "Ahora eres parte de esta idea",
      });
    }
  };

  const handleCopyText = () => {
    const textToCopy = `${title}\n\n${description}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Texto copiado",
        description: "El contenido ha sido copiado al portapapeles",
      });
    });
  };

  const reactions = [
    { icon: ThumbsUp, label: "Me gusta", color: "text-blue-600" },
    { icon: Heart, label: "Me encanta", color: "text-red-600" },
    { icon: Lightbulb, label: "Interesante", color: "text-yellow-600" },
    { icon: Flame, label: "Genial", color: "text-orange-600" },
  ];

  return (
    <div className="bg-card border-b border-border transition-all duration-200 hover:bg-card/50">
      <div className="px-4 py-5 max-w-screen-xl mx-auto">
        <div className="flex items-start gap-3 mb-5">
          <Avatar className="h-11 w-11 ring-1 ring-border flex-shrink-0">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback className="bg-muted text-foreground font-semibold text-sm">
              {author.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
              {author.name}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{author.role}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
          </div>
          <div className="flex flex-col gap-2 items-end flex-shrink-0">
            <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5 whitespace-nowrap rounded">
              {category}
            </Badge>
            {type !== "text" && (
              <Badge
                variant={type === "idea" ? "default" : "outline"}
                className={`text-xs font-medium px-2.5 py-0.5 whitespace-nowrap rounded ${
                  type === "idea"
                    ? "bg-primary text-white border-0"
                    : type === "evento"
                    ? "bg-purple-600 text-white border-0"
                    : "border-accent text-accent"
                }`}
              >
                {type === "idea" && "💡 Idea"}
                {type === "proyecto" && "🚀 En progreso"}
                {type === "evento" && "📅 Evento"}
                {type === "equipo" && "👥 Equipo"}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="font-bold text-lg text-foreground leading-tight mb-2">
              {title}
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {description}
            </p>
          </div>

          {image && (
            <div
              className="rounded overflow-hidden border border-border cursor-pointer group"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={image}
                alt={title}
                className="w-full h-auto object-cover max-h-96 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          {type === "idea" ? (
            <div className="space-y-3">
              <Button 
                className={`w-full font-semibold transition-all duration-200 ${
                  hasJoined 
                    ? "bg-accent hover:bg-accent/90" 
                    : "bg-gradient-to-r from-primary to-accent hover:shadow-lg"
                }`}
                onClick={handleJoinIdea}
                disabled={hasJoined}
              >
                {hasJoined ? "✓ Unido a la idea" : "Unirse a la idea"}
              </Button>
              {localParticipants.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-1">
                        {localParticipants.slice(0, 3).map((participant, idx) => (
                          <Avatar key={idx} className="h-6 w-6 border-2 border-card -ml-2 first:ml-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {participant[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {localParticipants.length > 3 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            +{localParticipants.length - 3} más
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {localParticipants.length} {localParticipants.length === 1 ? "participante" : "participantes"}
                      </span>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Participantes ({localParticipants.length})</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                      {localParticipants.map((participant, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                          <Avatar className="h-10 w-10 ring-2 ring-background">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {participant[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{participant}</p>
                            <p className="text-xs text-muted-foreground">Interesado en la idea</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : type === "proyecto" || type === "equipo" ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">👥 {teamMembers} miembros en el equipo</span>
            </div>
          ) : type === "evento" && groupName ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">📍 Organizado por {groupName}</span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-1 mt-5 pt-4 border-t border-border">
          <div className="relative flex-1">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full gap-2 transition-colors ${
                selectedReaction 
                  ? "text-primary hover:bg-primary/5" 
                  : "hover:bg-primary/5 hover:text-primary"
              }`}
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              {selectedReaction === "Me gusta" && <ThumbsUp className="h-4 w-4 fill-current" />}
              {selectedReaction === "Me encanta" && <Heart className="h-4 w-4 fill-current" />}
              {selectedReaction === "Interesante" && <Lightbulb className="h-4 w-4 fill-current" />}
              {selectedReaction === "Genial" && <Flame className="h-4 w-4 fill-current" />}
              {!selectedReaction && <Heart className="h-4 w-4" />}
              <span 
                className="text-sm font-medium cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReactionsDialog(true);
                }}
              >
                {localLikes}
              </span>
            </Button>
            {showReactions && (
              <div 
                className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 flex gap-1 z-10"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                {reactions.map((reaction, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="sm"
                    className={`transition-colors p-2 ${
                      selectedReaction === reaction.label 
                        ? reaction.color 
                        : `hover:${reaction.color}`
                    }`}
                    title={reaction.label}
                    onClick={() => handleReaction(reaction.label)}
                  >
                    <reaction.icon className={`h-5 w-5 ${selectedReaction === reaction.label ? 'fill-current' : ''}`} />
                  </Button>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 gap-2 transition-colors ${
              showComments 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-primary/5 hover:text-primary"
            }`}
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={handleCopyText}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>

        {/* Sección de comentarios */}
        {showComments && (
          <CommentsSection 
            postId={title} 
            initialComments={mockComments}
          />
        )}
      </div>

      <ReactionsDialog
        open={showReactionsDialog}
        onOpenChange={setShowReactionsDialog}
        reactions={mockReactions}
      />

      {image && (
        <ImageLightbox
          src={image}
          alt={title}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
        />
      )}
    </div>
  );
};
