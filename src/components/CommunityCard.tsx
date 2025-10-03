import { Users, MessageSquare, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Community } from '@/hooks/useCommunities';
import { useAuth } from '@/hooks/useAuth';

interface CommunityCardProps {
  community: Community;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export const CommunityCard = ({ 
  community, 
  onJoin, 
  onLeave, 
  onDelete,
  onSelect 
}: CommunityCardProps) => {
  const { user } = useAuth();
  const isCreator = user?.id === community.creator_id;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect(community.id)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{community.name}</CardTitle>
            <CardDescription className="mt-1">
              Por {community.creator?.username || 'Usuario'}
            </CardDescription>
          </div>
          {isCreator && (
            <Badge variant="secondary" className="ml-2">Creador</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {community.description || 'Sin descripción'}
        </p>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{community.member_count} miembros</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{community.message_count} mensajes</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        {community.is_member ? (
          <>
            <Button 
              variant="default" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(community.id);
              }}
            >
              Abrir Chat
            </Button>
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                onLeave(community.id);
              }}
            >
              Salir
            </Button>
          </>
        ) : (
          <Button 
            variant="default" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onJoin(community.id);
            }}
          >
            Unirse
          </Button>
        )}
        
        {isCreator && (
          <Button 
            variant="destructive" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(community.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
