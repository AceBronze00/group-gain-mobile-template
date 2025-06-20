
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Users, TrendingUp } from "lucide-react";

interface User {
  id: number;
  name: string;
  avatar: string;
  trustScore: number;
  groupsCompleted: number;
  activeGroups: number;
  totalContributed: number;
}

interface UserSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserSearchModal = ({ open, onOpenChange }: UserSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock users data
  const allUsers: User[] = [
    {
      id: 1,
      name: "Sarah Mitchell",
      avatar: "/placeholder.svg",
      trustScore: 92,
      groupsCompleted: 18,
      activeGroups: 3,
      totalContributed: 5400
    },
    {
      id: 2,
      name: "Mike Johnson",
      avatar: "/placeholder.svg",
      trustScore: 78,
      groupsCompleted: 8,
      activeGroups: 2,
      totalContributed: 2100
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "/placeholder.svg",
      trustScore: 85,
      groupsCompleted: 15,
      activeGroups: 4,
      totalContributed: 4200
    },
    {
      id: 4,
      name: "James Wilson",
      avatar: "/placeholder.svg",
      trustScore: 67,
      groupsCompleted: 5,
      activeGroups: 1,
      totalContributed: 800
    },
    {
      id: 5,
      name: "Lisa Chen",
      avatar: "/placeholder.svg",
      trustScore: 88,
      groupsCompleted: 22,
      activeGroups: 2,
      totalContributed: 6700
    }
  ];

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Search Users</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-96">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  {searchQuery ? 'No users found' : 'Start typing to search users'}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Shield className="h-3 w-3 text-blue-500" />
                        <Badge className={`text-xs px-2 py-1 ${getTrustScoreColor(user.trustScore)}`}>
                          Trust: {user.trustScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-bold text-blue-600">{user.groupsCompleted}</div>
                      <div className="text-gray-500 text-xs">Completed</div>
                    </div>
                    <div>
                      <div className="font-bold text-green-600">{user.activeGroups}</div>
                      <div className="text-gray-500 text-xs">Active</div>
                    </div>
                    <div>
                      <div className="font-bold text-purple-600">{formatCurrency(user.totalContributed)}</div>
                      <div className="text-gray-500 text-xs">Total</div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSearchModal;
