import { MoreHorizontal, Edit, Trash2, Bookmark, EyeOff, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface PostMenuProps {
  postId: string;
  isAuthor: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onHide?: () => void;
  onReport?: () => void;
}

export const PostMenu = ({
  postId,
  isAuthor,
  onEdit,
  onDelete,
  onSave,
  onHide,
  onReport,
}: PostMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isAuthor && (
          <>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={onSave}>
          <Bookmark className="h-4 w-4 mr-2" />
          Guardar
        </DropdownMenuItem>
        {!isAuthor && (
          <>
            <DropdownMenuItem onClick={onHide}>
              <EyeOff className="h-4 w-4 mr-2" />
              No me interesa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onReport} className="text-destructive">
              <Flag className="h-4 w-4 mr-2" />
              Reportar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
