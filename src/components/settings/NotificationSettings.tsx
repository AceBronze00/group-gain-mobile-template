
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, BellOff, Mail, MessageSquare, Smartphone, Clock, Calendar, DollarSign } from "lucide-react";
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

  const [reminderTiming, setReminderTiming] = useState({
    dueDateFirst: '3days',
    dueDateSecond: '1day',
    dueDateFinal: 'dayof',
    payoutReminder: '1day'
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
        <p className="text-sm text-muted-foreground">{description}</p>
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
              <p className="text-sm text-muted-foreground">Temporarily disable all notifications</p>
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
          description="Get notified about upcoming payouts and when it's your turn"
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

      {/* Due Date Reminder Timing */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Due Date Reminder Timing</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Choose when you want to be reminded about upcoming payment due dates
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">First Reminder</Label>
            </div>
            <Select 
              value={reminderTiming.dueDateFirst} 
              onValueChange={(value) => setReminderTiming(prev => ({ ...prev, dueDateFirst: value }))}
              disabled={settings.muteAll}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 days before</SelectItem>
                <SelectItem value="5days">5 days before</SelectItem>
                <SelectItem value="3days">3 days before</SelectItem>
                <SelectItem value="2days">2 days before</SelectItem>
                <SelectItem value="none">Don't remind</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">Second Reminder</Label>
            </div>
            <Select 
              value={reminderTiming.dueDateSecond} 
              onValueChange={(value) => setReminderTiming(prev => ({ ...prev, dueDateSecond: value }))}
              disabled={settings.muteAll}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2days">2 days before</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
                <SelectItem value="12hours">12 hours before</SelectItem>
                <SelectItem value="none">Don't remind</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">Final Reminder</Label>
            </div>
            <Select 
              value={reminderTiming.dueDateFinal} 
              onValueChange={(value) => setReminderTiming(prev => ({ ...prev, dueDateFinal: value }))}
              disabled={settings.muteAll}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dayof">Day of deadline</SelectItem>
                <SelectItem value="6hours">6 hours before</SelectItem>
                <SelectItem value="3hours">3 hours before</SelectItem>
                <SelectItem value="1hour">1 hour before</SelectItem>
                <SelectItem value="none">Don't remind</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Payout Notification Timing */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <DollarSign className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">Payout Notification Timing</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Choose when you want to be notified about your upcoming payout
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">When it's your payout turn</Label>
            </div>
            <Select 
              value={reminderTiming.payoutReminder} 
              onValueChange={(value) => setReminderTiming(prev => ({ ...prev, payoutReminder: value }))}
              disabled={settings.muteAll}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3days">3 days before</SelectItem>
                <SelectItem value="2days">2 days before</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
                <SelectItem value="dayof">Day of payout</SelectItem>
                <SelectItem value="immediately">When payment clears</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Tip:</span> You'll always receive a notification when your payout has been processed and funds are available.
            </p>
          </div>
        </div>
      </Card>

      {/* Quiet Hours */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quiet Hours</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Do not disturb</span>
            <span className="text-sm text-muted-foreground">10 PM - 8 AM</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Non-urgent notifications will be held until quiet hours end. Critical alerts (failed payments) will still come through.
          </p>
        </div>
        <Button variant="outline" className="mt-4">Customize Quiet Hours</Button>
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
