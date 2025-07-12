
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const GroupPreferences = () => {
  const { toast } = useToast();
  const [autoJoinEnabled, setAutoJoinEnabled] = useState(false);
  const [discoveryEnabled, setDiscoveryEnabled] = useState(true);

  const handleAutoJoin = () => {
    setAutoJoinEnabled(!autoJoinEnabled);
    toast({
      title: autoJoinEnabled ? "Auto-Join Disabled" : "Auto-Join Enabled",
      description: autoJoinEnabled 
        ? "You will no longer automatically join recommended groups"
        : "You will now automatically join recommended groups based on your preferences",
    });
  };

  const handleDiscovery = () => {
    setDiscoveryEnabled(!discoveryEnabled);
    toast({
      title: discoveryEnabled ? "Discovery Disabled" : "Discovery Enabled",
      description: discoveryEnabled
        ? "Others can no longer find and invite you to groups"
        : "Others can now find and invite you to groups",
    });
  };

  const handleDefaultSettings = () => {
    toast({
      title: "Default Settings",
      description: "Opening default group settings editor...",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Nest Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Auto-Join Recommended Groups</p>
            <p className="text-sm text-gray-600">Based on your interests and trust score</p>
          </div>
          <Button 
            variant={autoJoinEnabled ? "default" : "outline"}
            onClick={handleAutoJoin}
          >
            {autoJoinEnabled ? "Enabled" : "Configure"}
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Group Discovery</p>
            <p className="text-sm text-gray-600">Allow others to find and invite you</p>
          </div>
          <Button 
            variant={discoveryEnabled ? "default" : "outline"}
            onClick={handleDiscovery}
          >
            {discoveryEnabled ? "Enabled" : "Manage"}
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Default Nest Settings</p>
            <p className="text-sm text-gray-600">Set your preferred group rules</p>
          </div>
          <Button variant="outline" onClick={handleDefaultSettings}>
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GroupPreferences;
