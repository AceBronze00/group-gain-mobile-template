
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Lock, CreditCard, Users, Smartphone } from "lucide-react";
import UserProfileSettings from "@/components/settings/UserProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import PaymentSettings from "@/components/settings/PaymentSettings";
import GroupSettings from "@/components/settings/GroupSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import TrustScoreProfile from "@/components/TrustScoreProfile";
import ProfileHeader from "./ProfileHeader";
import SettingsSection from "./SettingsSection";
import QuickInfoCard from "./QuickInfoCard";

const ProfileTab = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTrustScore, setShowTrustScore] = useState(false);

  // Mock user data
  const user = {
    name: "Alex Johnson",
    trustScore: 85,
    groupsCompleted: 12,
    avatar: "/placeholder.svg",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    bio: "Saving enthusiast and group organizer"
  };

  const activeGroups = [
    {
      id: 1,
      name: "Coffee Fund",
      members: 5,
      totalAmount: 500,
      contributionAmount: 100,
      frequency: "weekly",
      nextPayout: "2024-06-27",
      payoutRecipient: "Sarah M.",
      progress: 80,
      myTurn: false,
      position: 3
    },
    {
      id: 2,
      name: "Vacation Pool",
      members: 8,
      totalAmount: 2400,
      contributionAmount: 300,
      frequency: "monthly",
      nextPayout: "2024-07-15",
      payoutRecipient: "You",
      progress: 60,
      myTurn: true,
      position: 1
    }
  ];

  if (showTrustScore) {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setShowTrustScore(false)}
            className="text-blue-600"
          >
            ← Back to Profile
          </Button>
        </div>
        <TrustScoreProfile />
      </div>
    );
  }

  if (activeSettingsTab) {
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
              <GroupSettings activeGroups={activeGroups} />
            </TabsContent>
            <TabsContent value="general">
              <GeneralSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <ProfileHeader 
        user={user} 
        activeGroups={activeGroups} 
        onTrustScoreClick={() => setShowTrustScore(true)} 
      />
      
      <SettingsSection 
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        onSettingClick={setActiveSettingsTab}
      />

      <QuickInfoCard user={user} />
    </div>
  );
};

export default ProfileTab;
