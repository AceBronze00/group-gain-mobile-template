
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, Star } from "lucide-react";

interface Member {
  id: number;
  name: string;
  avatar: string;
  hasRated: boolean;
}

interface CompletedGroup {
  id: number;
  name: string;
  members: number;
  totalAmount: number;
  contributionAmount: number;
  frequency: string;
  completedDate: string;
  yourPosition: number;
  status: string;
  membersToRate: Member[];
}

interface CompletedGroupCardProps {
  group: CompletedGroup;
  onRateMember: (member: Member, groupName: string) => void;
}

const CompletedGroupCard = ({ group, onRateMember }: CompletedGroupCardProps) => {
  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-green-800">{group.name}</h4>
          <p className="text-sm text-green-600">
            Completed on {new Date(group.completedDate).toLocaleDateString()}
          </p>
        </div>
        <Badge className="bg-green-500">Completed</Badge>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Rate your fellow group members to help build trust in the community:
        </p>
        <div className="grid grid-cols-1 gap-2">
          {group.membersToRate.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{member.name}</span>
              </div>
              <div>
                {member.hasRated ? (
                  <Badge variant="outline" className="text-green-600 bg-green-50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Rated
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => onRateMember(member, group.name)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Rate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedGroupCard;
