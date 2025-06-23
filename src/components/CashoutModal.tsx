
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Wallet, CreditCard, Building, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CashoutModalProps {
  group: {
    id: number;
    name: string;
    totalAmount: number;
    payoutAmount: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CashoutModal = ({ group, open, onOpenChange }: CashoutModalProps) => {
  const { toast } = useToast();
  const [cashoutOption, setCashoutOption] = useState("hold");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCashout = async () => {
    setIsProcessing(true);
    
    // Simulate cashout processing
    setTimeout(() => {
      if (cashoutOption === "hold") {
        toast({
          title: "Funds Added to Wallet",
          description: `$${group.payoutAmount} has been added to your app wallet`,
        });
      } else {
        const method = cashoutOption === "bank" ? "bank account" : "debit card";
        toast({
          title: "Transfer Initiated",
          description: `$${group.payoutAmount} is being transferred to your ${method}`,
        });
      }
      setIsProcessing(false);
      onOpenChange(false);
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Cashout from {group.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payout Summary */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(group.payoutAmount)}
              </div>
              <Badge className="bg-green-500">Pool Completed - Your Turn!</Badge>
              <p className="text-sm text-gray-600 mt-2">
                Congratulations! Your turn to receive the pool payout.
              </p>
            </div>
          </Card>

          {/* Cashout Options */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Choose your cashout option:</Label>
            <RadioGroup value={cashoutOption} onValueChange={setCashoutOption}>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="hold" id="hold" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-blue-500" />
                    <Label htmlFor="hold" className="font-medium">Hold in App Wallet</Label>
                  </div>
                  <p className="text-sm text-gray-600">Keep funds in your MoneyPool wallet for future use</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">Instant</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="bank" id="bank" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-green-500" />
                    <Label htmlFor="bank" className="font-medium">Transfer to Bank</Label>
                  </div>
                  <p className="text-sm text-gray-600">****1234 - Chase Bank</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600">1-2 business days</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="card" id="card" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    <Label htmlFor="card" className="font-medium">Transfer to Debit Card</Label>
                  </div>
                  <p className="text-sm text-gray-600">****5678 - Visa Debit</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-600">Within 30 minutes</span>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Transfer Fees Info */}
          {cashoutOption !== "hold" && (
            <Card className="p-3 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Transfer Fee:</strong> {cashoutOption === "bank" ? "Free" : "$1.50 instant transfer fee"}
              </p>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleCashout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {cashoutOption === "hold" ? "Add to Wallet" : "Transfer Now"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CashoutModal;
