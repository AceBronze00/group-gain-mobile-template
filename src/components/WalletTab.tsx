
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
      {/* Total Balance Hero - Dark */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 text-white shadow-xl"
      >
        <div className="relative z-10">
          {/* Total Balance - top section */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-zinc-300" />
              </div>
              <span className="text-sm font-medium text-zinc-400">Total Balance</span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
            >
              {showBalance ? <Eye className="h-4 w-4 text-zinc-400" /> : <EyeOff className="h-4 w-4 text-zinc-400" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={showBalance ? 'show' : 'hide'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-4xl font-bold tracking-tight text-white"
            >
              {showBalance ? formatCurrency(totalBalance) : '••••••'}
            </motion.p>
          </AnimatePresence>

          {/* Mini breakdown pills */}
          <div className="flex flex-wrap gap-2 mt-3 mb-5">
            <div className="flex items-center gap-1.5 bg-zinc-800/80 rounded-full px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-zinc-200 font-medium">
                {showBalance ? formatCurrency(availableTotal) : '••••'} available
              </span>
            </div>
            {totalPendingPayouts > 0 && (
              <div className="flex items-center gap-1.5 bg-zinc-800/80 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-[11px] text-zinc-200 font-medium">
                  {showBalance ? formatCurrency(totalPendingPayouts) : '••••'} pending
                </span>
              </div>
            )}
            {pendingUnlockBalance > 0 && (
              <div className="flex items-center gap-1.5 bg-zinc-800/80 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[11px] text-zinc-200 font-medium">
                  {showBalance ? formatCurrency(pendingUnlockBalance) : '••••'} locked
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => setShowDepositModal(true)}
              className="flex-1 font-semibold h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border-0"
            >
              <ArrowDownLeft className="h-4 w-4 mr-1.5" />
              Deposit
            </Button>
            <Button
              onClick={() => setShowWithdrawModal(true)}
              className="flex-1 font-semibold h-11 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900"
            >
              <ArrowUpRight className="h-4 w-4 mr-1.5" />
              Withdraw
            </Button>
          </div>
        </div>
      </motion.div>

      {/* === SUMMARY CARDS - Dark (always visible) === */}
      <div className="space-y-3">
        {/* Available */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setShowAvailableSheet(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CircleDollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Available</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {walletBalance > 0 && unlockedEntries.length > 0
                  ? `Bank deposit + ${unlockedEntries.length} nest${unlockedEntries.length > 1 ? 's' : ''}`
                  : walletBalance > 0
                    ? 'Bank deposit'
                    : unlockedEntries.length > 0
                      ? `${unlockedEntries.length} completed nest${unlockedEntries.length > 1 ? 's' : ''}`
                      : 'Ready to withdraw or use'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-emerald-400 text-sm">
              {showBalance ? formatCurrency(availableTotal) : '••••'}
            </p>
            <ChevronRight className="h-4 w-4 text-zinc-500" />
          </div>
        </motion.button>

        {/* Pending */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setShowPendingSheet(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Pending</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {pendingPayouts.length > 0
                  ? `${pendingPayouts.length} active nest${pendingPayouts.length > 1 ? 's' : ''}`
                  : 'Upcoming payouts from nests'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-blue-400 text-sm">
              {showBalance ? formatCurrency(totalPendingPayouts) : '••••'}
            </p>
            <ChevronRight className="h-4 w-4 text-zinc-500" />
          </div>
        </motion.button>

        {/* Locked */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setShowLockedSheet(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Locked</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {lockedEntries.length > 0
                  ? `${lockedEntries.length} nest${lockedEntries.length > 1 ? 's' : ''} · Unlocks on completion`
                  : 'Held until rounds complete'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-amber-400 text-sm">
              {showBalance ? formatCurrency(pendingUnlockBalance) : '••••'}
            </p>
            <ChevronRight className="h-4 w-4 text-zinc-500" />
          </div>
        </motion.button>
      </div>

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
