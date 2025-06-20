
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Shield } from "lucide-react";

const ProfileTab = () => {
  // Mock user data
  const user = {
    name: "Alex Johnson",
    trustScore: 85,
    groupsCompleted: 12,
    avatar: "/placeholder.svg"
  };

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

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 pb-20">
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

      {/* Additional Profile Information */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Account Settings</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Notifications</span>
            <span className="text-blue-600">Enabled</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Privacy</span>
            <span className="text-blue-600">Public</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Two-Factor Auth</span>
            <span className="text-green-600">Active</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileTab;
