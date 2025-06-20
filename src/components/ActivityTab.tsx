
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, DollarSign, Calendar, Check, X, Bell, History, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ActivityTab = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'history'>('notifications');
  const { toast } = useToast();

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "group_invite",
      title: "Group Invitation",
      message: "Sarah Mitchell invited you to join 'Weekend Getaway Fund'",
      timestamp: "2 minutes ago",
      unread: true,
      data: {
        groupName: "Weekend Getaway Fund",
        inviterName: "Sarah Mitchell",
        inviterAvatar: "/placeholder.svg",
        contributionAmount: 200,
        frequency: "monthly"
      }
    },
    {
      id: 2,
      type: "payment_due",
      title: "Payment Due Soon",
      message: "Your contribution for 'Emergency Fund Circle' is due in 2 days",
      timestamp: "1 hour ago",
      unread: true,
      data: {
        groupName: "Emergency Fund Circle",
        amount: 150,
        dueDate: "2024-06-25"
      }
    },
    {
      id: 3,
      type: "payment_made",
      title: "Payment Received",
      message: "Mike Johnson made a payment in 'Weekend Getaway Fund'",
      timestamp: "3 hours ago",
      unread: false,
      data: {
        groupName: "Weekend Getaway Fund",
        payerName: "Mike Johnson",
        payerAvatar: "/placeholder.svg",
        amount: 200
      }
    },
    {
      id: 4,
      type: "payout_scheduled",
      title: "Payout Coming Up",
      message: "You'll receive your payout from 'Holiday Savings' tomorrow",
      timestamp: "1 day ago",
      unread: false,
      data: {
        groupName: "Holiday Savings",
        amount: 1600,
        payoutDate: "2024-06-21"
      }
    }
  ];

  // Mock history data
  const history = [
    {
      id: 1,
      groupName: "Holiday Savings Pool",
      status: "completed",
      totalAmount: 2400,
      myContribution: 300,
      payout: 2400,
      participants: 8,
      duration: "6 months",
      completedDate: "2024-05-15"
    },
    {
      id: 2,
      groupName: "Emergency Fund Circle",
      status: "completed",
      totalAmount: 1200,
      myContribution: 200,
      payout: 1200,
      participants: 6,
      duration: "4 months",
      completedDate: "2024-04-20"
    },
    {
      id: 3,
      groupName: "Car Purchase Pool",
      status: "failed",
      totalAmount: 5000,
      myContribution: 500,
      payout: 0,
      participants: 10,
      duration: "8 months",
      failedDate: "2024-03-10",
      reason: "Insufficient participation"
    },
    {
      id: 4,
      groupName: "Vacation Fund",
      status: "failed",
      totalAmount: 1800,
      myContribution: 300,
      payout: 300,
      participants: 6,
      duration: "3 months",
      failedDate: "2024-02-28",
      reason: "Group disbanded"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleAcceptInvite = (notificationId: number) => {
    toast({
      title: "Invitation Accepted!",
      description: "You've successfully joined the group",
    });
    console.log('Accepting invite for notification:', notificationId);
  };

  const handleDeclineInvite = (notificationId: number) => {
    toast({
      title: "Invitation Declined",
      description: "The invitation has been declined",
    });
    console.log('Declining invite for notification:', notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "group_invite":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "payment_due":
        return <Calendar className="h-5 w-5 text-orange-500" />;
      case "payment_made":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "payout_scheduled":
        return <DollarSign className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="pb-20">
      {/* Header with Tab Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Activity</h2>
          {activeTab === 'notifications' && unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'notifications' ? 'default' : 'outline'}
          onClick={() => setActiveTab('notifications')}
          className="flex-1"
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-red-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          className="flex-1"
        >
          <History className="h-4 w-4 mr-2" />
          History
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'notifications' ? (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 ${notification.unread ? 'border-blue-200 bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.timestamp}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                    
                    {/* Group Invitation Actions */}
                    {notification.type === "group_invite" && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={notification.data.inviterAvatar} alt={notification.data.inviterName} />
                            <AvatarFallback className="bg-blue-500 text-white text-xs">
                              {notification.data.inviterName.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">
                            {formatCurrency(notification.data.contributionAmount)} {notification.data.frequency}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptInvite(notification.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeclineInvite(notification.id)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Payment Due Info */}
                    {notification.type === "payment_due" && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Amount Due:</span>
                          <span className="text-sm font-bold text-orange-600">
                            {formatCurrency(notification.data.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-600">Due Date:</span>
                          <span className="text-xs text-gray-600">
                            {new Date(notification.data.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Payment Made Info */}
                    {notification.type === "payment_made" && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={notification.data.payerAvatar} alt={notification.data.payerName} />
                          <AvatarFallback className="bg-green-500 text-white text-xs">
                            {notification.data.payerName.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(notification.data.amount)}
                        </span>
                      </div>
                    )}
                    
                    {/* Payout Info */}
                    {notification.type === "payout_scheduled" && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Payout Amount:</span>
                          <span className="text-sm font-bold text-purple-600">
                            {formatCurrency(notification.data.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-600">Payout Date:</span>
                          <span className="text-xs text-gray-600">
                            {new Date(notification.data.payoutDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {history.length === 0 ? (
            <Card className="p-8 text-center">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No history</h3>
              <p className="text-gray-500">Your completed pools will appear here</p>
            </Card>
          ) : (
            history.map((pool) => (
              <Card key={pool.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {pool.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{pool.groupName}</h4>
                      <Badge 
                        className={`${
                          pool.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {pool.status === 'completed' ? 'Completed' : 'Failed'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">My Contribution:</span>
                        <div className="font-medium">{formatCurrency(pool.myContribution)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          {pool.status === 'completed' ? 'Payout:' : 'Refund:'}
                        </span>
                        <div className={`font-medium ${
                          pool.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {formatCurrency(pool.payout)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Pool:</span>
                        <div className="font-medium">{formatCurrency(pool.totalAmount)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Participants:</span>
                        <div className="font-medium">{pool.participants} members</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Duration: {pool.duration}</span>
                        <span>
                          {pool.status === 'completed' ? 'Completed' : 'Failed'}: {' '}
                          {new Date(pool.status === 'completed' ? pool.completedDate : pool.failedDate!).toLocaleDateString()}
                        </span>
                      </div>
                      {pool.status === 'failed' && pool.reason && (
                        <div className="mt-1 text-xs text-red-600">
                          Reason: {pool.reason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityTab;
