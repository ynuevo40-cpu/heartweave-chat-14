import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePosts } from "@/hooks/usePosts";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
}

const reportReasons = [
  "Spam o contenido engañoso",
  "Contenido inapropiado",
  "Acoso o intimidación",
  "Información falsa",
  "Otro",
];

export const ReportDialog = ({ open, onOpenChange, postId }: ReportDialogProps) => {
  const [reason, setReason] = useState(reportReasons[0]);
  const [details, setDetails] = useState("");
  const { reportPost, loading } = usePosts();

  const handleSubmit = async () => {
    const reportText = details ? `${reason}: ${details}` : reason;
    const { error } = await reportPost(postId, reportText);
    if (!error) {
      onOpenChange(false);
      setReason(reportReasons[0]);
      setDetails("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar publicación</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Motivo del reporte</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2">
              {reportReasons.map((r) => (
                <div key={r} className="flex items-center space-x-2">
                  <RadioGroupItem value={r} id={r} />
                  <Label htmlFor={r} className="font-normal cursor-pointer">
                    {r}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="details">Detalles adicionales (opcional)</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe el problema..."
              className="mt-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Enviando..." : "Enviar reporte"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
