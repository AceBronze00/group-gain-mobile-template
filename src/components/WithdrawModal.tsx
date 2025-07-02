
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Wallet, CreditCard } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxAmount: number;
}

const WithdrawModal = ({ open, onOpenChange, maxAmount }: WithdrawModalProps) => {
  const { withdrawFunds } = useApp();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return;
    }

    if (withdrawAmount > maxAmount) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      withdrawFunds(withdrawAmount);
      setIsProcessing(false);
      setAmount('');
      onOpenChange(false);
    }, 2000);
  };

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = (maxAmount * percentage).toFixed(2);
    setAmount(quickAmount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center">
            <ArrowUpRight className="h-6 w-6 mr-2 text-green-500" />
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Available Balance */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Wallet className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">Available Balance</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(maxAmount)}
              </div>
            </div>
          </Card>

          {/* Quick Amount Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Select</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(0.25)}
                className="text-xs"
              >
                25%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(0.5)}
                className="text-xs"
              >
                50%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(1)}
                className="text-xs"
              >
                All
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8"
                step="0.01"
                min="0"
                max={maxAmount}
              />
            </div>
            {parseFloat(amount) > maxAmount && (
              <p className="text-xs text-red-500">
                Amount exceeds available balance
              </p>
            )}
          </div>

          {/* Bank Account Info */}
          <Card className="p-3 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-700">Bank Account</p>
                <p className="text-xs text-blue-600">•••• •••• •••• 1234</p>
              </div>
            </div>
          </Card>

          {/* Withdraw Button */}
          <Button
            onClick={handleWithdraw}
            disabled={
              !amount || 
              parseFloat(amount) <= 0 || 
              parseFloat(amount) > maxAmount || 
              isProcessing
            }
            className="w-full bg-green-600 hover:bg-green-700 py-3"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Withdraw {amount ? formatCurrency(parseFloat(amount)) : 'Funds'}
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Funds typically arrive in 1-3 business days
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
