
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
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) return;
    
    setIsLoading(true);
    try {
      await joinGroup(groupCode.trim().toUpperCase());
      onOpenChange(false);
      setGroupCode('');
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setGroupCode('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
              Ask the group admin for the 6-character invitation code to join their savings group.
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
                  onChange={(e) => setGroupCode(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="pl-10 text-center text-lg tracking-widest uppercase font-mono"
                  maxLength={6}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && groupCode.length === 6) {
                      handleJoinGroup();
                    }
                  }}
                />
              </div>
              {groupCode.length > 0 && groupCode.length < 6 && (
                <p className="text-sm text-orange-600 mt-1">
                  Code must be exactly 6 characters ({6 - groupCode.length} more needed)
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm text-blue-800 mb-2">💡 How it works</h4>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Each group has a unique 6-character code</li>
                <li>• Only the group admin can see and share this code</li>
                <li>• You'll be assigned a position in the payout rotation</li>
                <li>• Make sure you trust the group members!</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinGroup}
              disabled={!groupCode.trim() || groupCode.length !== 6 || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Joining...' : 'Join Group'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
