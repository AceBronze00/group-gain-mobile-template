
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, DollarSign, Calendar, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JoinGroupModal = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState('');
  const [foundGroup, setFoundGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock group data for demonstration
  const mockGroups = {
    'COFFEE123': {
      id: 'COFFEE123',
      name: 'Morning Coffee Fund',
      description: 'Weekly coffee fund for the office team',
      creator: 'Sarah Mitchell',
      members: 3,
      maxMembers: 5,
      contributionAmount: 25,
      frequency: 'weekly',
      totalPayout: 125,
      trustScoreRequired: 70,
      currentMembers: [
        { name: 'Sarah M.', avatar: 'SM', trustScore: 92 },
        { name: 'Mike R.', avatar: 'MR', trustScore: 88 },
        { name: 'Lisa K.', avatar: 'LK', trustScore: 85 }
      ]
    },
    'VACATION456': {
      id: 'VACATION456',
      name: 'Summer Vacation Pool',
      description: 'Saving for our group vacation to Hawaii',
      creator: 'John Davis',
      members: 6,
      maxMembers: 8,
      contributionAmount: 200,
      frequency: 'monthly',
      totalPayout: 1600,
      trustScoreRequired: 80,
      currentMembers: [
        { name: 'John D.', avatar: 'JD', trustScore: 95 },
        { name: 'Emma W.', avatar: 'EW', trustScore: 91 },
        { name: 'Alex T.', avatar: 'AT', trustScore: 87 },
        { name: 'Maya P.', avatar: 'MP', trustScore: 84 },
        { name: 'Chris L.', avatar: 'CL', trustScore: 82 },
        { name: 'Dana M.', avatar: 'DM', trustScore: 89 }
      ]
    }
  };

  const handleSearch = async () => {
    if (!inviteCode.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const group = mockGroups[inviteCode.toUpperCase()];
      if (group) {
        setFoundGroup(group);
      } else {
        toast({
          title: "Group Not Found",
          description: "Please check the invite code and try again.",
          variant: "destructive"
        });
        setFoundGroup(null);
      }
      setLoading(false);
    }, 1000);
  };

  const handleJoinGroup = () => {
    if (!foundGroup) return;
    
    // Check if user's trust score meets requirement (mock: user has 85)
    const userTrustScore = 85;
    if (userTrustScore < foundGroup.trustScoreRequired) {
      toast({
        title: "Trust Score Too Low",
        description: `This group requires a minimum trust score of ${foundGroup.trustScoreRequired}. Your current score is ${userTrustScore}.`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Successfully Joined Group!",
      description: `Welcome to ${foundGroup.name}. You'll receive payment instructions soon.`,
    });
    
    onOpenChange(false);
    setInviteCode('');
    setFoundGroup(null);
  };

  const getTrustScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly'
    };
    return labels[frequency] || frequency;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            Join Existing Group
          </DialogTitle>
          <p className="text-center text-gray-600">
            Enter the invite code shared by the group creator
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Search Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Group Invite Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="inviteCode"
                  placeholder="e.g., COFFEE123"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="text-lg font-mono"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={loading || !inviteCode.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Group Details */}
          {foundGroup && (
            <Card className="p-6 border-2 border-blue-200 bg-blue-50/50">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800">{foundGroup.name}</h3>
                  <p className="text-gray-600 mt-1">{foundGroup.description}</p>
                  <Badge variant="outline" className="mt-2">
                    Created by {foundGroup.creator}
                  </Badge>
                </div>

                {/* Group Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-blue-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-lg font-bold text-gray-800">
                        {foundGroup.members}/{foundGroup.maxMembers}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-lg font-bold text-gray-800">
                        ${foundGroup.contributionAmount}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Per Person</div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-3 p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Payout:</span>
                    <span className="font-bold text-lg">${foundGroup.totalPayout.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {getFrequencyLabel(foundGroup.frequency)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Min Trust Score:</span>
                    <Badge className={getTrustScoreColor(foundGroup.trustScoreRequired)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {foundGroup.trustScoreRequired}
                    </Badge>
                  </div>
                </div>

                {/* Current Members */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Current Members
                  </h4>
                  <div className="space-y-2">
                    {foundGroup.currentMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-800">{member.name}</span>
                        </div>
                        <Badge className={`text-xs ${getTrustScoreColor(member.trustScore)}`}>
                          {member.trustScore}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Join Button */}
                <Button 
                  onClick={handleJoinGroup}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
                  disabled={foundGroup.members >= foundGroup.maxMembers}
                >
                  {foundGroup.members >= foundGroup.maxMembers ? 'Group Full' : 'Join This Group'}
                </Button>
              </div>
            </Card>
          )}

          {/* Demo Codes */}
          <Card className="p-4 bg-gray-50 border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-2">Demo Codes:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <code className="bg-white px-2 py-1 rounded">COFFEE123</code>
                <span className="text-gray-600">Coffee Fund (3/5 members)</span>
              </div>
              <div className="flex justify-between">
                <code className="bg-white px-2 py-1 rounded">VACATION456</code>
                <span className="text-gray-600">Vacation Pool (6/8 members)</span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
