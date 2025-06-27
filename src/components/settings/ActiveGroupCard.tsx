
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Crown, AlertTriangle, Settings, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActiveGroup {
  id: number;
  name: string;
  members: number;
  totalAmount: number;
  contributionAmount: number;
  frequency: string;
  nextPayout: string;
  payoutRecipient: string;
  progress: number;
  myTurn: boolean;
  position: number;
}

interface ActiveGroupCardProps {
  group: ActiveGroup;
  onPayment: (group: ActiveGroup) => void;
  onFlagIssue: (groupName: string) => void;
}

const ActiveGroupCard = ({ group, onPayment, onFlagIssue }: ActiveGroupCardProps) => {
  const { toast } = useToast();

  const handleManageGroup = () => {
    toast({
      title: "Group Management",
      description: `Opening management options for "${group.name}"`,
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h4 className="font-semibold">{group.name}</h4>
          {group.position === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
        </div>
        <div className="flex items-center space-x-2">
          {group.myTurn && <Badge className="bg-green-500">Your Turn</Badge>}
          <Badge variant="outline">{group.members} members</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-600">Your Contribution</p>
          <p className="font-medium">${group.contributionAmount} {group.frequency}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Next Payout</p>
          <p className="font-medium">{group.nextPayout}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{group.progress}%</span>
        </div>
        <Progress value={group.progress} className="h-2" />
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Recipient: <span className="font-medium">{group.payoutRecipient}</span>
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPayment(group)}
            className="flex items-center space-x-1 bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <DollarSign className="h-3 w-3" />
            <span>Pay</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFlagIssue(group.name)}
            className="flex items-center space-x-1"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Flag Issue</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManageGroup}
            className="flex items-center space-x-1"
          >
            <Settings className="h-3 w-3" />
            <span>Manage</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveGroupCard;
