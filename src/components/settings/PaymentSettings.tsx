
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Clock, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    autoDebit: true,
    defaultAmount: "100",
    preferredPayout: "bank_transfer"
  });

  const handleSave = () => {
    toast({
      title: "Payment Settings Updated",
      description: "Your payment preferences have been saved.",
    });
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Linked Accounts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
          Linked Accounts
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-gray-600">****1234 - Chase Bank</p>
              </div>
              <Badge className="bg-green-500">Primary</Badge>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Credit Card</p>
                <p className="text-sm text-gray-600">****5678 - Visa</p>
              </div>
              <Badge variant="outline">Backup</Badge>
            </div>
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New Account</span>
          </Button>
        </div>
      </Card>

      {/* Auto-Debit Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-green-500" />
          Auto-Debit Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-debit">Enable Auto-Debit</Label>
              <p className="text-sm text-gray-600">Automatically pay contributions when due</p>
            </div>
            <Switch
              id="auto-debit"
              checked={settings.autoDebit}
              onCheckedChange={() => toggleSetting('autoDebit')}
            />
          </div>
          {settings.autoDebit && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 mb-2">Auto-debit is enabled</p>
              <p className="text-xs text-green-700">Payments will be automatically deducted 1 day before due date</p>
            </div>
          )}
        </div>
      </Card>

      {/* Default Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-purple-500" />
          Default Settings
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="default-amount">Default Contribution Amount</Label>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-gray-500">$</span>
              <Input
                id="default-amount"
                type="number"
                value={settings.defaultAmount}
                onChange={(e) => setSettings({...settings, defaultAmount: e.target.value})}
                className="w-32"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="payout-method">Preferred Payout Method</Label>
            <select 
              id="payout-method"
              value={settings.preferredPayout}
              onChange={(e) => setSettings({...settings, preferredPayout: e.target.value})}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="digital_wallet">Digital Wallet</option>
              <option value="check">Check</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Payment History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="font-medium">Coffee Fund - Weekly</span>
              <p className="text-sm text-gray-600">Dec 18, 2024</p>
            </div>
            <div className="text-right">
              <span className="font-medium text-red-600">-$100</span>
              <p className="text-sm text-gray-600">Auto-debit</p>
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="font-medium">Vacation Pool - Payout</span>
              <p className="text-sm text-gray-600">Dec 15, 2024</p>
            </div>
            <div className="text-right">
              <span className="font-medium text-green-600">+$2,400</span>
              <p className="text-sm text-gray-600">Bank transfer</p>
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <span className="font-medium">Coffee Fund - Weekly</span>
              <p className="text-sm text-gray-600">Dec 11, 2024</p>
            </div>
            <div className="text-right">
              <span className="font-medium text-red-600">-$100</span>
              <p className="text-sm text-gray-600">Auto-debit</p>
            </div>
          </div>
        </div>
        <Button variant="outline" className="mt-4">View Full History</Button>
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

export default PaymentSettings;
