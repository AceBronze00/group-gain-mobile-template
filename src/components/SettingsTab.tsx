
import { Card } from "@/components/ui/card";
import { Settings, User, Bell, Shield, CreditCard } from "lucide-react";
import GroupSettings from "@/components/settings/GroupSettings";
import { useApp } from "@/contexts/AppContext";

const SettingsTab = () => {
  const { groups, navigateToSettings } = useApp();
  
  // Filter active nests for the settings
  const activeGroups = groups.filter(group => group.status === 'active');

  const handleQuickSettingClick = (settingTab: string) => {
    navigateToSettings(settingTab);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <Settings className="h-6 w-6 mr-2 text-blue-500" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account and group preferences</p>
      </Card>

      {/* Quick Settings Menu */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => handleQuickSettingClick('profile')}
            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
          >
            <User className="h-5 w-5 text-blue-500" />
            <span className="text-sm">Profile</span>
          </div>
          <div 
            onClick={() => handleQuickSettingClick('notifications')}
            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
          >
            <Bell className="h-5 w-5 text-green-500" />
            <span className="text-sm">Notifications</span>
          </div>
          <div 
            onClick={() => handleQuickSettingClick('security')}
            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
          >
            <Shield className="h-5 w-5 text-purple-500" />
            <span className="text-sm">Security</span>
          </div>
          <div 
            onClick={() => handleQuickSettingClick('payments')}
            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
          >
            <CreditCard className="h-5 w-5 text-orange-500" />
            <span className="text-sm">Payment</span>
          </div>
        </div>
      </Card>

      {/* Group Settings */}
      <GroupSettings activeGroups={activeGroups} />
    </div>
  );
};

export default SettingsTab;
