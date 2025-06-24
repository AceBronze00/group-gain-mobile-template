
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock, UserPlus, Search } from "lucide-react";
import UserSearchModal from "@/components/UserSearchModal";
import InviteToGroupModal from "@/components/InviteToGroupModal";

const SearchTab = () => {
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock recent searches
  const recentSearches = [
    {
      id: 1,
      name: "Sarah Mitchell",
      avatar: "/placeholder.svg",
      trustScore: 92,
      searchedAt: "2 hours ago"
    },
    {
      id: 2,
      name: "Mike Johnson", 
      avatar: "/placeholder.svg",
      trustScore: 78,
      searchedAt: "1 day ago"
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "/placeholder.svg", 
      trustScore: 85,
      searchedAt: "3 days ago"
    }
  ];

  // Mock suggested users for quick invite
  const suggestedUsers = [
    {
      id: 4,
      name: "Lisa Chen",
      avatar: "/placeholder.svg",
      trustScore: 88,
      mutualGroups: 2
    },
    {
      id: 5,
      name: "James Wilson",
      avatar: "/placeholder.svg",
      trustScore: 67,
      mutualGroups: 1
    }
  ];

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const handleQuickInvite = (user: any) => {
    setSelectedUser(user);
    setShowInviteModal(true);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Search Button */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
        <div className="text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-blue-100" />
          <h2 className="text-2xl font-bold mb-2">Find Users</h2>
          <p className="text-blue-100 mb-4">Search for trusted members to join your savings groups</p>
          <Button 
            onClick={() => setShowUserSearch(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Users
          </Button>
        </div>
      </Card>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-bold text-gray-800">Recent Searches</h3>
          </div>
          
          {recentSearches.map((user) => (
            <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-800">{user.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getTrustScoreColor(user.trustScore)}`}>
                        Trust: {user.trustScore}
                      </Badge>
                      <span className="text-xs text-gray-500">{user.searchedAt}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleQuickInvite(user)}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Invite
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Invite Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-bold text-gray-800">Quick Invite</h3>
        </div>
        <p className="text-sm text-gray-600">Users from your network you might want to invite</p>
        
        {suggestedUsers.map((user) => (
          <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-purple-500 text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-800">{user.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getTrustScoreColor(user.trustScore)}`}>
                      Trust: {user.trustScore}
                    </Badge>
                    <span className="text-xs text-gray-500">{user.mutualGroups} mutual groups</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleQuickInvite(user)}
                size="sm"
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Invite
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <UserSearchModal 
        open={showUserSearch} 
        onOpenChange={setShowUserSearch} 
      />
      {selectedUser && (
        <InviteToGroupModal
          open={showInviteModal}
          onOpenChange={setShowInviteModal}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default SearchTab;
