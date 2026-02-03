
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, ArrowUpRight, Eye, EyeOff, Gift, Clock, CheckCircle, Users, ChevronRight, Lock, Unlock, Shield } from "lucide-react";
import CashoutModal from "./CashoutModal";
import WithdrawModal from "./WithdrawModal";
import SavingsGoalCard from "./wallet/SavingsGoalCard";
import { useApp } from "@/contexts/AppContext";

const WalletTab = () => {
  const { 
    walletBalance, 
    getWithdrawableBalance, 
    getPendingUnlockBalance,
    getLockedEntries,
    getUnlockedEntries,
    currentUserId,
    savingsGoal,
    updateSavingsGoal,
    getTotalSavings
  } = useApp();
  
  const [showBalance, setShowBalance] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedGroupForCashout, setSelectedGroupForCashout] = useState(null);
  
  const withdrawableBalance = getWithdrawableBalance();
  const pendingUnlockBalance = getPendingUnlockBalance();
  const lockedEntries = getLockedEntries();
  const unlockedEntries = getUnlockedEntries();
  const totalSavings = getTotalSavings();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleCashoutClick = (group: any) => {
    setSelectedGroupForCashout(group);
  };

  return (
    <div className="space-y-6 pb-20 px-2">
      {/* Savings Goal Card */}
      <SavingsGoalCard
        goalAmount={savingsGoal.targetAmount}
        currentSavings={totalSavings}
        goalName={savingsGoal.name}
        onUpdateGoal={updateSavingsGoal}
      />

      {/* Withdrawable Balance Card */}
      <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Wallet className="h-6 w-6" />
            <span className="font-bold text-lg">Withdrawable Balance</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            className="text-white hover:bg-white/20 p-2 h-auto rounded-full"
          >
            {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-green-100 mb-2">Available for Withdrawal</p>
            <p className="text-3xl font-bold">
              {showBalance ? formatCurrency(withdrawableBalance) : "••••••"}
            </p>
          </div>
        </div>

        {withdrawableBalance > 0 && (
          <Button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-3 rounded-xl"
          >
            <ArrowUpRight className="h-5 w-5 mr-2" />
            Withdraw Funds
          </Button>
        )}
      </Card>

      {/* Pending Unlock Balance */}
      {pendingUnlockBalance > 0 && (
        <Card className="p-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="h-6 w-6" />
            <span className="font-bold text-lg">Pending Unlock</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-orange-100 mb-2">Locked Until Group Completion</p>
            <p className="text-3xl font-bold">
              {showBalance ? formatCurrency(pendingUnlockBalance) : "••••••"}
            </p>
          </div>
        </Card>
      )}

      {/* Unlocked Wallet Entries */}
      {unlockedEntries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Unlock className="h-5 w-5 mr-2 text-green-500" />
              Available Funds ({unlockedEntries.length})
            </h3>
          </div>
          
          {unlockedEntries.map((entry) => (
            <Card key={entry.id} className="p-4 bg-green-50 border-green-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{entry.groupName}</h4>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Received {formatDate(entry.receivedDate)}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    {entry.groupLockPolicy ? 'Group completed - funds unlocked' : 'Immediate withdrawal policy'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(entry.amount)}
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    Available
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Locked Wallet Entries */}
      {lockedEntries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-orange-500" />
              Locked Funds ({lockedEntries.length})
            </h3>
          </div>
          
          {lockedEntries.map((entry) => (
            <Card key={entry.id} className="p-4 bg-orange-50 border-orange-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    {entry.groupName}
                    <Lock className="h-4 w-4 ml-2 text-orange-500" />
                  </h4>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1 text-orange-500" />
                    Received {formatDate(entry.receivedDate)}
                  </p>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    🔒 Still Active - Funds locked until group completes
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-orange-600">
                    {formatCurrency(entry.amount)}
                  </div>
                  <Badge variant="outline" className="border-orange-300 text-orange-600">
                    Locked
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {unlockedEntries.length === 0 && lockedEntries.length === 0 && (
        <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="max-w-sm mx-auto">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Wallet Entries Yet</h3>
            <p className="text-gray-600 mb-6">
              Your payouts from groups will appear here. Join or create groups to start earning!
            </p>
          </div>
        </Card>
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
