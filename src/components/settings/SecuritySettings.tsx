
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, EyeOff, Smartphone, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SecuritySettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    biometricLock: true,
    showTrustScore: true,
    showParticipationHistory: false,
    showContactDetails: false,
    pinLock: false
  });

  const handleSave = () => {
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been saved.",
    });
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.twoFactorEnabled}
              onCheckedChange={() => toggleSetting('twoFactorEnabled')}
            />
            {settings.twoFactorEnabled && <Badge className="bg-green-500">Enabled</Badge>}
          </div>
        </div>
        {settings.twoFactorEnabled && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">SMS authentication is active for +1 (555) 123-4567</p>
            <Button variant="outline" className="mt-2">Change Phone Number</Button>
          </div>
        )}
      </Card>

      {/* App Lock Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Lock className="h-5 w-5 mr-2 text-blue-500" />
          App Lock Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-purple-500" />
              <div>
                <Label htmlFor="biometric-lock">Biometric Lock</Label>
                <p className="text-sm text-gray-600">Use Face ID or fingerprint to unlock</p>
              </div>
            </div>
            <Switch
              id="biometric-lock"
              checked={settings.biometricLock}
              onCheckedChange={() => toggleSetting('biometricLock')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-red-500" />
              <div>
                <Label htmlFor="pin-lock">PIN Lock</Label>
                <p className="text-sm text-gray-600">Require PIN to access app</p>
              </div>
            </div>
            <Switch
              id="pin-lock"
              checked={settings.pinLock}
              onCheckedChange={() => toggleSetting('pinLock')}
            />
          </div>
        </div>
      </Card>

      {/* KYC Verification */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-green-500" />
          KYC Verification
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Identity Verification</span>
            <Badge className="bg-green-500">Verified</Badge>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Address Verification</span>
            <Badge variant="outline" className="text-orange-600">Pending</Badge>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Bank Account Verification</span>
            <Badge className="bg-green-500">Verified</Badge>
          </div>
        </div>
        <Button variant="outline" className="mt-4">Upload Documents</Button>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Eye className="h-5 w-5 mr-2 text-blue-500" />
          Privacy Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-trust-score">Show Trust Score</Label>
              <p className="text-sm text-gray-600">Allow others to see your trust score</p>
            </div>
            <Switch
              id="show-trust-score"
              checked={settings.showTrustScore}
              onCheckedChange={() => toggleSetting('showTrustScore')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-participation">Show Participation History</Label>
              <p className="text-sm text-gray-600">Display your group participation to others</p>
            </div>
            <Switch
              id="show-participation"
              checked={settings.showParticipationHistory}
              onCheckedChange={() => toggleSetting('showParticipationHistory')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-contact">Show Contact Details</Label>
              <p className="text-sm text-gray-600">Allow group members to see your contact info</p>
            </div>
            <Switch
              id="show-contact"
              checked={settings.showContactDetails}
              onCheckedChange={() => toggleSetting('showContactDetails')}
            />
          </div>
        </div>
      </Card>

      {/* Session Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Session Management</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="font-medium">Current Device</span>
              <p className="text-sm text-gray-600">iPhone 15 - Last active: Now</p>
            </div>
            <Badge className="bg-green-500">Active</Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="font-medium">MacBook Pro</span>
              <p className="text-sm text-gray-600">Last active: 2 hours ago</p>
            </div>
            <Button variant="outline" size="sm">Log Out</Button>
          </div>
        </div>
        <Button variant="destructive" className="mt-4">Log Out All Devices</Button>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;
