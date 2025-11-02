import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, Heart, Lightbulb, Flame } from "lucide-react";

interface Reaction {
  userId: string;
  userName: string;
  userAvatar: string;
  type: "like" | "love" | "idea" | "fire";
}

interface ReactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reactions: Reaction[];
}

const reactionIcons = {
  like: { icon: ThumbsUp, color: "text-blue-500" },
  love: { icon: Heart, color: "text-red-500" },
  idea: { icon: Lightbulb, color: "text-yellow-500" },
  fire: { icon: Flame, color: "text-orange-500" },
};

const ReactionsDialog = ({ open, onOpenChange, reactions }: ReactionsDialogProps) => {
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const allCount = reactions.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Reacciones</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all" className="gap-1">
              Todas <span className="text-xs text-muted-foreground">({allCount})</span>
            </TabsTrigger>
            {Object.entries(reactionCounts).map(([type, count]) => {
              const { icon: Icon, color } = reactionIcons[type as keyof typeof reactionIcons];
              return (
                <TabsTrigger key={type} value={type} className="gap-1">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs text-muted-foreground">({count})</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="all" className="mt-0 space-y-3">
              {reactions.map((reaction, index) => {
                const { icon: Icon, color } = reactionIcons[reaction.type];
                return (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={reaction.userAvatar} />
                        <AvatarFallback>{reaction.userName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{reaction.userName}</span>
                    </div>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                );
              })}
            </TabsContent>

            {Object.keys(reactionCounts).map((type) => (
              <TabsContent key={type} value={type} className="mt-0 space-y-3">
                {reactions
                  .filter((r) => r.type === type)
                  .map((reaction, index) => {
                    const { icon: Icon, color } = reactionIcons[reaction.type];
                    return (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={reaction.userAvatar} />
                            <AvatarFallback>{reaction.userName.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{reaction.userName}</span>
                        </div>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                    );
                  })}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ReactionsDialog;
