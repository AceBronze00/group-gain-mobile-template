
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaymentModal from "@/components/PaymentModal";
import ActiveGroupCard from "./ActiveGroupCard";
import GroupManagementOptions from "./GroupManagementOptions";
import GroupPreferences from "./GroupPreferences";
import GroupStatistics from "./GroupStatistics";
import DangerZone from "./DangerZone";

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
  }>;
}

const GroupSettings = ({ activeGroups }: GroupSettingsProps) => {
  const { toast } = useToast();
  const [selectedGroupForPayment, setSelectedGroupForPayment] = useState<any>(null);

  const handleFlagIssue = (groupName: string) => {
    toast({
      title: "Issue Flagged",
      description: `Issue reported for "${groupName}". Our team will review it.`,
    });
  };

  const handlePayment = (group: any) => {
    setSelectedGroupForPayment(group);
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
    </div>
  );
};

export default GroupSettings;
