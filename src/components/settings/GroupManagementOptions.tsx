
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GroupManagementOptions = () => {
  const { toast } = useToast();
  const [organizedGroups] = useState(2);
  const [pendingInvites] = useState(1);

  const handleViewOrganized = () => {
    toast({
      title: "Groups I Organize",
      description: `Viewing ${organizedGroups} groups you created and manage`,
    });
  };

  const handleViewInvitations = () => {
    toast({
      title: "Pending Invitations",
      description: `You have ${pendingInvites} pending invitation(s) to review`,
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Group Management</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="font-medium">Groups I Organize</p>
            <p className="text-sm text-gray-600">Manage groups you created</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center space-x-1"
            onClick={handleViewOrganized}
          >
            <ExternalLink className="h-4 w-4" />
            <span>View ({organizedGroups})</span>
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Group Invitations</p>
            <p className="text-sm text-gray-600">Pending invites from others</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center space-x-1"
            onClick={handleViewInvitations}
          >
            <ExternalLink className="h-4 w-4" />
            <span>View ({pendingInvites})</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GroupManagementOptions;
