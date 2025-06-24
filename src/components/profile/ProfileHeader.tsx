
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Shield } from "lucide-react";

interface User {
  name: string;
  trustScore: number;
  groupsCompleted: number;
  avatar: string;
  bio: string;
}

interface ActiveGroup {
  id: number;
  name: string;
  members: number;
}

interface ProfileHeaderProps {
  user: User;
  activeGroups: ActiveGroup[];
  onTrustScoreClick: () => void;
}

const ProfileHeader = ({ user, activeGroups, onTrustScoreClick }: ProfileHeaderProps) => {
  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
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
          <p className="text-sm text-gray-600 mb-1">{user.bio}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Shield className="h-4 w-4 text-blue-500" />
            <button 
              onClick={onTrustScoreClick}
              className={`font-semibold ${getTrustScoreColor(user.trustScore)} hover:underline cursor-pointer`}
            >
              Trust Score: {user.trustScore}
            </button>
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
  );
};

export default ProfileHeader;
