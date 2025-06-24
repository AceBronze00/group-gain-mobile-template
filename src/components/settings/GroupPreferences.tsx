
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GroupPreferences = () => {
  return (
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
  );
};

export default GroupPreferences;
