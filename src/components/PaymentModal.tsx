
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, DollarSign, Calendar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  group: {
    id: number;
    name: string;
    contributionAmount: number;
    frequency: string;
    nextPayout: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentModal = ({ group, open, onOpenChange }: PaymentModalProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [customAmount, setCustomAmount] = useState(group.contributionAmount.toString());
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: `$${customAmount} contributed to ${group.name}`,
      });
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
            Pay into {group.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Regular Contribution</span>
              <span className="font-semibold">{formatCurrency(group.contributionAmount)} {group.frequency}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Next Payout</span>
              <span className="font-semibold">{new Date(group.nextPayout).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Status</span>
              <Badge className="bg-yellow-500">Due</Badge>
            </div>
          </Card>

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="amount"
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="pl-10"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomAmount(group.contributionAmount.toString())}
              >
                Regular ({formatCurrency(group.contributionAmount)})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomAmount((group.contributionAmount * 2).toString())}
              >
                Double Payment
              </Button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="bank" id="bank" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    <Label htmlFor="bank" className="font-medium">Bank Account</Label>
                  </div>
                  <p className="text-sm text-gray-600">****1234 - Chase Bank</p>
                </div>
                <Badge className="bg-green-500">Primary</Badge>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-purple-500" />
                    <Label htmlFor="card" className="font-medium">Credit Card</Label>
                  </div>
                  <p className="text-sm text-gray-600">****5678 - Visa</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Schedule */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Payment Schedule</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Your {group.frequency} contribution of {formatCurrency(group.contributionAmount)} is due today.
            </p>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="auto-pay" className="rounded" />
              <Label htmlFor="auto-pay" className="text-sm">
                Enable auto-pay for future contributions
              </Label>
            </div>
          </Card>

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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Pay {formatCurrency(parseFloat(customAmount))}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
