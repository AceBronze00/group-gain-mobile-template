
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import NotificationItem from "./NotificationItem";

interface NotificationsSectionProps {
  notifications: Array<{
    id: number;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    unread: boolean;
    data: any;
  }>;
  onAcceptInvite: (id: number) => void;
  onDeclineInvite: (id: number) => void;
}

const NotificationsSection = ({ notifications, onAcceptInvite, onDeclineInvite }: NotificationsSectionProps) => {
  if (notifications.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications</h3>
        <p className="text-gray-500">You're all caught up!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onAcceptInvite={onAcceptInvite}
          onDeclineInvite={onDeclineInvite}
        />
      ))}
    </div>
  );
};

export default NotificationsSection;
