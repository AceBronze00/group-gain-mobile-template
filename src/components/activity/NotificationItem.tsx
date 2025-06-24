
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, DollarSign, Calendar, Check, X, Bell } from "lucide-react";

interface NotificationItemProps {
  notification: {
    id: number;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    unread: boolean;
    data: any;
  };
  onAcceptInvite: (id: number) => void;
  onDeclineInvite: (id: number) => void;
}

const NotificationItem = ({ notification, onAcceptInvite, onDeclineInvite }: NotificationItemProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  return (
    <Card 
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
                  onClick={() => onAcceptInvite(notification.id)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onDeclineInvite(notification.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Decline
                </Button>
              </div>
            </div>
          )}
          
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
  );
};

export default NotificationItem;
