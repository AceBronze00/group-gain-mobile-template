
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Settings, AlertTriangle, Crown, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GroupSettingsProps {
  activeGroups: Array<{
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
  }>;
}

const GroupSettings = ({ activeGroups }: GroupSettingsProps) => {
  const { toast } = useToast();

  const handleLeaveGroup = (groupName: string) => {
    toast({
      title: "Leave Group Request",
      description: `Your request to leave "${groupName}" has been submitted.`,
    });
  };

  const handleFlagIssue = (groupName: string) => {
    toast({
      title: "Issue Flagged",
      description: `Issue reported for "${groupName}". Our team will review it.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* My Active Groups */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          My Active Groups ({activeGroups.length})
        </h3>
        <div className="space-y-4">
          {activeGroups.map((group) => (
            <div key={group.id} className="p-4 border rounded-lg">
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
                    onClick={() => handleFlagIssue(group.name)}
                    className="flex items-center space-x-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    <span>Flag Issue</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Settings className="h-3 w-3" />
                    <span>Manage</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Group Management Options */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Group Management</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium">Groups I Organize</p>
              <p className="text-sm text-gray-600">Manage groups you created</p>
            </div>
            <Button variant="outline" className="flex items-center space-x-1">
              <ExternalLink className="h-4 w-4" />
              <span>View (2)</span>
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Group Invitations</p>
              <p className="text-sm text-gray-600">Pending invites from others</p>
            </div>
            <Button variant="outline" className="flex items-center space-x-1">
              <ExternalLink className="h-4 w-4" />
              <span>View (1)</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Group Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Group Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-Join Recommended Groups</p>
              <p className="text-sm text-gray-600">Based on your interests and trust score</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Group Discovery</p>
              <p className="text-sm text-gray-600">Allow others to find and invite you</p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Default Group Settings</p>
              <p className="text-sm text-gray-600">Set your preferred group rules</p>
            </div>
            <Button variant="outline">Edit</Button>
          </div>
        </div>
      </Card>

      {/* Group Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">My Group Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Completed Groups</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">98%</div>
            <div className="text-sm text-gray-600">On-Time Payments</div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-red-800">Leave All Groups</p>
              <p className="text-sm text-red-600">This will remove you from all active groups</p>
            </div>
            <Button variant="destructive">Leave All</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GroupSettings;
