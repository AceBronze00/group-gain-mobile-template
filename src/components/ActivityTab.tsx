
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TrustScoreProfile from "@/components/TrustScoreProfile";
import NotificationsSection from "./activity/NotificationsSection";
import HistorySection from "./activity/HistorySection";

const ActivityTab = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'history'>('notifications');
  const [selectedUserForRating, setSelectedUserForRating] = useState<any>(null);
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

  // Mock history data with member rating functionality
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
      completedDate: "2024-05-15",
      membersToRate: [
        { id: 1, name: "Sarah M.", avatar: "/placeholder.svg", hasRated: false },
        { id: 2, name: "Mike J.", avatar: "/placeholder.svg", hasRated: true },
        { id: 3, name: "Emma D.", avatar: "/placeholder.svg", hasRated: false },
        { id: 4, name: "James W.", avatar: "/placeholder.svg", hasRated: true },
        { id: 5, name: "Lisa K.", avatar: "/placeholder.svg", hasRated: false },
        { id: 6, name: "Tom B.", avatar: "/placeholder.svg", hasRated: false },
        { id: 7, name: "Anna C.", avatar: "/placeholder.svg", hasRated: false }
      ]
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
      completedDate: "2024-04-20",
      membersToRate: [
        { id: 8, name: "David R.", avatar: "/placeholder.svg", hasRated: false },
        { id: 9, name: "Sophie L.", avatar: "/placeholder.svg", hasRated: true },
        { id: 10, name: "Chris P.", avatar: "/placeholder.svg", hasRated: false },
        { id: 11, name: "Maya S.", avatar: "/placeholder.svg", hasRated: false },
        { id: 12, name: "Alex T.", avatar: "/placeholder.svg", hasRated: true }
      ]
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

  // Recent transactions data
  const transactionHistory = [
    {
      id: 1,
      type: "cashout",
      amount: 500,
      description: "Vacation Pool Cashout",
      date: "2024-06-20",
      status: "completed"
    },
    {
      id: 2,
      type: "deposit",
      amount: 1250.75,
      description: "Emergency Fund Payout",
      date: "2024-06-18",
      status: "completed"
    },
    {
      id: 3,
      type: "transfer",
      amount: 300,
      description: "Transfer to Bank",
      date: "2024-06-15",
      status: "pending"
    }
  ];

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

  const handleRateMember = (member: any, groupName: string) => {
    setSelectedUserForRating({
      ...member,
      groupName: groupName
    });
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  if (selectedUserForRating) {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedUserForRating(null)}
            className="text-blue-600"
          >
            ← Back to Activity
          </Button>
        </div>
        <TrustScoreProfile 
          user={{
            name: selectedUserForRating.name,
            trustScore: 76,
            groupsCompleted: 8,
            onTimePayments: 100,
            organizerRoles: 2,
            peerRating: 4.3,
            totalRaters: 6,
            totalGroups: 5,
            latePayments: 0,
            disputes: 0
          }}
        />
      </div>
    );
  }

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
        <NotificationsSection
          notifications={notifications}
          onAcceptInvite={handleAcceptInvite}
          onDeclineInvite={handleDeclineInvite}
        />
      ) : (
        <HistorySection
          transactionHistory={transactionHistory}
          poolHistory={history}
          onRateMember={handleRateMember}
        />
      )}
    </div>
  );
};

export default ActivityTab;
