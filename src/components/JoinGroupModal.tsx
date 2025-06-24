
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Search } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface JoinGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinGroupModal = ({ open, onOpenChange }: JoinGroupModalProps) => {
  const { joinGroup } = useApp();
  const [groupCode, setGroupCode] = useState('');

  const handleJoinGroup = () => {
    if (groupCode.trim()) {
      joinGroup(groupCode);
      onOpenChange(false);
      setGroupCode('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Join Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Enter Group Code</h3>
            <p className="text-gray-600 text-sm">
              Ask the group creator for the invitation code to join their savings group.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="groupCode">Group Code</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="groupCode"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="pl-10 text-center text-lg tracking-widest uppercase"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm text-blue-800 mb-2">💡 Demo Codes</h4>
              <p className="text-xs text-blue-600">
                Try these demo codes: <strong>COFFEE</strong>, <strong>TRAVEL</strong>, or <strong>SAVINGS</strong>
              </p>
            </div>
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
              onClick={handleJoinGroup}
              disabled={!groupCode.trim()}
              className="flex-1"
            >
              Join Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
