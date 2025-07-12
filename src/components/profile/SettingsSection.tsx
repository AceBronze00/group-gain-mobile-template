
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Settings, User, Bell, Lock, CreditCard, Users, Smartphone, ChevronDown } from "lucide-react";

interface SettingsSectionProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  onSettingClick: (tab: string) => void;
}

const SettingsSection = ({ isSettingsOpen, setIsSettingsOpen, onSettingClick }: SettingsSectionProps) => {
  return (
    <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-lg font-bold text-gray-800">Settings</span>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-3 mt-4">
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            className="h-16 justify-start p-4 text-left"
            onClick={() => onSettingClick('profile')}
          >
            <User className="h-6 w-6 mr-4 text-blue-500" />
            <div>
              <div className="font-semibold">User Profile</div>
              <div className="text-sm text-gray-500">Name, picture, contact info</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16 justify-start p-4 text-left"
            onClick={() => onSettingClick('notifications')}
          >
            <Bell className="h-6 w-6 mr-4 text-orange-500" />
            <div>
              <div className="font-semibold">Notifications</div>
              <div className="text-sm text-gray-500">Payment reminders, alerts</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16 justify-start p-4 text-left"
            onClick={() => onSettingClick('security')}
          >
            <Lock className="h-6 w-6 mr-4 text-red-500" />
            <div>
              <div className="font-semibold">Security & Privacy</div>
              <div className="text-sm text-gray-500">2FA, privacy, KYC</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16 justify-start p-4 text-left"
            onClick={() => onSettingClick('payments')}
          >
            <CreditCard className="h-6 w-6 mr-4 text-green-500" />
            <div>
              <div className="font-semibold">Payment & Payout</div>
              <div className="text-sm text-gray-500">Bank accounts, auto-debit</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16 justify-start p-4 text-left"
            onClick={() => onSettingClick('groups')}
          >
            <Users className="h-6 w-6 mr-4 text-purple-500" />
            <div>
              <div className="font-semibold">Nest Settings</div>
              <div className="text-sm text-gray-500">Manage your nests</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-16 justify-start p-4 text-left"
            onClick={() => onSettingClick('general')}
          >
            <Smartphone className="h-6 w-6 mr-4 text-indigo-500" />
            <div>
              <div className="font-semibold">General Settings</div>
              <div className="text-sm text-gray-500">Language, timezone, theme</div>
            </div>
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SettingsSection;
