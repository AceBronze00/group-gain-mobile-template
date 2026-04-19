import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

interface LockedEntry {
  id: number;
  groupName: string;
  amount: number;
  receivedDate: string;
}

interface LockedFundsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lockedEntries: LockedEntry[];
  totalLocked: number;
  formatCurrency: (amount: number) => string;
  showBalance: boolean;
}

const LockedFundsSheet = ({ open, onOpenChange, lockedEntries, totalLocked, formatCurrency, showBalance }: LockedFundsSheetProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[85vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Lock className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-white">Locked Funds</DialogTitle>
              <DialogDescription className="text-zinc-400">Held until your nest's rounds complete</DialogDescription>
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-400 mt-2">
            {showBalance ? formatCurrency(totalLocked) : '••••••'}
          </p>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {lockedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/60 border border-zinc-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{entry.groupName}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Received {formatDate(entry.receivedDate)} · Unlocks on completion
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-400 text-sm">
                  {showBalance ? formatCurrency(entry.amount) : '••••'}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-500/10 rounded-full px-2 py-0.5 mt-1">
                  <Lock className="h-2.5 w-2.5" />
                  Locked
                </span>
              </div>
            </motion.div>
          ))}

          {lockedEntries.length === 0 && (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No locked funds
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LockedFundsSheet;
