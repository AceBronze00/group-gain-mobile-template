import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Shield, Settings, User, Bell, Lock, CreditCard, Users, Smartphone, ChevronDown } from "lucide-react";
import UserProfileSettings from "@/components/settings/UserProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import PaymentSettings from "@/components/settings/PaymentSettings";
import GroupSettings from "@/components/settings/GroupSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";

const ProfileTab = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

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
      {/* User Profile Card */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16 ring-4 ring-blue-100">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-600 mb-1">{user.bio}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className={`font-semibold ${getTrustScoreColor(user.trustScore)}`}>
                Trust Score: {user.trustScore}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{user.groupsCompleted}</div>
            <div className="text-sm text-gray-600">Groups Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activeGroups.length}</div>
            <div className="text-sm text-gray-600">Active Groups</div>
          </div>
        </div>
      </Card>

      {/* Settings Categories - Now Collapsible */}
      <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-lg font-bold text-gray-800">Settings</span>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-3 mt-4">
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="h-16 justify-start p-4 text-left"
              onClick={() => setActiveSettingsTab('profile')}
            >
              <User className="h-6 w-6 mr-4 text-blue-500" />
              <div>
                <div className="font-semibold">User Profile</div>
                <div className="text-sm text-gray-500">Name, picture, contact info</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-16 justify-start p-4 text-left"
              onClick={() => setActiveSettingsTab('notifications')}
            >
              <Bell className="h-6 w-6 mr-4 text-orange-500" />
              <div>
                <div className="font-semibold">Notifications</div>
                <div className="text-sm text-gray-500">Payment reminders, alerts</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-16 justify-start p-4 text-left"
              onClick={() => setActiveSettingsTab('security')}
            >
              <Lock className="h-6 w-6 mr-4 text-red-500" />
              <div>
                <div className="font-semibold">Security & Privacy</div>
                <div className="text-sm text-gray-500">2FA, privacy, KYC</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-16 justify-start p-4 text-left"
              onClick={() => setActiveSettingsTab('payments')}
            >
              <CreditCard className="h-6 w-6 mr-4 text-green-500" />
              <div>
                <div className="font-semibold">Payment & Payout</div>
                <div className="text-sm text-gray-500">Bank accounts, auto-debit</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-16 justify-start p-4 text-left"
              onClick={() => setActiveSettingsTab('groups')}
            >
              <Users className="h-6 w-6 mr-4 text-purple-500" />
              <div>
                <div className="font-semibold">Group Settings</div>
                <div className="text-sm text-gray-500">Manage your groups</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-16 justify-start p-4 text-left"
              onClick={() => setActiveSettingsTab('general')}
            >
              <Smartphone className="h-6 w-6 mr-4 text-indigo-500" />
              <div>
                <div className="font-semibold">General Settings</div>
                <div className="text-sm text-gray-500">Language, timezone, theme</div>
              </div>
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Quick Stats */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Info</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Email</span>
            <span className="text-blue-600 text-sm">{user.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Phone</span>
            <span className="text-blue-600 text-sm">{user.phone}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Verification Status</span>
            <Badge className="bg-green-500">Verified</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileTab;
