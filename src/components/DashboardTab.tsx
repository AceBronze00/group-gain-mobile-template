
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
      {/* User Welcome Banner */}
      <div className="relative h-16 bg-primary rounded-xl overflow-hidden shadow-md">
        <div className="flex items-center h-full px-4">
          <Avatar className="h-10 w-10 ring-2 ring-primary-foreground/30 shadow-md">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs font-bold backdrop-blur-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 text-primary-foreground flex-1">
            <p className="text-xs opacity-80">{user.greeting},</p>
            <h1 className="text-sm font-bold">{user.name}</h1>
          </div>
          <div className="flex items-center space-x-3 text-primary-foreground">
            <div className="bg-primary-foreground/20 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-xs font-medium">{activeNests.length} Nest{activeNests.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="bg-primary-foreground/20 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-xs font-medium">{formatCurrency(totalContributions)}</span>
            </div>
            <div className="relative">
              <Bell className="h-5 w-5 opacity-80 hover:opacity-100 transition-colors cursor-pointer" />
              {activeNests.some(g => g.myTurn) && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center">
                  <span className="text-xs text-destructive-foreground font-bold">
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
          className="h-20 bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-[hsl(var(--success-foreground))] font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 flex flex-col items-center justify-center space-y-2"
        >
          <Plus className="h-6 w-6" />
          <span>Create Nest</span>
        </Button>
        <Button 
          onClick={() => setShowJoinNest(true)}
          variant="outline"
          className="h-20 border-2 border-primary/40 text-primary font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-primary/10 flex flex-col items-center justify-center space-y-2"
        >
          <Users className="h-6 w-6" />
          <span>Join Nest</span>
        </Button>
      </div>

      {/* Active Nests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            Your Nests ({activeNests.length})
          </h3>
        </div>
        
        {activeNests.map((nest) => (
          <Card 
            key={nest.id} 
            className="p-5 border-border shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl rounded-2xl"
            onClick={() => handleNestClick(nest)}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg text-card-foreground mb-1">{nest.name}</h4>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {nest.members} members
                  </p>
                  {nest.isAdmin && (
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                      Admin
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs rounded-full px-3 py-1">
                    #{nest.position}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-card-foreground">
                  {formatCurrency(nest.totalAmount)}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {nest.myTurn && (
                    <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]/90">
                      Your Turn 🎯
                    </Badge>
                  )}
                  <Button
                    onClick={(e) => handlePaymentClick(e, nest)}
                    size="sm"
                    className="text-xs px-3 py-1 h-7"
                  >
                    <DollarSign className="h-3 w-3 mr-1" />
                    Pay Now
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Progress</span>
                <span className="font-bold text-primary">{nest.progress}%</span>
              </div>
              <Progress value={nest.progress} className="h-3 bg-muted" />
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">Payment Due: {new Date(nest.nextPayout).toLocaleDateString()}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1 text-[hsl(var(--success))]" />
                  <span>My payout: {new Date(nest.myPayoutDate).toLocaleDateString()}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {nest.myTurn ? "Today!" : `${getDaysUntilPayout(nest.myPayoutDate)} days`}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {activeNests.length === 0 && (
        <Card className="p-8 text-center shadow-lg rounded-2xl">
          <div className="max-w-sm mx-auto">
            <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-2">Start Your First Savings Nest!</h3>
            <p className="text-muted-foreground mb-6">
              Create a nest to save with friends, or join an existing nest using an invite code.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => setShowCreateNest(true)}
                className="w-full px-8 py-3 rounded-xl font-semibold"
              >
                Create Your First Nest
              </Button>
              <Button 
                onClick={() => setShowJoinNest(true)}
                variant="outline"
                className="w-full border-2 px-8 py-3 rounded-xl font-semibold"
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
