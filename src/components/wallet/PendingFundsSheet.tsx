import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Clock, ArrowDownLeft } from "lucide-react";
import { motion } from "framer-motion";

interface PendingPayout {
  id: number;
  groupName: string;
  amount: number;
  expectedDate: string;
  position: number;
  members: number;
}

interface PendingFundsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingPayouts: PendingPayout[];
  formatCurrency: (amount: number) => string;
  showBalance: boolean;
}

const PendingFundsSheet = ({ open, onOpenChange, pendingPayouts, formatCurrency, showBalance }: PendingFundsSheetProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const total = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <SheetTitle>Pending Funds</SheetTitle>
              <SheetDescription>Upcoming payouts from active groups</SheetDescription>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {showBalance ? formatCurrency(total) : '••••••'}
          </p>
        </SheetHeader>

        <div className="space-y-3 pt-2">
          {pendingPayouts.map((payout, index) => (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <ArrowDownLeft className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{payout.groupName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Position #{payout.position} · Est. {formatDate(payout.expectedDate)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 text-sm">
                  {showBalance ? formatCurrency(payout.amount) : '••••'}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 mt-1">
                  <Clock className="h-2.5 w-2.5" />
                  Pending
                </span>
              </div>
            </motion.div>
          ))}

          {pendingPayouts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No pending payouts
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PendingFundsSheet;
