
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, DollarSign, Calendar, Check, X, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationsTab = () => {
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Notifications List */}
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
    </div>
  );
};

export default NotificationsTab;
