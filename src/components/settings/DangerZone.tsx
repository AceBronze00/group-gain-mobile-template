
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DangerZone = () => {
  return (
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
  );
};

export default DangerZone;
