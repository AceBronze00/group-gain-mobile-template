
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, DollarSign, Calendar, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  avatar: string;
  trustScore: number;
  groupsCompleted: number;
  activeGroups: number;
  totalContributed: number;
}

interface InviteToGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const InviteToGroupModal = ({ open, onOpenChange, user }: InviteToGroupModalProps) => {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const { toast } = useToast();

  // Mock user's groups that they can invite others to
  const userGroups = [
    {
      id: 1,
      name: "Weekend Getaway Fund",
      members: 6,
      maxMembers: 8,
      contributionAmount: 200,
      frequency: "monthly",
      nextPayout: "2024-07-10"
    },
    {
      id: 2,
      name: "Emergency Fund Circle",
      members: 4,
      maxMembers: 6,
      contributionAmount: 150,
      frequency: "monthly",
      nextPayout: "2024-06-25"
    }
  ];

  const handleSendInvite = () => {
    if (!selectedGroup || !user) return;
    
    const group = userGroups.find(g => g.id === selectedGroup);
    
    // Mock API call to send invitation
    console.log('Sending invite to:', user.name, 'for group:', group?.name, 'with message:', inviteMessage);
    
    toast({
      title: "Invitation Sent!",
      description: `${user.name} has been invited to join ${group?.name}`,
    });
    
    onOpenChange(false);
    setSelectedGroup(null);
    setInviteMessage('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Invite {user.name} to Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Preview */}
          <Card className="p-3 bg-gray-50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{user.name}</div>
                <Badge className="text-xs">Trust Score: {user.trustScore}</Badge>
              </div>
            </div>
          </Card>

          {/* Select Group */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select a group to invite them to:</Label>
            <div className="space-y-2">
              {userGroups.map((group) => (
                <Card 
                  key={group.id}
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedGroup === group.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{group.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {group.members}/{group.maxMembers} members
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{formatCurrency(group.contributionAmount)} {group.frequency}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Next: {new Date(group.nextPayout).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Personal Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Personal Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Add a personal note to your invitation..."
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Send Button */}
          <Button 
            onClick={handleSendInvite}
            disabled={!selectedGroup}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteToGroupModal;
