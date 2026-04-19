import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[85vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-white">Pending Funds</DialogTitle>
              <DialogDescription className="text-zinc-400">Upcoming payouts from active groups</DialogDescription>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            {showBalance ? formatCurrency(total) : '••••••'}
          </p>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {pendingPayouts.map((payout, index) => (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/60 border border-zinc-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <ArrowDownLeft className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{payout.groupName}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Position #{payout.position} · Est. {formatDate(payout.expectedDate)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-400 text-sm">
                  {showBalance ? formatCurrency(payout.amount) : '••••'}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-300 bg-blue-500/10 rounded-full px-2 py-0.5 mt-1">
                  <Clock className="h-2.5 w-2.5" />
                  Pending
                </span>
              </div>
            </motion.div>
          ))}

          {pendingPayouts.length === 0 && (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No pending payouts
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingFundsSheet;
