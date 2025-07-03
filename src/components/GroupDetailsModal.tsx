
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupSummaryCard from "./GroupSummaryCard";
import GroupMembersTab from "./GroupMembersTab";
import GroupHistoryTab from "./GroupHistoryTab";

interface GroupDetailsModalProps {
  group: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GroupDetailsModal = ({ group, open, onOpenChange }: GroupDetailsModalProps) => {
  const handlePayment = () => {
    // Handle payment logic
    console.log("Payment initiated for group:", group.name);
  };

  const handleExpandDetails = () => {
    // Handle expanding details logic
    console.log("Expanding details for group:", group.name);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl mx-auto max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold text-center">
            Group Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Summary Card */}
          <div className="mb-6">
            <GroupSummaryCard
              group={group}
              onPayment={handlePayment}
              onExpandDetails={handleExpandDetails}
            />
          </div>

          {/* Tabs for additional details */}
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <div className="mt-4 overflow-y-auto max-h-96">
              <TabsContent value="members">
                <GroupMembersTab group={group} />
              </TabsContent>

              <TabsContent value="history">
                <GroupHistoryTab group={group} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetailsModal;
