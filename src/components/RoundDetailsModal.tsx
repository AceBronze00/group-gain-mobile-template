import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, CheckCircle, Clock, Hourglass, TrendingUp } from "lucide-react";

export interface RoundMember {
  id: number;
  name: string;
  avatar: string;
  position: number;
}

interface RoundDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  startDate?: string;
  frequency?: string; // daily | weekly | biweekly | monthly
  currentRound: number;
  totalRounds: number;
  members: RoundMember[];
  /** Per-round actual payout date keyed by round number (1-based). Optional. */
  actualPayoutDates?: Record<number, string | null>;
}

const formatDate = (date?: string | null) => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const frequencyToDays = (frequency?: string) => {
  switch ((frequency || "monthly").toLowerCase()) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "biweekly":
      return 14;
    case "monthly":
    default:
      return 30;
  }
};

const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

type RoundStatus = "completed" | "active" | "scheduled";

const StatusBadge = ({ status }: { status: RoundStatus }) => {
  const map = {
    completed: {
      label: "COMPLETED",
      className: "bg-green-500/10 text-green-600 border-green-500/20",
      Icon: CheckCircle,
    },
    active: {
      label: "ACTIVE",
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      Icon: Hourglass,
    },
    scheduled: {
      label: "SCHEDULED",
      className: "bg-muted text-muted-foreground border-border",
      Icon: Clock,
    },
  };
  const cfg = map[status];
  const Icon = cfg.Icon;
  return (
    <Badge
      variant="outline"
      className={`${cfg.className} font-semibold tracking-wide text-[10px]`}
    >
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
  frequency,
  currentRound,
  totalRounds,
  members,
  actualPayoutDates = {},
}: RoundDetailsModalProps) => {
  const intervalDays = frequencyToDays(frequency);
  const startISO = startDate || new Date().toISOString();
  const start = new Date(startISO);

  // Sort members by position so payout order is stable
  const orderedMembers = [...members].sort((a, b) => a.position - b.position);

  // Generate one row per round. Recipient cycles through members in order.
  const rounds = Array.from({ length: Math.max(totalRounds, 0) }, (_, i) => {
    const roundNumber = i + 1;
    const recipient = orderedMembers[i % Math.max(orderedMembers.length, 1)];
    const scheduledISO = addDays(start, i * intervalDays);
    const actual = actualPayoutDates[roundNumber] ?? null;

    let status: RoundStatus = "scheduled";
    if (roundNumber < currentRound) status = "completed";
    else if (roundNumber === currentRound) status = "active";

    return { roundNumber, recipient, scheduledISO, actual, status };
  });

  const completedCount = rounds.filter((r) => r.status === "completed").length;
  const progressPct = totalRounds > 0 ? Math.round((completedCount / totalRounds) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Round Details – {groupName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Summary */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Started</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {startDate ? formatDate(startISO) : "Not started"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Progress</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {completedCount} / {totalRounds} rounds · {progressPct}%
              </span>
            </div>
            {frequency && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Frequency</span>
                <Badge variant="secondary" className="capitalize text-xs">
                  {frequency}
                </Badge>
              </div>
            )}
          </Card>

          {/* Timeline */}
          <div>
            <h3 className="font-bold text-base mb-3">Payout Schedule</h3>
            <div className="space-y-2">
              {rounds.map((r) => (
                <Card
                  key={r.roundNumber}
                  className={`p-3 ${
                    r.status === "active" ? "border-2 border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          r.status === "completed"
                            ? "bg-green-500/15 text-green-600"
                            : r.status === "active"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {r.roundNumber}
                      </div>
                      <span className="text-sm font-semibold">
                        Round {r.roundNumber}
                      </span>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  {r.recipient && (
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={r.recipient.avatar} alt={r.recipient.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                          {r.recipient.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Payout to</p>
                        <p className="text-sm font-semibold truncate">
                          {r.recipient.name}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-1 border-t">
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-2">
                        Scheduled
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatDate(r.scheduledISO)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-2">
                        Actual
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {r.status === "completed"
                          ? formatDate(r.actual ?? r.scheduledISO)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoundDetailsModal;
