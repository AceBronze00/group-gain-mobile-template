
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Lock, CreditCard } from "lucide-react";
import UserProfileSettings from "@/components/settings/UserProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import PaymentSettings from "@/components/settings/PaymentSettings";

interface UserData {
  name: string;
  trustScore: number;
  groupsCompleted: number;
  avatar: string;
  email: string;
  phone: string;
  bio: string;
}

interface ProfileSettingsProps {
  activeSettingsTab: string;
  setActiveSettingsTab: (tab: string | null) => void;
  user: UserData;
}

const ProfileSettings = ({ 
  activeSettingsTab, 
  setActiveSettingsTab, 
  user, 
}: ProfileSettingsProps) => {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setActiveSettingsTab(null)}
          className="text-primary"
        >
          ← Back to Profile
        </Button>
      </div>

      <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="text-xs">
            <User className="h-4 w-4 mr-1" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">
            <Bell className="h-4 w-4 mr-1" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs">
            <Lock className="h-4 w-4 mr-1" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs">
            <CreditCard className="h-4 w-4 mr-1" />
            Payments
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile">
            <UserProfileSettings user={user} />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
          <TabsContent value="payments">
            <PaymentSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
