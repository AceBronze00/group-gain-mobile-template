
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, ArrowUpRight, Eye, EyeOff, Gift, Clock, CheckCircle, Users, ChevronRight } from "lucide-react";
import CashoutModal from "./CashoutModal";

const WalletTab = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedGroupForCashout, setSelectedGroupForCashout] = useState(null);
  
  // Mock wallet data
  const walletBalance = 1250.75;
  const pendingTransfers = 300.00;

  // Mock completed groups ready for cashout
  const completedGroups = [
    {
      id: 3,
      name: "Emergency Fund",
      members: 6,
      totalAmount: 1800,
      payoutAmount: 1800,
      completedDate: "2024-06-20",
      readyForCashout: true
    },
    {
      id: 4,
      name: "Holiday Shopping",
      members: 4,
      totalAmount: 1200,
      payoutAmount: 1200,
      completedDate: "2024-06-18",
      readyForCashout: true
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const mockTransferGroup = {
    id: 0,
    name: "Wallet Transfer",
    totalAmount: walletBalance,
    payoutAmount: walletBalance
  };

  const handleCashoutClick = (group: any) => {
    setSelectedGroupForCashout(group);
  };

  return (
    <div className="space-y-6 pb-20 px-2">
      {/* Wallet Balance Card */}
      <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Wallet className="h-6 w-6" />
            <span className="font-bold text-lg">App Wallet</span>
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
            <p className="text-sm text-green-100 mb-2">Available Balance</p>
            <p className="text-3xl font-bold">
              {showBalance ? formatCurrency(walletBalance) : "••••••"}
            </p>
          </div>
          
          {pendingTransfers > 0 && (
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                <span className="text-sm text-green-100">Pending Transfers</span>
                <Badge variant="outline" className="text-green-100 border-green-200 bg-white/10">
                  {showBalance ? formatCurrency(pendingTransfers) : "••••"}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {walletBalance > 0 && (
          <Button
            onClick={() => setShowTransferModal(true)}
            className="w-full bg-white text-green-600 hover:bg-green-50 font-bold py-3 rounded-xl"
          >
            <ArrowUpRight className="h-5 w-5 mr-2" />
            Transfer to Bank
          </Button>
        )}
      </Card>

      {/* Cashout Alert for Completed Groups */}
      {completedGroups.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg rounded-2xl">
          <div className="text-center">
            <div className="mb-4">
              <Gift className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-bold text-xl">
                💰 Ready to Cashout!
              </h3>
            </div>
            <p className="text-green-100 mb-4">
              {completedGroups.length} pool{completedGroups.length > 1 ? 's' : ''} completed - claim your payout
            </p>
            <Button
              onClick={() => setSelectedGroupForCashout(completedGroups[0])}
              className="bg-white text-green-600 hover:bg-green-50 font-bold px-6 py-2 rounded-xl"
            >
              View All
            </Button>
          </div>
        </Card>
      )}

      {/* Completed Groups Ready for Cashout */}
      {completedGroups.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center">
              <Gift className="h-6 w-6 mr-2 text-green-500" />
              Ready to Cashout ({completedGroups.length})
            </h3>
          </div>
          
          {completedGroups.map((group) => (
            <Card 
              key={group.id} 
              className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-102 hover:shadow-xl rounded-2xl"
              onClick={() => handleCashoutClick(group)}
            >
              <div className="text-center mb-4">
                <h4 className="font-bold text-xl text-gray-800 mb-2">{group.name}</h4>
                <p className="text-sm text-gray-600 flex items-center justify-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members} members • Completed {new Date(group.completedDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatCurrency(group.payoutAmount)}
                </div>
                <Badge className="bg-green-500 hover:bg-green-600 px-4 py-1">
                  Ready to Cashout 💰
                </Badge>
              </div>
              
              <div className="flex items-center justify-center pt-2">
                <div className="text-sm text-green-700 font-medium flex items-center">
                  🎉 Pool completed! Click to claim your payout
                  <ChevronRight className="h-5 w-5 ml-2 text-green-500" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <CashoutModal
        group={mockTransferGroup}
        open={showTransferModal}
        onOpenChange={setShowTransferModal}
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
