
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, TrendingUp, UserPlus } from "lucide-react";
import { useState } from "react";
import InviteToGroupModal from "./InviteToGroupModal";

interface User {
  id: number;
  name: string;
  avatar: string;
  trustScore: number;
  groupsCompleted: number;
  activeGroups: number;
  totalContributed: number;
}

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const UserProfileModal = ({ open, onOpenChange, user }: UserProfileModalProps) => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!user) return null;

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">User Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* User Info */}
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-blue-500 text-white text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
              
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <Badge className={`text-sm px-3 py-1 ${getTrustScoreColor(user.trustScore)}`}>
                  Trust Score: {user.trustScore}
                </Badge>
              </div>
            </div>

            {/* Stats */}
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-bold text-blue-600 text-lg">{user.groupsCompleted}</div>
                  <div className="text-gray-500 text-xs">Groups Completed</div>
                </div>
                <div>
                  <div className="font-bold text-green-600 text-lg">{user.activeGroups}</div>
                  <div className="text-gray-500 text-xs">Active Groups</div>
                </div>
                <div>
                  <div className="font-bold text-purple-600 text-lg">{formatCurrency(user.totalContributed)}</div>
                  <div className="text-gray-500 text-xs">Total Contributed</div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={() => setShowInviteModal(true)}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite to Group
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <InviteToGroupModal 
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        user={user}
      />
    </>
  );
};

export default UserProfileModal;
