
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Shield,
  Settings,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const GroupDetailsModal = ({ group, open, onOpenChange }) => {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock extended group data
  const extendedGroup = {
    ...group,
    members: [
      { id: 1, name: 'You', avatar: 'AJ', trustScore: 85, status: 'paid', position: 3, joinDate: '2024-01-15' },
      { id: 2, name: 'Sarah M.', avatar: 'SM', trustScore: 92, status: 'paid', position: 1, joinDate: '2024-01-10' },
      { id: 3, name: 'Mike R.', avatar: 'MR', trustScore: 88, status: 'pending', position: 2, joinDate: '2024-01-12' },
      { id: 4, name: 'Lisa K.', avatar: 'LK', trustScore: 85, status: 'paid', position: 4, joinDate: '2024-01-18' },
      { id: 5, name: 'Tom H.', avatar: 'TH', trustScore: 90, status: 'pending', position: 5, joinDate: '2024-01-20' }
    ],
    paymentHistory: [
      { date: '2024-06-15', recipient: 'Sarah M.', amount: 500, status: 'completed' },
      { date: '2024-06-08', recipient: 'Mike R.', amount: 500, status: 'completed' },
      { date: '2024-06-01', recipient: 'Lisa K.', amount: 500, status: 'completed' }
    ],
    rules: {
      latePaymentFee: 10,
      maxMissedPayments: 2,
      paymentDeadline: '3 days after due date',
      trustScoreDeduction: 5
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrustScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return "text-green-600 bg-green-100";
      case 'pending': return "text-yellow-600 bg-yellow-100";
      case 'overdue': return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getDaysUntilPayout = (date) => {
    const today = new Date();
    const payoutDate = new Date(date);
    const diffTime = payoutDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            {group.name}
          </DialogTitle>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge variant={group.myTurn ? "default" : "secondary"} className={group.myTurn ? "bg-green-500" : ""}>
              {group.myTurn ? "Your Turn" : `Position ${group.position}`}
            </Badge>
            <Badge variant="outline">
              {group.frequency}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Payout Alert */}
            {group.myTurn && (
              <Card className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">It's Your Turn!</h3>
                    <p className="text-sm text-green-100">
                      You'll receive {formatCurrency(group.totalAmount)} in {getDaysUntilPayout(group.nextPayout)} days
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Group Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-blue-500 mr-1" />
                  <span className="text-2xl font-bold text-gray-800">
                    {formatCurrency(group.totalAmount)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Total Payout</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-green-500 mr-1" />
                  <span className="text-2xl font-bold text-gray-800">
                    {extendedGroup.members.length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Active Members</div>
              </Card>
            </div>

            {/* Progress */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">Group Progress</span>
                <span className="text-sm font-medium">{group.progress}%</span>
              </div>
              <Progress value={group.progress} className="h-3 mb-2" />
              <div className="text-sm text-gray-600">
                Next payout on {new Date(group.nextPayout).toLocaleDateString()}
              </div>
            </Card>

            {/* Payment Schedule */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Payment Schedule
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contribution Amount:</span>
                  <span className="font-medium">{formatCurrency(group.contributionAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium capitalize">{group.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Due Date:</span>
                  <span className="font-medium">{new Date(group.nextPayout).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            {/* Group Rules */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Group Rules
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Late Payment Fee:</span>
                  <span className="font-medium">{formatCurrency(extendedGroup.rules.latePaymentFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Payment Deadline:</span>
                  <span className="font-medium">{extendedGroup.rules.paymentDeadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Max Missed Payments:</span>
                  <span className="font-medium">{extendedGroup.rules.maxMissedPayments}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-4 mt-4">
            <div className="space-y-3">
              {extendedGroup.members.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-800">{member.name}</div>
                        <div className="text-sm text-gray-600">
                          Position #{member.position}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={`text-xs ${getTrustScoreColor(member.trustScore)}`}>
                        <Shield className="h-3 w-3 mr-1" />
                        {member.trustScore}
                      </Badge>
                      <div>
                        <Badge className={`text-xs ${getStatusColor(member.status)}`}>
                          {member.status === 'paid' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Joined: {new Date(member.joinDate).toLocaleDateString()}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Payment History</h3>
              {extendedGroup.paymentHistory.map((payment, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">{payment.recipient}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-800">
                        {formatCurrency(payment.amount)}
                      </div>
                      <Badge className="text-xs bg-green-100 text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
              
              {extendedGroup.paymentHistory.length === 0 && (
                <Card className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Payment History</h3>
                  <p className="text-gray-500">Payments will appear here once the group starts.</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetailsModal;
