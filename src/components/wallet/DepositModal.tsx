import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowDownLeft, CreditCard } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DepositModal = ({ open, onOpenChange }: DepositModalProps) => {
  const { depositFunds } = useApp();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      depositFunds(depositAmount);
      setIsProcessing(false);
      setAmount('');
      onOpenChange(false);
    }, 2000);
  };

  const quickAmounts = [50, 100, 250, 500];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center">
            <ArrowDownLeft className="h-6 w-6 mr-2 text-blue-500" />
            Deposit Funds
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Quick Amount Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((qa) => (
                <Button
                  key={qa}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(qa.toString())}
                  className="text-xs"
                >
                  ${qa}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="deposit-amount">Deposit Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="deposit-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8"
                step="0.01"
                min="0"
              />
            </div>
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

          {/* Deposit Button */}
          <Button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Deposit {amount ? formatCurrency(parseFloat(amount)) : 'Funds'}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Funds are available instantly after deposit
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
