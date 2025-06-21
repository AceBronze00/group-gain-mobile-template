
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Payment Due Reminders
    paymentDuePush: true,
    paymentDueEmail: true,
    paymentDueSMS: false,
    
    // Pool Update Alerts
    poolUpdatesPush: true,
    poolUpdatesEmail: false,
    poolUpdatesSMS: false,
    
    // Next Payout Alerts
    payoutAlertsPush: true,
    payoutAlertsEmail: true,
    payoutAlertsSMS: true,
    
    // Failed Payment Alerts
    failedPaymentPush: true,
    failedPaymentEmail: true,
    failedPaymentSMS: true,
    
    // Mute All Notifications
    muteAll: false
  });

  const handleSave = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const NotificationRow = ({ 
    title, 
    description, 
    pushKey, 
    emailKey, 
    smsKey 
  }: {
    title: string;
    description: string;
    pushKey: keyof typeof settings;
    emailKey: keyof typeof settings;
    smsKey: keyof typeof settings;
  }) => (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Smartphone className="h-4 w-4 text-blue-500" />
          <Label htmlFor={pushKey} className="text-sm">Push</Label>
          <Switch
            id={pushKey}
            checked={settings[pushKey] as boolean}
            onCheckedChange={() => toggleSetting(pushKey)}
            disabled={settings.muteAll}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-green-500" />
          <Label htmlFor={emailKey} className="text-sm">Email</Label>
          <Switch
            id={emailKey}
            checked={settings[emailKey] as boolean}
            onCheckedChange={() => toggleSetting(emailKey)}
            disabled={settings.muteAll}
          />
        </div>
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-orange-500" />
          <Label htmlFor={smsKey} className="text-sm">SMS</Label>
          <Switch
            id={smsKey}
            checked={settings[smsKey] as boolean}
            onCheckedChange={() => toggleSetting(smsKey)}
            disabled={settings.muteAll}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Master Control */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {settings.muteAll ? (
              <BellOff className="h-6 w-6 text-red-500" />
            ) : (
              <Bell className="h-6 w-6 text-blue-500" />
            )}
            <div>
              <h3 className="text-lg font-semibold">Mute All Notifications</h3>
              <p className="text-sm text-gray-600">Temporarily disable all notifications</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.muteAll}
              onCheckedChange={() => toggleSetting('muteAll')}
            />
            {settings.muteAll && <Badge variant="destructive">Muted</Badge>}
          </div>
        </div>
      </Card>

      {/* Payment Due Reminders */}
      <Card className="p-6">
        <NotificationRow
          title="Payment Due Reminders"
          description="Get notified when your contributions are due"
          pushKey="paymentDuePush"
          emailKey="paymentDueEmail"
          smsKey="paymentDueSMS"
        />
      </Card>

      {/* Pool Update Alerts */}
      <Card className="p-6">
        <NotificationRow
          title="Pool Update Alerts"
          description="When someone joins, leaves, or pool rules change"
          pushKey="poolUpdatesPush"
          emailKey="poolUpdatesEmail"
          smsKey="poolUpdatesSMS"
        />
      </Card>

      {/* Next Payout Alerts */}
      <Card className="p-6">
        <NotificationRow
          title="Next Payout Alerts"
          description="Get notified about upcoming payouts"
          pushKey="payoutAlertsPush"
          emailKey="payoutAlertsEmail"
          smsKey="payoutAlertsSMS"
        />
      </Card>

      {/* Failed Payment Alerts */}
      <Card className="p-6">
        <NotificationRow
          title="Failed Payment Alerts"
          description="Important alerts when payments fail"
          pushKey="failedPaymentPush"
          emailKey="failedPaymentEmail"
          smsKey="failedPaymentSMS"
        />
      </Card>

      {/* Notification Schedule */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Schedule</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Payment reminders</span>
            <span className="text-sm text-gray-600">3 days, 1 day, and day of</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Payout notifications</span>
            <span className="text-sm text-gray-600">1 day before</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Do not disturb</span>
            <span className="text-sm text-gray-600">10 PM - 8 AM</span>
          </div>
        </div>
        <Button variant="outline" className="mt-4">Customize Schedule</Button>
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

export default NotificationSettings;
