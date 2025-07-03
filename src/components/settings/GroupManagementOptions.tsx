
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GroupManagementOptions = () => {
  const { toast } = useToast();
  const { groups, currentUserId } = useApp();
  const [showOrganizedGroups, setShowOrganizedGroups] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);

  // Filter groups where current user is admin
  const organizedGroups = groups.filter(group => group.isAdmin && group.adminId === currentUserId);
  const pendingInvites = 1; // Mock pending invites

  const handleViewOrganized = () => {
    setShowOrganizedGroups(true);
  };

  const handleViewInvitations = () => {
    setShowInvitations(true);
    toast({
      title: "Pending Invitations",
      description: `You have ${pendingInvites} pending invitation(s) to review`,
    });
  };

  return (
    <>
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
              <Users className="h-4 w-4" />
              <span>View ({organizedGroups.length})</span>
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
              <UserPlus className="h-4 w-4" />
              <span>View ({pendingInvites})</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Groups I Organize Modal */}
      <Dialog open={showOrganizedGroups} onOpenChange={setShowOrganizedGroups}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Groups I Organize ({organizedGroups.length})</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {organizedGroups.length > 0 ? (
              organizedGroups.map((group) => (
                <div key={group.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{group.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      group.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {group.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Members:</strong> {group.members}</p>
                      <p><strong>Contribution:</strong> ${group.contributionAmount}</p>
                    </div>
                    <div>
                      <p><strong>Frequency:</strong> {group.frequency}</p>
                      <p><strong>Progress:</strong> {group.progress}%</p>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline">
                      Manage Members
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>You're not organizing any groups yet.</p>
                <p className="text-sm">Create a group to start organizing!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Pending Invitations Modal */}
      <Dialog open={showInvitations} onOpenChange={setShowInvitations}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Pending Invitations ({pendingInvites})</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">Holiday Shopping Fund</h4>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Invited by <strong>Jessica M.</strong> • $200/week • 8 members
              </p>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Accept
                </Button>
                <Button size="sm" variant="outline">
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupManagementOptions;
