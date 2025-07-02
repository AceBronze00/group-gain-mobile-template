
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, DollarSign, Users } from "lucide-react";

interface LateJoinerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupCode: string;
  requiredAmount: number;
  onConfirm: () => void;
}

const LateJoinerModal = ({ open, onOpenChange, groupCode, requiredAmount, onConfirm }: LateJoinerModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <span>Joining an Ongoing Group</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <Users className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">
              This group has already started. To join fairly, your <strong>first payment</strong> will need to match the total amount that has already been paid out to existing members.
            </p>
          </div>

          <Card className="p-6 bg-orange-50 border-orange-200">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <DollarSign className="h-6 w-6 text-orange-600" />
                <span className="text-sm text-orange-700 font-medium">Your first required payment:</span>
              </div>
              <div className="text-3xl font-bold text-orange-800">
                ${requiredAmount.toLocaleString()}
              </div>
            </div>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm text-blue-800 mb-2">💡 Why this amount?</h4>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• This ensures all members contribute equally</li>
              <li>• You'll be added to the regular payout rotation</li>
              <li>• Future payments will be the normal contribution amount</li>
              <li>• You'll receive your full payout when it's your turn</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              Confirm & Join
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LateJoinerModal;
