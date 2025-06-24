
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaymentModal from "@/components/PaymentModal";
import TrustScoreProfile from "@/components/TrustScoreProfile";
import ActiveGroupCard from "./ActiveGroupCard";
import CompletedGroupCard from "./CompletedGroupCard";
import GroupManagementOptions from "./GroupManagementOptions";
import GroupPreferences from "./GroupPreferences";
import GroupStatistics from "./GroupStatistics";
import DangerZone from "./DangerZone";

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
  completedGroups?: CompletedGroup[];
}

const GroupSettings = ({ activeGroups, completedGroups = [] }: GroupSettingsProps) => {
  const { toast } = useToast();
  const [selectedGroupForPayment, setSelectedGroupForPayment] = useState<any>(null);
  const [selectedUserForRating, setSelectedUserForRating] = useState<any>(null);

  console.log("GroupSettings - completedGroups:", completedGroups);
  console.log("GroupSettings - completedGroups length:", completedGroups.length);

  const handleFlagIssue = (groupName: string) => {
    toast({
      title: "Issue Flagged",
      description: `Issue reported for "${groupName}". Our team will review it.`,
    });
  };

  const handlePayment = (group: any) => {
    setSelectedGroupForPayment(group);
  };

  const handleRateMember = (member: Member, groupName: string) => {
    setSelectedUserForRating({
      ...member,
      groupName: groupName
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
            <ActiveGroupCard
              key={group.id}
              group={group}
              onPayment={handlePayment}
              onFlagIssue={handleFlagIssue}
            />
          ))}
        </div>
      </Card>

      {/* Completed Groups - Rate Members */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Completed Groups - Rate Members ({completedGroups.length})
        </h3>
        {completedGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No completed groups yet.</p>
            <p className="text-sm">Complete a group to rate your fellow members!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedGroups.map((group) => (
              <CompletedGroupCard
                key={group.id}
                group={group}
                onRateMember={handleRateMember}
              />
            ))}
          </div>
        )}
      </Card>

      <GroupManagementOptions />
      <GroupPreferences />
      <GroupStatistics />
      <DangerZone />

      {/* Payment Modal */}
      {selectedGroupForPayment && (
        <PaymentModal
          group={selectedGroupForPayment}
          open={!!selectedGroupForPayment}
          onOpenChange={(open) => !open && setSelectedGroupForPayment(null)}
        />
      )}

      {/* Rating Modal */}
      {selectedUserForRating && (
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
      )}
    </div>
  );
};

export default GroupSettings;
