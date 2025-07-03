
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Shield, CheckCircle } from "lucide-react";

interface GroupMember {
  id: number;
  name: string;
  avatar: string;
  trustScore: number;
  position: number;
  hasReceived: boolean;
  joinedDate: string;
}

interface GroupMembersTabProps {
  group: any;
}

const GroupMembersTab = ({ group }: GroupMembersTabProps) => {
  // Mock members data - in real app this would come from props or API
  const members: GroupMember[] = [
    {
      id: 1,
      name: "You",
      avatar: "/placeholder.svg",
      trustScore: 85,
      position: group.position,
      hasReceived: false,
      joinedDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah M.",
      avatar: "/placeholder.svg",
      trustScore: 92,
      position: 1,
      hasReceived: true,
      joinedDate: "2024-01-10"
    },
    {
      id: 3,
      name: "Mike J.",
      avatar: "/placeholder.svg",
      trustScore: 78,
      position: 2,
      hasReceived: true,
      joinedDate: "2024-01-12"
    },
    {
      id: 4,
      name: "Emma D.",
      avatar: "/placeholder.svg",
      trustScore: 88,
      position: 4,
      hasReceived: false,
      joinedDate: "2024-01-18"
    },
    {
      id: 5,
      name: "James W.",
      avatar: "/placeholder.svg",
      trustScore: 71,
      position: 5,
      hasReceived: false,
      joinedDate: "2024-01-20"
    }
  ];

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-3">
      {members
        .sort((a, b) => a.position - b.position)
        .map((member) => (
          <Card key={member.id} className="p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-blue-500 text-white font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {member.hasReceived && (
                  <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-green-500 bg-white rounded-full" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{member.name}</h4>
                  <Badge variant="outline" className="text-sm font-medium">
                    Position #{member.position}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className={`text-sm font-medium ${getTrustScoreColor(member.trustScore)}`}>
                      Trust: {member.trustScore}
                    </span>
                  </div>
                  {member.hasReceived && (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                      Received
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default GroupMembersTab;
