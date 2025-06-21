
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileSettingsProps {
  user: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    avatar: string;
    trustScore: number;
    groupsCompleted: number;
  };
}

const UserProfileSettings = ({ user }: UserProfileSettingsProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleVerifyEmail = () => {
    toast({
      title: "Verification Sent",
      description: "Please check your email for verification link.",
    });
  };

  const handleVerifyPhone = () => {
    toast({
      title: "Verification Code Sent",
      description: "Please check your phone for verification code.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-blue-500 text-white text-xl">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Change Photo</span>
            </Button>
            <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell others about yourself..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleVerifyEmail}>
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Verified
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex space-x-2">
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleVerifyPhone}>
                <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />
                Verify
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Bank Account Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Payout Information</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-gray-600">****1234 - Chase Bank</p>
              </div>
              <Badge variant="outline" className="text-green-600">Verified</Badge>
            </div>
          </div>
          <Button variant="outline">Add New Account</Button>
        </div>
      </Card>

      {/* Trust Score & History (Read-only) */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          Trust Score & History
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{user.trustScore}</div>
            <div className="text-sm text-gray-600">Trust Score</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{user.groupsCompleted}</div>
            <div className="text-sm text-gray-600">Groups Completed</div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Your trust score is calculated based on payment history and group participation.
        </p>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default UserProfileSettings;
