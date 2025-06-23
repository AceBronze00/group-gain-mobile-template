
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import CashoutModal from "./CashoutModal";

const WalletBalance = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  
  // Mock wallet data
  const walletBalance = 1250.75;
  const pendingTransfers = 300.00;

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

  return (
    <>
      <Card className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span className="font-semibold">App Wallet</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            className="text-white hover:bg-white/20 p-1 h-auto"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div>
            <p className="text-sm text-green-100">Available Balance</p>
            <p className="text-2xl font-bold">
              {showBalance ? formatCurrency(walletBalance) : "••••••"}
            </p>
          </div>
          
          {pendingTransfers > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-100">Pending Transfers</span>
              <Badge variant="outline" className="text-green-100 border-green-200">
                {showBalance ? formatCurrency(pendingTransfers) : "••••"}
              </Badge>
            </div>
          )}
        </div>

        {walletBalance > 0 && (
          <Button
            onClick={() => setShowTransferModal(true)}
            className="w-full mt-4 bg-white text-green-600 hover:bg-green-50 font-semibold"
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Transfer to Bank
          </Button>
        )}
      </Card>

      <CashoutModal
        group={mockTransferGroup}
        open={showTransferModal}
        onOpenChange={setShowTransferModal}
      />
    </>
  );
};

export default WalletBalance;
