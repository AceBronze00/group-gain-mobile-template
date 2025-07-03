
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Shield,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface GroupMember {
  id: number;
  name: string;
  avatar: string;
  trustScore: number;
  hasReceived: boolean;
  joinedDate: string;
}

interface GroupDetailsModalProps {
  group: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GroupDetailsModal = ({ group, open, onOpenChange }: GroupDetailsModalProps) => {
  // Mock members data
  const members: GroupMember[] = [
    {
      id: 1,
      name: "You",
      avatar: "/placeholder.svg",
      trustScore: 85,
      hasReceived: false,
      joinedDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah M.",
      avatar: "/placeholder.svg",
      trustScore: 92,
      hasReceived: true,
      joinedDate: "2024-01-10"
    },
    {
      id: 3,
      name: "Mike J.",
      avatar: "/placeholder.svg",
      trustScore: 78,
      hasReceived: true,
      joinedDate: "2024-01-12"
    },
    {
      id: 4,
      name: "Emma D.",
      avatar: "/placeholder.svg",
      trustScore: 88,
      hasReceived: false,
      joinedDate: "2024-01-18"
    },
    {
      id: 5,
      name: "James W.",
      avatar: "/placeholder.svg",
      trustScore: 71,
      hasReceived: false,
      joinedDate: "2024-01-20"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDaysUntilPayout = (date: string) => {
    const today = new Date();
    const payoutDate = new Date(date);
    const diffTime = payoutDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {group.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-96">
            <TabsContent value="overview" className="space-y-4">
              {/* Group Stats */}
              <Card className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-bold">{formatCurrency(group.totalAmount)}</div>
                    <div className="text-xs text-gray-500">Pool Amount</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-lg font-bold">{group.members}</div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                </div>
              </Card>

              {/* Next Payout */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Next Payout</h4>
                  <Badge variant={group.myTurn ? "default" : "secondary"}>
                    {group.myTurn ? "Your Turn" : `${getDaysUntilPayout(group.nextPayout)} days`}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Recipient: {group.payoutRecipient}</span>
                    <span>{new Date(group.nextPayout).toLocaleDateString()}</span>
                  </div>
                  <Progress value={group.progress} className="h-2" />
                  <div className="text-xs text-gray-500 text-center">
                    {group.progress}% collected
                  </div>
                </div>
              </Card>

              {/* Your Payout Date */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Your Payout Date</h4>
                    <p className="text-sm text-gray-600">
                      When you'll receive the pool
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {new Date(group.myPayoutDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-3">
              {members.map((member) => (
                <Card key={member.id} className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-blue-500 text-white text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {member.hasReceived && (
                        <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{member.name}</h4>
                        {member.hasReceived && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            Received
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Shield className="h-3 w-3 text-blue-500" />
                        <span className={`text-xs ${getTrustScoreColor(member.trustScore)}`}>
                          Trust: {member.trustScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="history" className="space-y-3">
              <Card className="p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Sarah M. received payout</p>
                    <p className="text-xs text-gray-500">March 15, 2024</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(group.totalAmount)}
                  </span>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Mike J. received payout</p>
                    <p className="text-xs text-gray-500">March 8, 2024</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(group.totalAmount)}
                  </span>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Group created</p>
                    <p className="text-xs text-gray-500">January 10, 2024</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetailsModal;
