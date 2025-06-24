
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, CreditCard, Users, Calendar } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: any;
}

const PaymentModal = ({ open, onOpenChange, group }: PaymentModalProps) => {
  const { makePayment } = useApp();
  const [paymentAmount, setPaymentAmount] = useState(group?.contributionAmount?.toString() || '');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePayment = () => {
    if (group && paymentAmount) {
      makePayment(group.id, parseFloat(paymentAmount));
      onOpenChange(false);
      setPaymentAmount(group.contributionAmount.toString());
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Make Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Group Info */}
          <Card className="p-4 bg-blue-50">
            <div className="text-center">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{group.name}</h3>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members} members
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {group.frequency}
                </div>
              </div>
            </div>
          </Card>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-bold text-blue-600">{group.progress}%</span>
            </div>
            <Progress value={group.progress} className="h-3" />
            <div className="text-center text-sm text-gray-500">
              {group.membersPaid} of {group.members} members have paid
            </div>
          </div>

          {/* Payment Amount */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Payment Amount</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="pl-10"
                  placeholder="0.00"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Suggested: {formatCurrency(group.contributionAmount)}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant={paymentMethod === 'card' ? "default" : "outline"}
                  onClick={() => setPaymentMethod('card')}
                  className="flex items-center justify-center"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </Button>
                <Button
                  variant={paymentMethod === 'wallet' ? "default" : "outline"}
                  onClick={() => setPaymentMethod('wallet')}
                  className="flex items-center justify-center"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Wallet
                </Button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <Card className="p-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Amount:</span>
                <span className="font-semibold">{formatCurrency(parseFloat(paymentAmount) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <Badge variant="secondary">{paymentMethod === 'card' ? 'Credit Card' : 'Wallet'}</Badge>
              </div>
              {group.myTurn && (
                <div className="flex justify-between border-t pt-2 text-green-600 font-semibold">
                  <span>You'll receive:</span>
                  <span>{formatCurrency(group.totalAmount)}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              Pay {formatCurrency(parseFloat(paymentAmount) || 0)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
