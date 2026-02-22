import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Wallet, Unlock, Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface AvailableFundsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
  unlockedEntries: Array<{
    id: number;
    groupName: string;
    amount: number;
    receivedDate: string;
  }>;
  formatCurrency: (amount: number) => string;
  showBalance: boolean;
}

const AvailableFundsSheet = ({ open, onOpenChange, walletBalance, unlockedEntries, formatCurrency, showBalance }: AvailableFundsSheetProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const total = walletBalance + unlockedEntries.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <SheetTitle>Available Funds</SheetTitle>
              <SheetDescription>Ready to withdraw or use as payment</SheetDescription>
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {showBalance ? formatCurrency(total) : '••••••'}
          </p>
        </SheetHeader>

        <div className="space-y-3 pt-2">
          {walletBalance > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Bank Deposit</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Added from your bank</p>
                </div>
              </div>
              <p className="font-bold text-emerald-600 text-sm">
                {showBalance ? formatCurrency(walletBalance) : '••••'}
              </p>
            </motion.div>
          )}

          {unlockedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Unlock className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{entry.groupName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Completed · Received {formatDate(entry.receivedDate)}
                  </p>
                </div>
              </div>
              <p className="font-bold text-emerald-600 text-sm">
                {showBalance ? formatCurrency(entry.amount) : '••••'}
              </p>
            </motion.div>
          ))}

          {walletBalance <= 0 && unlockedEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No available funds yet
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AvailableFundsSheet;
