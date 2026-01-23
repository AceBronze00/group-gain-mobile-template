
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users, Calendar, Bell, DollarSign, Clock, ChevronRight } from "lucide-react";
import CreateGroupModal from "@/components/CreateGroupModal";
import JoinGroupModal from "@/components/JoinGroupModal";
import GroupDetailsModal from "@/components/GroupDetailsModal";
import PaymentModal from "@/components/PaymentModal";

import { useApp } from "@/contexts/AppContext";

const DashboardTab = () => {
  const { groups: activeNests, walletBalance } = useApp();
  const [showCreateNest, setShowCreateNest] = useState(false);
  const [showJoinNest, setShowJoinNest] = useState(false);
  const [selectedNest, setSelectedNest] = useState(null);
  const [selectedNestForPayment, setSelectedNestForPayment] = useState(null);

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

  // Calculate total monthly contributions across all nests
  const totalContributions = activeNests.reduce((total, nest) => {
    return total + nest.contributionAmount;
  }, 0);

  const getDaysUntilPayout = (date: string) => {
    const today = new Date();
    const payoutDate = new Date(date);
    const diffTime = payoutDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleNestClick = (nest: any) => {
    setSelectedNest(nest);
  };

  const handlePaymentClick = (e: React.MouseEvent, nest: any) => {
    e.stopPropagation();
    setSelectedNestForPayment(nest);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* User Welcome Banner - Compact Left-Aligned */}
      <div className="relative h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden shadow-md">
        <div className="flex items-center h-full px-4">
          <Avatar className="h-10 w-10 ring-2 ring-white/30 shadow-md">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 text-white flex-1">
            <p className="text-xs text-blue-100">{user.greeting},</p>
            <h1 className="text-sm font-bold">{user.name}</h1>
          </div>
          <div className="flex items-center space-x-3 text-white">
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-xs font-medium">{activeNests.length} Nest{activeNests.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-xs font-medium">{formatCurrency(totalContributions)}</span>
            </div>
            <div className="relative">
              <Bell className="h-5 w-5 text-white/80 hover:text-white transition-colors cursor-pointer" />
              {activeNests.some(g => g.myTurn) && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {activeNests.filter(g => g.myTurn).length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => setShowCreateNest(true)}
          className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-2"
        >
          <Plus className="h-6 w-6" />
          <span>Create Nest</span>
        </Button>
        <Button 
          onClick={() => setShowJoinNest(true)}
          variant="outline"
          className="h-20 border-2 border-blue-200 text-blue-600 font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-blue-50 flex flex-col items-center justify-center space-y-2"
        >
          <Users className="h-6 w-6" />
          <span>Join Nest</span>
        </Button>
      </div>

      {/* Active Nests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Your Nests ({activeNests.length})
          </h3>
        </div>
        
        {activeNests.map((nest) => (
          <Card 
            key={nest.id} 
            className="p-5 bg-white/90 backdrop-blur-sm border-0 shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-102 hover:shadow-xl rounded-2xl"
            onClick={() => handleNestClick(nest)}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg text-gray-800 mb-1">{nest.name}</h4>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {nest.members} members
                  </p>
                  {nest.isAdmin && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                      Admin
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1">
                    #{nest.position}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-800">
                  {formatCurrency(nest.totalAmount)}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {nest.myTurn && (
                    <Badge 
                      variant="default"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Your Turn 🎯
                    </Badge>
                  )}
                  <Button
                    onClick={(e) => handlePaymentClick(e, nest)}
                    className={`text-white text-xs px-3 py-1 h-7 ${
                      nest.myTurn 
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
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Progress</span>
                <span className="font-bold text-blue-600">{nest.progress}%</span>
              </div>
              <Progress value={nest.progress} className="h-3 bg-gray-100" />
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="font-medium">Payment Due: {new Date(nest.nextPayout).toLocaleDateString()}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1 text-green-500" />
                  <span>My payout: {new Date(nest.myPayoutDate).toLocaleDateString()}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {nest.myTurn ? "Today!" : `${getDaysUntilPayout(nest.myPayoutDate)} days`}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {activeNests.length === 0 && (
        <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="max-w-sm mx-auto">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Start Your First Savings Nest!</h3>
            <p className="text-gray-600 mb-6">
              Create a nest to save with friends, or join an existing nest using an invite code.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => setShowCreateNest(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold"
              >
                Create Your First Nest
              </Button>
              <Button 
                onClick={() => setShowJoinNest(true)}
                variant="outline"
                className="w-full border-2 border-gray-200 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold"
              >
                Join Existing Nest
              </Button>
            </div>
          </div>
        </Card>
      )}


      {/* Modals */}
      <CreateGroupModal 
        open={showCreateNest} 
        onOpenChange={setShowCreateNest} 
      />
      <JoinGroupModal 
        open={showJoinNest} 
        onOpenChange={setShowJoinNest} 
      />
      {selectedNest && (
        <GroupDetailsModal 
          group={selectedNest}
          open={!!selectedNest} 
          onOpenChange={() => setSelectedNest(null)} 
        />
      )}
      {selectedNestForPayment && (
        <PaymentModal
          group={selectedNestForPayment}
          open={!!selectedNestForPayment}
          onOpenChange={(open) => !open && setSelectedNestForPayment(null)}
        />
      )}
    </div>
  );
};

export default DashboardTab;
