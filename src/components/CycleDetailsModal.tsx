import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, Users, CheckCircle, Clock } from "lucide-react";

interface CycleMember {
  id: number;
  name: string;
  avatar: string;
  hasPaid: boolean;
  hasReceived: boolean;
  position: number;
  originalDate?: string;
  nextDate?: string;
  actualDate?: string | null;
}

interface CycleDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  cycleNumber: number;
  status: "scheduled" | "active" | "completed";
  payoutRecipient?: {
    name: string;
    avatar: string;
    originalDate: string;
    nextDate: string;
    actualDate?: string | null;
  };
  members: CycleMember[];
}

const formatDate = (date?: string | null) => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
};

const StatusBadge = ({ status }: { status: CycleDetailsModalProps["status"] }) => {
  const map = {
    scheduled: { label: "SCHEDULED", className: "bg-muted text-muted-foreground border-border" },
    active: { label: "ACTIVE", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    completed: { label: "COMPLETED", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  };
  const cfg = map[status];
  return (
    <Badge variant="outline" className={`${cfg.className} font-semibold tracking-wide`}>
      {cfg.label}
    </Badge>
  );
};

const DateBlock = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex-1 min-w-0">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? "text-foreground" : "text-foreground"}`}>{value}</p>
  </div>
);

const CycleDetailsModal = ({
  open,
  onOpenChange,
  groupName,
  cycleNumber,
  status,
  payoutRecipient,
  members,
}: CycleDetailsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Cycle Details - {groupName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Cycle header pill + status */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-foreground text-background">
              <span className="text-sm font-bold">Cycle {cycleNumber}</span>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Payout Details */}
          {payoutRecipient && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base">Payout Details</h3>
              </div>
              <Card className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={payoutRecipient.avatar} alt={payoutRecipient.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {payoutRecipient.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{payoutRecipient.name}</span>
                </div>
                <div className="flex gap-4 pt-1">
                  <DateBlock label="Original" value={formatDate(payoutRecipient.originalDate)} />
                  <DateBlock label="Next" value={formatDate(payoutRecipient.nextDate)} />
                  <DateBlock label="Actual" value={formatDate(payoutRecipient.actualDate)} />
                </div>
              </Card>
            </div>
          )}

          {/* Member Payments */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-foreground" />
              <h3 className="font-bold text-base">Member Payments</h3>
            </div>
            <div className="space-y-3">
              {members.map((m) => (
                <Card key={m.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={m.avatar} alt={m.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {m.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{m.name}</span>
                    </div>
                    {m.hasPaid ? (
                      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        PAID
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                        <Clock className="h-3 w-3 mr-1" />
                        PENDING
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <DateBlock label="Original" value={formatDate(m.originalDate)} />
                    <DateBlock label="Next" value={formatDate(m.nextDate)} />
                    <DateBlock label="Actual" value={formatDate(m.actualDate)} />
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

export default CycleDetailsModal;
