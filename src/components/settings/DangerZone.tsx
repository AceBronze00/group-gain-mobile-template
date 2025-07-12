
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

const DangerZone = () => {
  const { toast } = useToast();
  const { groups } = useApp();

  const handleLeaveAllGroups = () => {
    if (groups.length === 0) {
      toast({
        title: "No Active Nests",
        description: "You are not currently in any nests to leave",
        variant: "destructive",
      });
      return;
    }

    const confirmLeave = window.confirm(
      `Are you sure you want to leave all ${groups.length} active nests? This action cannot be undone.`
    );

    if (confirmLeave) {
      toast({
        title: "Left All Nests",
        description: `You have been removed from ${groups.length} nest(s)`,
        variant: "destructive",
      });
      // In a real app, this would call a function to leave all groups
      // leaveAllGroups();
    }
  };

  return (
    <Card className="p-6 border-red-200">
      <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div>
            <p className="font-medium text-red-800">Leave All Nests</p>
            <p className="text-sm text-red-600">This will remove you from all active nests</p>
          </div>
          <Button variant="destructive" onClick={handleLeaveAllGroups}>
            Leave All
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DangerZone;
