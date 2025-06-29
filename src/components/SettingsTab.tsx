
import { Card } from "@/components/ui/card";
import { Settings, User, Bell, Shield, CreditCard } from "lucide-react";
import GroupSettings from "@/components/settings/GroupSettings";
import { useApp } from "@/contexts/AppContext";

const SettingsTab = () => {
  const { groups } = useApp();
  
  // Filter active groups for the settings
  const activeGroups = groups.filter(group => group.status === 'active');

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <Settings className="h-6 w-6 mr-2 text-blue-500" />
          Settings
        </h1>
        <p className="text-gray-600">Manage your account and group preferences</p>
      </Card>

      {/* Quick Settings Menu */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
            <User className="h-5 w-5 text-blue-500" />
            <span className="text-sm">Profile</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
            <Bell className="h-5 w-5 text-green-500" />
            <span className="text-sm">Notifications</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
            <Shield className="h-5 w-5 text-purple-500" />
            <span className="text-sm">Security</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
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
