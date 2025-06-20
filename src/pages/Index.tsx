
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, User, History } from "lucide-react";
import DashboardTab from "@/components/DashboardTab";
import SearchTab from "@/components/SearchTab";
import ProfileTab from "@/components/ProfileTab";
import ActivityTab from "@/components/ActivityTab";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MoneyPool</h1>
          <p className="text-gray-600">Smart group savings & lending</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="px-4">
            <TabsContent value="dashboard">
              <DashboardTab />
            </TabsContent>
            <TabsContent value="search">
              <SearchTab />
            </TabsContent>
            <TabsContent value="activity">
              <ActivityTab />
            </TabsContent>
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-md mx-auto">
              <TabsList className="w-full h-16 bg-transparent p-0 grid grid-cols-4">
                <TabsTrigger 
                  value="dashboard" 
                  className="h-full flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="search" 
                  className="h-full flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <Search className="h-5 w-5" />
                  <span className="text-xs">Search</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="h-full flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <History className="h-5 w-5" />
                  <span className="text-xs">Activity</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="h-full flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">Profile</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
