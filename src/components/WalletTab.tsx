
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowUpRight, Eye, EyeOff, Lock, Unlock, Shield, Target, ChevronRight, TrendingUp } from "lucide-react";
import CashoutModal from "./CashoutModal";
import WithdrawModal from "./WithdrawModal";
import SavingsGoalModal from "./wallet/SavingsGoalModal";
import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from 'framer-motion';

const WalletTab = () => {
  const { 
    getWithdrawableBalance, 
    getPendingUnlockBalance,
    getLockedEntries,
    getUnlockedEntries,
  } = useApp();
  
  const [showBalance, setShowBalance] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSavingsGoalModal, setShowSavingsGoalModal] = useState(false);
  const [selectedGroupForCashout, setSelectedGroupForCashout] = useState(null);
  
  const withdrawableBalance = getWithdrawableBalance();
  const pendingUnlockBalance = getPendingUnlockBalance();
  const lockedEntries = getLockedEntries();
  const unlockedEntries = getUnlockedEntries();
  const totalBalance = withdrawableBalance + pendingUnlockBalance;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-5 pb-24 px-3">
      {/* Total Balance Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(240,20%,10%)] to-[hsl(250,30%,18%)] p-6 text-white shadow-2xl"
      >
        {/* Decorative orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-emerald-500/15 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-white/70">Total Balance</span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              {showBalance ? <Eye className="h-4 w-4 text-white/70" /> : <EyeOff className="h-4 w-4 text-white/70" />}
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={showBalance ? 'show' : 'hide'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-4xl font-bold tracking-tight mb-1"
            >
              {showBalance ? formatCurrency(totalBalance) : '••••••'}
            </motion.p>
          </AnimatePresence>

          {/* Balance breakdown pills */}
          <div className="flex gap-3 mt-4">
            <div className="flex items-center gap-1.5 bg-emerald-500/15 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-300">
                {showBalance ? formatCurrency(withdrawableBalance) : '••••'} available
              </span>
            </div>
            {pendingUnlockBalance > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-500/15 rounded-full px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs text-amber-300">
                  {showBalance ? formatCurrency(pendingUnlockBalance) : '••••'} locked
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            {withdrawableBalance > 0 && (
              <Button
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 bg-white text-gray-900 hover:bg-white/90 font-semibold h-11 rounded-xl shadow-lg shadow-white/10"
              >
                <ArrowUpRight className="h-4 w-4 mr-1.5" />
                Withdraw
              </Button>
            )}
            <Button
              onClick={() => setShowSavingsGoalModal(true)}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10 font-semibold h-11 rounded-xl bg-white/5"
            >
              <Target className="h-4 w-4 mr-1.5" />
              Savings Goal
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Funds List */}
      {(unlockedEntries.length > 0 || lockedEntries.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Your Funds
          </h3>

          {/* Unlocked entries */}
          {unlockedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="group flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 hover:border-emerald-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Unlock className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{entry.groupName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(entry.receivedDate)} · {entry.groupLockPolicy ? 'Completed' : 'Instant access'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600 text-sm">{formatCurrency(entry.amount)}</p>
                <span className="inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 mt-1">
                  Available
                </span>
              </div>
            </motion.div>
          ))}

          {/* Locked entries */}
          {lockedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * (unlockedEntries.length + index) }}
              className="group flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 hover:border-amber-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{entry.groupName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(entry.receivedDate)} · Unlocks on completion
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-600 text-sm">{formatCurrency(entry.amount)}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 mt-1">
                  <Lock className="h-2.5 w-2.5" />
                  Locked
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {unlockedEntries.length === 0 && lockedEntries.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 px-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">No Funds Yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-[250px]">
            Your payouts from groups will appear here. Join or create groups to start earning!
          </p>
        </motion.div>
      )}

      {/* Modals */}
      <WithdrawModal
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        maxAmount={withdrawableBalance}
      />
      <SavingsGoalModal
        open={showSavingsGoalModal}
        onOpenChange={setShowSavingsGoalModal}
      />
      {selectedGroupForCashout && (
        <CashoutModal
          group={selectedGroupForCashout}
          open={!!selectedGroupForCashout}
          onOpenChange={(open) => !open && setSelectedGroupForCashout(null)}
        />
      )}
    </div>
  );
};

export default WalletTab;
