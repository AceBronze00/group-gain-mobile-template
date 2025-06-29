
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Activity, Search, User, Wallet, Settings } from "lucide-react";
import DashboardTab from "@/components/DashboardTab";
import ActivityTab from "@/components/ActivityTab";
import SearchTab from "@/components/SearchTab";
import ProfileTab from "@/components/ProfileTab";
import WalletTab from "@/components/WalletTab";
import SettingsTab from "@/components/SettingsTab";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { joinGroupByUrl } = useApp();
  const { toast } = useToast();

  useEffect(() => {
    // Check for invite URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    
    if (inviteCode) {
      // Auto-join the group
      joinGroupByUrl(inviteCode);
      
      // Clean up the URL
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Show welcome message
      toast({
        title: "Welcome!",
        description: `Joining group with invite code: ${inviteCode}`,
      });
    }
  }, [joinGroupByUrl, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
          <div className="space-y-6">
            <TabsContent value="dashboard" className="mt-0">
              <DashboardTab />
            </TabsContent>
            
            <TabsContent value="activity" className="mt-0">
              <ActivityTab />
            </TabsContent>
            
            <TabsContent value="search" className="mt-0">
              <SearchTab />
            </TabsContent>
            
            <TabsContent value="wallet" className="mt-0">
              <WalletTab />
            </TabsContent>
            
            <TabsContent value="profile" className="mt-0">
              <ProfileTab />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>
          </div>

          {/* Bottom Navigation */}
          <TabsList className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-gray-200 rounded-none grid grid-cols-6 shadow-lg">
            <TabsTrigger value="dashboard" className="flex-col space-y-1 text-xs h-full">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-col space-y-1 text-xs h-full">
              <Activity className="h-5 w-5" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex-col space-y-1 text-xs h-full">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex-col space-y-1 text-xs h-full">
              <Wallet className="h-5 w-5" />
              <span>Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-col space-y-1 text-xs h-full">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-col space-y-1 text-xs h-full">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
