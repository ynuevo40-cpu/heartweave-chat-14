import { useState } from "react";
import { Heart, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  hasLiked: boolean;
  timeAgo: string;
  timestamp: number;
  replies?: Comment[];
}

interface CommentsSectionProps {
  postId: string;
  initialComments?: Comment[];
}

type SortType = "relevant" | "recent" | "all";

export const CommentsSection = ({ postId, initialComments = [] }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [sortType, setSortType] = useState<SortType>("relevant");
  const { toast } = useToast();

  // Ordenar comentarios según el tipo seleccionado
  const sortedComments = [...comments].sort((a, b) => {
    switch (sortType) {
      case "relevant":
        return b.likes - a.likes;
      case "recent":
        return b.timestamp - a.timestamp;
      case "all":
      default:
        return a.timestamp - b.timestamp;
    }
  });

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.hasLiked ? comment.likes - 1 : comment.likes + 1,
          hasLiked: !comment.hasLiked,
        };
      }
      return comment;
    }));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "Tú",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      },
      content: newComment,
      likes: 0,
      hasLiked: false,
      timeAgo: "Ahora",
      timestamp: Date.now(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
    toast({
      title: "Comentario publicado",
      description: "Tu comentario ha sido añadido",
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
    toast({
      title: "Comentario eliminado",
      description: "El comentario ha sido eliminado",
    });
  };

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-border">
      {/* Campo para nuevo comentario */}
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="Tú" />
          <AvatarFallback className="bg-primary/10 text-primary">Tú</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              size="sm"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Comentar
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de comentarios con selector de ordenamiento */}
      {sortedComments.length > 0 && (
        <div className="space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                {sortType === "relevant" && "Más pertinentes"}
                {sortType === "recent" && "Más recientes"}
                {sortType === "all" && "Todos los comentarios"}
                <MoreHorizontal className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortType("relevant")}>
                <div className="flex flex-col">
                  <span className="font-medium">Más pertinentes</span>
                  <span className="text-xs text-muted-foreground">Los comentarios más valorados primero</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortType("recent")}>
                <div className="flex flex-col">
                  <span className="font-medium">Más recientes</span>
                  <span className="text-xs text-muted-foreground">Los comentarios más nuevos primero</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortType("all")}>
                <div className="flex flex-col">
                  <span className="font-medium">Todos los comentarios</span>
                  <span className="text-xs text-muted-foreground">Ordenados cronológicamente</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {sortedComments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {comment.author.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="bg-muted/50 rounded-2xl px-4 py-2.5">
                  <div className="font-semibold text-sm mb-1">{comment.author.name}</div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 px-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-auto py-1 px-2 text-xs font-semibold gap-1 ${
                      comment.hasLiked ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <Heart className={`h-3 w-3 ${comment.hasLiked ? "fill-current" : ""}`} />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                    Me gusta
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto py-1 px-2 text-xs font-semibold text-muted-foreground"
                  >
                    Responder
                  </Button>
                  <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>
                        Eliminar comentario
                      </DropdownMenuItem>
                      <DropdownMenuItem>Reportar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedComments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Sé el primero en comentar
        </div>
      )}
    </div>
  );
};
