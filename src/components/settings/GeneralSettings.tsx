
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Globe, Moon, Sun, Volume2, Vibrate, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GeneralSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    darkMode: false,
    language: "en",
    timezone: "America/New_York",
    currency: "USD",
    soundEnabled: true,
    vibrationEnabled: true,
    highContrast: false
  });

  const handleSave = () => {
    toast({
      title: "General Settings Updated",
      description: "Your preferences have been saved successfully.",
    });
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export will be ready for download shortly.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Display Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-blue-500" />
          Display Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {settings.darkMode ? (
                <Moon className="h-5 w-5 text-purple-500" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-gray-600">Switch to dark theme</p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={() => toggleSetting('darkMode')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="high-contrast">High Contrast</Label>
              <p className="text-sm text-gray-600">Improve readability</p>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={() => toggleSetting('highContrast')}
            />
          </div>
        </div>
      </Card>

      {/* Localization */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-green-500" />
          Localization
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <select 
              id="language"
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="pt">Português</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="timezone">Time Zone</Label>
            <select 
              id="timezone"
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="UTC">UTC/GMT</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="currency">Default Currency</Label>
            <select 
              id="currency"
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="CAD">Canadian Dollar (C$)</option>
              <option value="AUD">Australian Dollar (A$)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Sound & Haptics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sound & Haptics</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-blue-500" />
              <div>
                <Label htmlFor="sound-enabled">Notification Sounds</Label>
                <p className="text-sm text-gray-600">Play sounds for notifications</p>
              </div>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={() => toggleSetting('soundEnabled')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Vibrate className="h-5 w-5 text-purple-500" />
              <div>
                <Label htmlFor="vibration-enabled">Vibration</Label>
                <p className="text-sm text-gray-600">Vibrate for notifications and alerts</p>
              </div>
            </div>
            <Switch
              id="vibration-enabled"
              checked={settings.vibrationEnabled}
              onCheckedChange={() => toggleSetting('vibrationEnabled')}
            />
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Download className="h-5 w-5 mr-2 text-indigo-500" />
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium">Export My Data</p>
              <p className="text-sm text-gray-600">Download all your account data (PDF/CSV)</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Export
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Data Usage</p>
              <p className="text-sm text-gray-600">View your storage and bandwidth usage</p>
            </div>
            <Button variant="outline">View Stats</Button>
          </div>
        </div>
      </Card>

      {/* App Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">App Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">App Version</span>
            <Badge variant="outline">v2.1.0</Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">Last Updated</span>
            <span className="text-sm text-gray-600">Dec 15, 2024</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Build Number</span>
            <span className="text-sm text-gray-600">2024.12.15.1</span>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <Button variant="outline">Check for Updates</Button>
          <Button variant="outline">Release Notes</Button>
        </div>
      </Card>

      {/* Legal & Support */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Legal & Support</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">Terms of Service</Button>
          <Button variant="ghost" className="w-full justify-start">Privacy Policy</Button>
          <Button variant="ghost" className="w-full justify-start">Help Center</Button>
          <Button variant="ghost" className="w-full justify-start">Contact Support</Button>
        </div>
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

export default GeneralSettings;
