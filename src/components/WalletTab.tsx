
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownLeft, Eye, EyeOff, Lock, Clock, CircleDollarSign, ChevronRight } from "lucide-react";
import CashoutModal from "./CashoutModal";
import WithdrawModal from "./WithdrawModal";
import AvailableFundsSheet from "./wallet/AvailableFundsSheet";
import PendingFundsSheet from "./wallet/PendingFundsSheet";
import LockedFundsSheet from "./wallet/LockedFundsSheet";
import DepositModal from "./wallet/DepositModal";
import { useApp } from "@/contexts/AppContext";
import { motion, AnimatePresence } from 'framer-motion';

const WalletTab = () => {
  const { 
    getWithdrawableBalance, 
    getPendingUnlockBalance,
    getLockedEntries,
    getUnlockedEntries,
    groups,
    walletBalance,
  } = useApp();
  
  const [showBalance, setShowBalance] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedGroupForCashout, setSelectedGroupForCashout] = useState(null);
  const [showAvailableSheet, setShowAvailableSheet] = useState(false);
  const [showPendingSheet, setShowPendingSheet] = useState(false);
  const [showLockedSheet, setShowLockedSheet] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  
  const withdrawableBalance = getWithdrawableBalance();
  const pendingUnlockBalance = getPendingUnlockBalance();
  const lockedEntries = getLockedEntries();
  const unlockedEntries = getUnlockedEntries();

  // Pending payouts from active groups (user hasn't received payout yet)
  const pendingPayouts = groups
    .filter(g => g.status === 'active' && !g.isComplete && !g.myTurn)
    .map(g => ({
      id: g.id,
      groupName: g.name,
      amount: g.totalAmount,
      expectedDate: g.myPayoutDate,
      position: g.position,
      members: g.members,
    }));

  const totalPendingPayouts = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);
  const totalBalance = withdrawableBalance + pendingUnlockBalance + walletBalance;

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

  const availableTotal = withdrawableBalance + walletBalance;

  return (
    <div className="space-y-5 pb-24 px-3">
      {/* Total Balance Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(240,20%,10%)] to-[hsl(250,30%,18%)] p-6 text-white shadow-2xl"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-emerald-500/15 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
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
              className="text-4xl font-bold tracking-tight"
            >
              {showBalance ? formatCurrency(totalBalance) : '••••••'}
            </motion.p>
          </AnimatePresence>

          {/* 3-way breakdown */}
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="flex items-center gap-1.5 bg-emerald-500/15 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-300">
                {showBalance ? formatCurrency(availableTotal) : '••••'} available
              </span>
            </div>
            {totalPendingPayouts > 0 && (
              <div className="flex items-center gap-1.5 bg-blue-500/15 rounded-full px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-xs text-blue-300">
                  {showBalance ? formatCurrency(totalPendingPayouts) : '••••'} pending
                </span>
              </div>
            )}
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
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => setShowDepositModal(true)}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10 font-semibold h-11 rounded-xl"
            >
              <ArrowDownLeft className="h-4 w-4 mr-1.5" />
              Deposit
            </Button>
            {availableTotal > 0 && (
              <Button
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 bg-white text-gray-900 hover:bg-white/90 font-semibold h-11 rounded-xl shadow-lg shadow-white/10"
              >
                <ArrowUpRight className="h-4 w-4 mr-1.5" />
                Withdraw
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* === SUMMARY CARDS === */}
      <div className="space-y-3">
        {/* Available */}
        {(unlockedEntries.length > 0 || walletBalance > 0) && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setShowAvailableSheet(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-emerald-200/50 hover:border-emerald-300 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CircleDollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Available</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {walletBalance > 0 && unlockedEntries.length > 0
                    ? `Bank deposit + ${unlockedEntries.length} group${unlockedEntries.length > 1 ? 's' : ''}`
                    : walletBalance > 0 ? 'Bank deposit' : `${unlockedEntries.length} completed group${unlockedEntries.length > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-emerald-600 text-sm">
                {showBalance ? formatCurrency(availableTotal) : '••••'}
              </p>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </motion.button>
        )}

        {/* Pending */}
        {pendingPayouts.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => setShowPendingSheet(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-blue-200/50 hover:border-blue-300 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Pending</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pendingPayouts.length} active group{pendingPayouts.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-blue-600 text-sm">
                {showBalance ? formatCurrency(totalPendingPayouts) : '••••'}
              </p>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </motion.button>
        )}

        {/* Locked */}
        {lockedEntries.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowLockedSheet(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-amber-200/50 hover:border-amber-300 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Lock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Locked</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lockedEntries.length} group{lockedEntries.length > 1 ? 's' : ''} · Unlocks on completion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-amber-600 text-sm">
                {showBalance ? formatCurrency(pendingUnlockBalance) : '••••'}
              </p>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </motion.button>
        )}
      </div>

      {/* Empty State */}
      {unlockedEntries.length === 0 && lockedEntries.length === 0 && pendingPayouts.length === 0 && walletBalance <= 0 && (
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

      {/* Modals & Sheets */}
      <WithdrawModal
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        maxAmount={withdrawableBalance}
      />
      {selectedGroupForCashout && (
        <CashoutModal
          group={selectedGroupForCashout}
          open={!!selectedGroupForCashout}
          onOpenChange={(open) => !open && setSelectedGroupForCashout(null)}
        />
      )}
      <AvailableFundsSheet
        open={showAvailableSheet}
        onOpenChange={setShowAvailableSheet}
        walletBalance={walletBalance}
        unlockedEntries={unlockedEntries}
        formatCurrency={formatCurrency}
        showBalance={showBalance}
      />
      <PendingFundsSheet
        open={showPendingSheet}
        onOpenChange={setShowPendingSheet}
        pendingPayouts={pendingPayouts}
        formatCurrency={formatCurrency}
        showBalance={showBalance}
      />
      <LockedFundsSheet
        open={showLockedSheet}
        onOpenChange={setShowLockedSheet}
        lockedEntries={lockedEntries}
        totalLocked={pendingUnlockBalance}
        formatCurrency={formatCurrency}
        showBalance={showBalance}
      />
      <DepositModal
        open={showDepositModal}
        onOpenChange={setShowDepositModal}
      />
    </div>
  );
};

export default WalletTab;
