import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users, Calendar, TrendingUp, ChevronRight, Bell, DollarSign, Clock, Key, Copy } from "lucide-react";
import CreateGroupModal from "@/components/CreateGroupModal";
import JoinGroupModal from "@/components/JoinGroupModal";
import GroupDetailsModal from "@/components/GroupDetailsModal";
import PaymentModal from "@/components/PaymentModal";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const DashboardTab = () => {
  const { groups: activeGroups } = useApp();
  const { toast } = useToast();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupForPayment, setSelectedGroupForPayment] = useState(null);

  // Mock user data
  const user = {
    name: "Alex Johnson",
    avatar: "/placeholder.svg",
    greeting: "Good morning"
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDaysUntilPayout = (date: string) => {
    const today = new Date();
    const payoutDate = new Date(date);
    const diffTime = payoutDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const copyInviteCode = (inviteCode: string) => {
    navigator.clipboard.writeText(inviteCode);
    toast({
      title: "Invite Code Copied!",
      description: `Code "${inviteCode}" copied to clipboard`,
    });
  };

  const handleGroupClick = (group: any) => {
    setSelectedGroup(group);
  };

  const handlePaymentClick = (e: React.MouseEvent, group: any) => {
    e.stopPropagation(); // Prevent the group details modal from opening
    setSelectedGroupForPayment(group);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* User Welcome Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 ring-4 ring-white/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-blue-100 text-sm">{user.greeting},</p>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-blue-100 text-sm mt-1">Ready to save together?</p>
          </div>
          <div className="relative">
            <Bell className="h-6 w-6 text-blue-100" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => setShowCreateGroup(true)}
          className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-2"
        >
          <Plus className="h-6 w-6" />
          <span>Create Group</span>
        </Button>
        <Button 
          onClick={() => setShowJoinGroup(true)}
          variant="outline"
          className="h-20 border-2 border-blue-200 text-blue-600 font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-blue-50 flex flex-col items-center justify-center space-y-2"
        >
          <Users className="h-6 w-6" />
          <span>Join Group</span>
        </Button>
      </div>

      {/* Active Groups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Your Groups ({activeGroups.length})
          </h3>
        </div>
        
        {activeGroups.map((group) => (
          <Card 
            key={group.id} 
            className="p-5 bg-white/90 backdrop-blur-sm border-0 shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-102 hover:shadow-xl rounded-2xl"
            onClick={() => handleGroupClick(group)}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-lg text-gray-800">{group.name}</h4>
                  {group.isAdmin && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members} members
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-800">
                  {formatCurrency(group.totalAmount)}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={group.myTurn ? "default" : "secondary"}
                    className={group.myTurn ? "bg-green-500 hover:bg-green-600" : "bg-gray-100 text-gray-600"}
                  >
                    {group.myTurn ? "Your Turn 🎯" : `Position ${group.position}`}
                  </Badge>
                  <Button
                    onClick={(e) => handlePaymentClick(e, group)}
                    className={`text-white text-xs px-3 py-1 h-7 ${
                      group.myTurn 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    <DollarSign className="h-3 w-3 mr-1" />
                    Pay Now
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Admin Invite Code Section */}
            {group.isAdmin && (
              <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Invite Code:</span>
                    <code className="bg-purple-100 px-2 py-1 rounded text-sm font-mono text-purple-800">
                      {group.inviteCode}
                    </code>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyInviteCode(group.inviteCode);
                    }}
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 border-purple-300 text-purple-600 hover:bg-purple-100"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-purple-600 mt-1">Share this code with members to join your group</p>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Progress</span>
                <span className="font-bold text-blue-600">{group.progress}%</span>
              </div>
              <Progress value={group.progress} className="h-3 bg-gray-100" />
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="font-medium">Next: {new Date(group.nextPayout).toLocaleDateString()}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              {/* My Payout Date - subtle addition */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1 text-green-500" />
                  <span>My payout: {new Date(group.myPayoutDate).toLocaleDateString()}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {group.myTurn ? "Today!" : `${getDaysUntilPayout(group.myPayoutDate)} days`}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {activeGroups.length === 0 && (
        <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="max-w-sm mx-auto">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Start Your First Group!</h3>
            <p className="text-gray-600 mb-6">Create or join a group to begin your savings journey with friends and family.</p>
            <Button 
              onClick={() => setShowCreateGroup(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold"
            >
              Get Started
            </Button>
          </div>
        </Card>
      )}

      {/* Modals */}
      <CreateGroupModal 
        open={showCreateGroup} 
        onOpenChange={setShowCreateGroup} 
      />
      <JoinGroupModal 
        open={showJoinGroup} 
        onOpenChange={setShowJoinGroup} 
      />
      {selectedGroup && (
        <GroupDetailsModal 
          group={selectedGroup}
          open={!!selectedGroup} 
          onOpenChange={() => setSelectedGroup(null)} 
        />
      )}
      {selectedGroupForPayment && (
        <PaymentModal
          group={selectedGroupForPayment}
          open={!!selectedGroupForPayment}
          onOpenChange={(open) => !open && setSelectedGroupForPayment(null)}
        />
      )}
    </div>
  );
};

export default DashboardTab;
