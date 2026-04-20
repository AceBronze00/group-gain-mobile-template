import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Flag, CheckCircle, Clock, Circle } from "lucide-react";

export interface RoundTimelineEntry {
  roundNumber: number;
  recipientName: string;
  recipientAvatar: string;
  scheduledDate: string;
  actualDate?: string | null;
  status: "scheduled" | "active" | "completed";
}

interface RoundDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  startDate?: string | null;
  totalRounds: number;
  rounds: RoundTimelineEntry[];
}

const formatDate = (date?: string | null) => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const StatusBadge = ({ status }: { status: RoundTimelineEntry["status"] }) => {
  const map = {
    scheduled: {
      label: "SCHEDULED",
      className: "bg-muted text-muted-foreground border-border",
      Icon: Circle,
    },
    active: {
      label: "ACTIVE",
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      Icon: Clock,
    },
    completed: {
      label: "COMPLETED",
      className: "bg-green-500/10 text-green-600 border-green-500/20",
      Icon: CheckCircle,
    },
  } as const;
  const cfg = map[status];
  const Icon = cfg.Icon;
  return (
    <Badge variant="outline" className={`${cfg.className} font-semibold tracking-wide`}>
      <Icon className="h-3 w-3 mr-1" />
      {cfg.label}
    </Badge>
  );
};

const RoundDetailsModal = ({
  open,
  onOpenChange,
  groupName,
  startDate,
  totalRounds,
  rounds,
}: RoundDetailsModalProps) => {
  const completedCount = rounds.filter((r) => r.status === "completed").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Round Timeline – {groupName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Summary */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Nest started</span>
              <span className="ml-auto text-sm font-semibold text-foreground">
                {formatDate(startDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="ml-auto text-sm font-semibold text-foreground">
                {completedCount} of {totalRounds} rounds completed
              </span>
            </div>
          </Card>

          {/* Timeline */}
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" aria-hidden />
            <ul className="space-y-3">
              {rounds.map((r) => {
                const dotClass =
                  r.status === "completed"
                    ? "bg-green-500 border-green-500"
                    : r.status === "active"
                    ? "bg-blue-500 border-blue-500"
                    : "bg-background border-border";
                return (
                  <li key={r.roundNumber} className="relative">
                    <span
                      className={`absolute -left-[18px] top-4 h-3 w-3 rounded-full border-2 ${dotClass}`}
                      aria-hidden
                    />
                    <Card className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">
                          Round {r.roundNumber} of {totalRounds}
                        </span>
                        <StatusBadge status={r.status} />
                      </div>

                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={r.recipientAvatar} alt={r.recipientName} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {r.recipientName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Recipient: </span>
                          <span className="font-semibold">{r.recipientName}</span>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">Scheduled</p>
                          <p className="text-sm font-semibold text-foreground">
                            {formatDate(r.scheduledDate)}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            {r.status === "completed" ? "Paid out" : "Expected"}
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {formatDate(r.actualDate ?? (r.status !== "completed" ? r.scheduledDate : null))}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoundDetailsModal;
