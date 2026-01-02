
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Bell, BellOff, Mail, MessageSquare, Smartphone, Clock, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const dueDateOptions = [
  { value: 0, label: 'Off' },
  { value: 1, label: '1 day' },
  { value: 2, label: '2 days' },
  { value: 3, label: '3 days' },
  { value: 4, label: '5 days' },
  { value: 5, label: '7 days' },
];

const payoutOptions = [
  { value: 0, label: 'Off' },
  { value: 1, label: 'Day of' },
  { value: 2, label: '1 day' },
  { value: 3, label: '2 days' },
  { value: 4, label: '3 days' },
];

const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    paymentDuePush: true,
    paymentDueEmail: true,
    paymentDueSMS: false,
    poolUpdatesPush: true,
    poolUpdatesEmail: false,
    poolUpdatesSMS: false,
    payoutAlertsPush: true,
    payoutAlertsEmail: true,
    payoutAlertsSMS: true,
    failedPaymentPush: true,
    failedPaymentEmail: true,
    failedPaymentSMS: true,
    muteAll: false
  });

  const [reminderTiming, setReminderTiming] = useState({
    dueDate: 3,
    payout: 2
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

  const TimingDial = ({ 
    value, 
    onChange, 
    options,
    icon: Icon,
    iconColor,
    title,
    description
  }: { 
    value: number; 
    onChange: (val: number) => void;
    options: { value: number; label: string }[];
    icon: any;
    iconColor: string;
    title: string;
    description: string;
  }) => {
    const currentLabel = options.find(o => o.value === value)?.label || 'Off';
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className="relative pt-4 pb-2">
          {/* Current value display */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-4 border-primary">
              <div className="text-center">
                <Clock className="h-5 w-5 mx-auto text-primary mb-1" />
                <span className="text-sm font-bold text-primary">{currentLabel}</span>
              </div>
            </div>
          </div>
          
          {/* Slider */}
          <div className="px-2">
            <Slider
              value={[value]}
              onValueChange={(vals) => onChange(vals[0])}
              max={options.length - 1}
              min={0}
              step={1}
              disabled={settings.muteAll}
              className="w-full"
            />
          </div>
          
          {/* Labels below slider */}
          <div className="flex justify-between mt-2 px-1">
            {options.map((option, idx) => (
              <span 
                key={option.value}
                className={`text-xs ${value === option.value ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                {option.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

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

      {/* Due Date Reminder Timing - Dial */}
      <Card className="p-6">
        <TimingDial
          value={reminderTiming.dueDate}
          onChange={(val) => setReminderTiming(prev => ({ ...prev, dueDate: val }))}
          options={dueDateOptions}
          icon={Calendar}
          iconColor="text-blue-500"
          title="Due Date Reminder"
          description="How many days before payment is due?"
        />
      </Card>

      {/* Payout Notification Timing - Dial */}
      <Card className="p-6">
        <TimingDial
          value={reminderTiming.payout}
          onChange={(val) => setReminderTiming(prev => ({ ...prev, payout: val }))}
          options={payoutOptions}
          icon={DollarSign}
          iconColor="text-green-500"
          title="Payout Reminder"
          description="When should we notify you about your payout?"
        />
        <div className="p-3 bg-muted/50 rounded-lg mt-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tip:</span> You'll always receive a notification when your payout has been processed.
          </p>
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
