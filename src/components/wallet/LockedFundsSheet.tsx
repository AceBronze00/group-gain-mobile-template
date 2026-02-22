import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Lock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <SheetTitle>Locked Funds</SheetTitle>
              <SheetDescription>Held until your group cycle completes</SheetDescription>
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {showBalance ? formatCurrency(totalLocked) : '••••••'}
          </p>
        </SheetHeader>

        <div className="space-y-3 pt-2">
          {lockedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{entry.groupName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Received {formatDate(entry.receivedDate)} · Unlocks on completion
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-600 text-sm">
                  {showBalance ? formatCurrency(entry.amount) : '••••'}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 mt-1">
                  <Lock className="h-2.5 w-2.5" />
                  Locked
                </span>
              </div>
            </motion.div>
          ))}

          {lockedEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No locked funds
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LockedFundsSheet;
