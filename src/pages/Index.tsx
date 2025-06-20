
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Plus, Users, Calendar, TrendingUp, Shield, ChevronRight } from "lucide-react";
import CreateGroupModal from "@/components/CreateGroupModal";
import JoinGroupModal from "@/components/JoinGroupModal";
import GroupDetailsModal from "@/components/GroupDetailsModal";

const Index = () => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Mock user data
  const user = {
    name: "Alex Johnson",
    trustScore: 85,
    groupsCompleted: 12,
    avatar: "/placeholder.svg"
  };

  // Mock active groups data
  const activeGroups = [
    {
      id: 1,
      name: "Coffee Fund",
      members: 5,
      totalAmount: 500,
      contributionAmount: 100,
      frequency: "weekly",
      nextPayout: "2024-06-27",
      payoutRecipient: "Sarah M.",
      progress: 80,
      myTurn: false,
      position: 3
    },
    {
      id: 2,
      name: "Vacation Pool",
      members: 8,
      totalAmount: 2400,
      contributionAmount: 300,
      frequency: "monthly",
      nextPayout: "2024-07-15",
      payoutRecipient: "You",
      progress: 60,
      myTurn: true,
      position: 1
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrustScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDaysUntilPayout = (date) => {
    const today = new Date();
    const payoutDate = new Date(date);
    const diffTime = payoutDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MoneyPool</h1>
          <p className="text-gray-600">Smart group savings & lending</p>
        </div>

        {/* User Profile Card */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16 ring-4 ring-blue-100">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className={`font-semibold ${getTrustScoreColor(user.trustScore)}`}>
                  Trust Score: {user.trustScore}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{user.groupsCompleted}</div>
              <div className="text-sm text-gray-600">Groups Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeGroups.length}</div>
              <div className="text-sm text-gray-600">Active Groups</div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => setShowCreateGroup(true)}
            className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Group
          </Button>
          <Button 
            onClick={() => setShowJoinGroup(true)}
            variant="outline"
            className="h-16 border-2 border-blue-200 text-blue-600 font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-blue-50"
          >
            <Users className="h-5 w-5 mr-2" />
            Join Group
          </Button>
        </div>

        {/* Next Payout Alert */}
        {activeGroups.some(group => group.myTurn) && (
          <Card className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Your Turn!</h3>
                <p className="text-green-100">Next payout in {getDaysUntilPayout(activeGroups.find(g => g.myTurn)?.nextPayout)} days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-100" />
            </div>
          </Card>
        )}

        {/* Active Groups */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Your Groups
          </h3>
          
          {activeGroups.map((group) => (
            <Card 
              key={group.id} 
              className="p-5 bg-white/80 backdrop-blur-sm border-0 shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-102 hover:shadow-xl"
              onClick={() => setSelectedGroup(group)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{group.name}</h4>
                  <p className="text-sm text-gray-600">{group.members} members</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">
                    {formatCurrency(group.totalAmount)}
                  </div>
                  <Badge 
                    variant={group.myTurn ? "default" : "secondary"}
                    className={group.myTurn ? "bg-green-500" : ""}
                  >
                    {group.myTurn ? "Your Turn" : `Position ${group.position}`}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold">{group.progress}%</span>
                </div>
                <Progress value={group.progress} className="h-2" />
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Next: {new Date(group.nextPayout).toLocaleDateString()}
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {activeGroups.length === 0 && (
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Groups</h3>
            <p className="text-gray-500 mb-4">Create or join a group to start saving together!</p>
            <Button 
              onClick={() => setShowCreateGroup(true)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Get Started
            </Button>
          </Card>
        )}
      </div>

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
    </div>
  );
};

export default Index;
