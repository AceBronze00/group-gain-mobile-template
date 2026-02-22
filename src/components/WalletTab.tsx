
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, Eye, EyeOff, Lock, Unlock, Clock, CircleDollarSign, ArrowDownLeft, ChevronRight } from "lucide-react";
import CashoutModal from "./CashoutModal";
import WithdrawModal from "./WithdrawModal";
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

          {/* Action button */}
          {availableTotal > 0 && (
            <div className="mt-6">
              <Button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold h-11 rounded-xl shadow-lg shadow-white/10"
              >
                <ArrowUpRight className="h-4 w-4 mr-1.5" />
                Withdraw Funds
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* === AVAILABLE FUNDS SECTION === */}
      {(unlockedEntries.length > 0 || walletBalance > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center">
              <CircleDollarSign className="h-3 w-3 text-emerald-600" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Available</h3>
            <span className="text-xs text-muted-foreground ml-auto">{formatCurrency(availableTotal)}</span>
          </div>
          <p className="text-xs text-muted-foreground px-1 -mt-1">Withdraw or use as payment to another group</p>

          {walletBalance > 0 && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-emerald-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Cash Balance</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Ready to use</p>
                </div>
              </div>
              <p className="font-bold text-emerald-600 text-sm">{formatCurrency(walletBalance)}</p>
            </div>
          )}

          {unlockedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card border border-emerald-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Unlock className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{entry.groupName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Received {formatDate(entry.receivedDate)}
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
        </motion.div>
      )}

      {/* === PENDING FUNDS SECTION === */}
      {pendingPayouts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center">
              <Clock className="h-3 w-3 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Pending</h3>
            <span className="text-xs text-muted-foreground ml-auto">{formatCurrency(totalPendingPayouts)}</span>
          </div>
          <p className="text-xs text-muted-foreground px-1 -mt-1">Upcoming payouts from your active groups</p>

          {pendingPayouts.map((payout, index) => (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card border border-blue-100 transition-all"
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
                <p className="font-bold text-blue-600 text-sm">{formatCurrency(payout.amount)}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 mt-1">
                  <Clock className="h-2.5 w-2.5" />
                  Pending
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* === LOCKED FUNDS SECTION === */}
      {lockedEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-1">
            <div className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center">
              <Lock className="h-3 w-3 text-amber-600" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Locked</h3>
            <span className="text-xs text-muted-foreground ml-auto">{formatCurrency(pendingUnlockBalance)}</span>
          </div>
          <p className="text-xs text-muted-foreground px-1 -mt-1">Held until your group cycle completes</p>

          {lockedEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center justify-between p-4 rounded-2xl bg-card border border-amber-100 transition-all"
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

      {/* Modals */}
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
    </div>
  );
};

export default WalletTab;
