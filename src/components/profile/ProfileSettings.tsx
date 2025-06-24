
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Lock, CreditCard, Users, Smartphone } from "lucide-react";
import UserProfileSettings from "@/components/settings/UserProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import PaymentSettings from "@/components/settings/PaymentSettings";
import GroupSettings from "@/components/settings/GroupSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";

interface User {
  name: string;
  trustScore: number;
  groupsCompleted: number;
  avatar: string;
  email: string;
  phone: string;
  bio: string;
}

interface ActiveGroup {
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
  status: string;
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
  membersToRate: Array<{
    id: number;
    name: string;
    avatar: string;
    hasRated: boolean;
  }>;
}

interface ProfileSettingsProps {
  activeSettingsTab: string;
  setActiveSettingsTab: (tab: string | null) => void;
  user: User;
  activeGroups: ActiveGroup[];
  completedGroups: CompletedGroup[];
}

const ProfileSettings = ({ 
  activeSettingsTab, 
  setActiveSettingsTab, 
  user, 
  activeGroups, 
  completedGroups 
}: ProfileSettingsProps) => {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setActiveSettingsTab(null)}
          className="text-blue-600"
        >
          ← Back to Profile
        </Button>
      </div>

      <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
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
          <TabsTrigger value="groups" className="text-xs">
            <Users className="h-4 w-4 mr-1" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="general" className="text-xs">
            <Smartphone className="h-4 w-4 mr-1" />
            General
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
          <TabsContent value="groups">
            <GroupSettings activeGroups={activeGroups} completedGroups={completedGroups} />
          </TabsContent>
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProfileSettings;
