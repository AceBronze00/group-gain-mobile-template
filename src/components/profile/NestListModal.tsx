import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, CheckCircle, Archive, ChevronRight, Crown } from "lucide-react";
import { useApp, type Group } from "@/contexts/AppContext";

interface NestListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: "active" | "completed";
  onSelect: (nest: Group) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const NestListModal = ({ open, onOpenChange, variant, onSelect }: NestListModalProps) => {
  const { groups } = useApp();
  const isCompleted = variant === "completed";
  const list = groups.filter((g) =>
    isCompleted ? g.status === "completed" : g.status !== "completed"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCompleted ? (
              <>
                <Archive className="h-5 w-5 text-[hsl(var(--success))]" />
                Completed Nests ({list.length})
              </>
            ) : (
              <>
                <Users className="h-5 w-5 text-primary" />
                Active Nests ({list.length})
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {list.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="bg-muted rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                {isCompleted ? (
                  <Archive className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <Users className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm font-medium text-foreground">
                No {isCompleted ? "completed" : "active"} nests yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isCompleted
                  ? "Completed nests will be archived here for your records."
                  : "Create or join a nest to get started."}
              </p>
            </Card>
          ) : (
            list.map((nest) => (
              <Card
                key={nest.id}
                onClick={() => onSelect(nest)}
                className="p-4 cursor-pointer hover:shadow-md transition-all rounded-xl border-border/60"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-card-foreground truncate">{nest.name}</h4>
                      {nest.isAdmin && <Crown className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                      <Users className="h-3 w-3 mr-1" />
                      {nest.membersList?.length || nest.members}/{nest.members} members ·{" "}
                      {nest.frequency}
                    </p>
                  </div>
                  {isCompleted ? (
                    <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" /> Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      Active
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-card-foreground">
                    {formatCurrency(nest.totalAmount)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(nest.contributionAmount)} / {nest.frequency}
                  </span>
                </div>

                {!isCompleted && (
                  <div className="space-y-1.5 mb-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-primary">{nest.progress}%</span>
                    </div>
                    <Progress value={nest.progress} className="h-1.5" />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {isCompleted
                      ? `Closed ${new Date(nest.nextPayout).toLocaleDateString()}`
                      : `Next: ${new Date(nest.nextPayout).toLocaleDateString()}`}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NestListModal;