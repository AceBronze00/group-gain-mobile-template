import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Star, ArrowUpRight, Wallet, Clock, History } from "lucide-react";

interface HistorySectionProps {
  transactionHistory: Array<{
    id: number;
    type: string;
    amount: number;
    description: string;
    date: string;
    status: string;
  }>;
  poolHistory: Array<{
    id: number;
    groupName: string;
    status: string;
    totalAmount: number;
    myContribution: number;
    payout: number;
    participants: number;
    duration: string;
    completedDate?: string;
    failedDate?: string;
    reason?: string;
    membersToRate?: Array<{
      id: number;
      name: string;
      avatar: string;
      hasRated: boolean;
    }>;
  }>;
  onRateMember: (member: any, groupName: string) => void;
}

type UnifiedItem =
  | { kind: "transaction"; date: string; data: HistorySectionProps["transactionHistory"][0] }
  | { kind: "pool"; date: string; data: HistorySectionProps["poolHistory"][0] };

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

const HistorySection = ({ transactionHistory, poolHistory, onRateMember }: HistorySectionProps) => {
  // Merge and sort by date descending
  const items: UnifiedItem[] = [
    ...transactionHistory.map((t) => ({ kind: "transaction" as const, date: t.date, data: t })),
    ...poolHistory.map((p) => ({
      kind: "pool" as const,
      date: p.completedDate || p.failedDate || "",
      data: p,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No history yet</h3>
        <p className="text-muted-foreground">Your activity will appear here</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-black">History</h3>
      {items.map((item) =>
        item.kind === "transaction" ? (
          <TransactionCard key={`t-${item.data.id}`} transaction={item.data} />
        ) : (
          <PoolCard key={`p-${item.data.id}`} pool={item.data} onRateMember={onRateMember} />
        )
      )}
    </div>
  );
};

function TransactionCard({ transaction }: { transaction: HistorySectionProps["transactionHistory"][0] }) {
  return (
    <Card className="p-4 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            transaction.type === "cashout" ? "bg-green-100" :
            transaction.type === "deposit" ? "bg-blue-100" : "bg-orange-100"
          }`}>
            {transaction.type === "cashout" && <ArrowUpRight className="h-4 w-4 text-green-600" />}
            {transaction.type === "deposit" && <Wallet className="h-4 w-4 text-blue-600" />}
            {transaction.type === "transfer" && <Clock className="h-4 w-4 text-orange-600" />}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{transaction.description}</p>
            <p className="text-xs text-muted-foreground font-medium">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold text-sm ${
            transaction.type === "deposit" ? "text-green-600" : "text-foreground"
          }`}>
            {transaction.type === "deposit" ? "+" : "-"}{formatCurrency(transaction.amount)}
          </p>
          <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="mt-1 text-xs">
            {transaction.status}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

function PoolCard({ pool, onRateMember }: { pool: HistorySectionProps["poolHistory"][0]; onRateMember: (m: any, g: string) => void }) {
  const [showAllMembers, setShowAllMembers] = useState(false);

  const MemberRow = ({ member }: { member: { id: number; name: string; avatar: string; hasRated: boolean } }) => (
    <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {member.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold text-card-foreground">{member.name}</span>
      </div>
      {member.hasRated ? (
        <Badge variant="outline" className="text-green-600 bg-green-50 text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Rated
        </Badge>
      ) : (
        <Button
          size="sm"
          onClick={() => onRateMember(member, pool.groupName)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-6 px-2"
        >
          <Star className="h-2 w-2 mr-1" />
          Rate
        </Button>
      )}
    </div>
  );

  return (
    <Card className="p-4 rounded-2xl">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {pool.status === "completed" ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-foreground">{pool.groupName}</h4>
            <Badge className={`text-xs ${
              pool.status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {pool.status === "completed" ? "Completed" : "Failed"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <span className="text-muted-foreground font-medium">My Contribution:</span>
              <div className="font-semibold text-foreground">{formatCurrency(pool.myContribution)}</div>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">
                {pool.status === "completed" ? "Payout:" : "Refund:"}
              </span>
              <div className={`font-semibold ${pool.status === "completed" ? "text-green-600" : "text-orange-600"}`}>
                {formatCurrency(pool.payout)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Total Pool:</span>
              <div className="font-semibold text-foreground">{formatCurrency(pool.totalAmount)}</div>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">Participants:</span>
              <div className="font-semibold text-foreground">{pool.participants} members</div>
            </div>
          </div>

          {pool.status === "completed" && pool.membersToRate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Rate Group Members</span>
                <span className="text-xs text-blue-600">
                  {pool.membersToRate.filter((m) => !m.hasRated).length} pending
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {pool.membersToRate.slice(0, 3).map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
                {pool.membersToRate.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllMembers(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    +{pool.membersToRate.length - 3} more members — View All
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex justify-between text-sm text-muted-foreground font-medium">
              <span>Duration: {pool.duration}</span>
              <span>
                {pool.status === "completed" ? "Completed" : "Failed"}:{" "}
                {new Date(pool.status === "completed" ? pool.completedDate! : pool.failedDate!).toLocaleDateString()}
              </span>
            </div>
            {pool.status === "failed" && pool.reason && (
              <div className="mt-1 text-sm font-medium text-red-600">Reason: {pool.reason}</div>
            )}
          </div>
        </div>
      </div>

      {/* All Members Dialog */}
      {pool.membersToRate && (
        <Dialog open={showAllMembers} onOpenChange={setShowAllMembers}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {pool.groupName} — Rate Members
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {pool.membersToRate.filter((m) => !m.hasRated).length} of {pool.membersToRate.length} pending
              </p>
            </DialogHeader>
            <ScrollArea className="max-h-[400px]">
              <div className="grid grid-cols-1 gap-2 pr-2">
                {pool.membersToRate.map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

export default HistorySection;
