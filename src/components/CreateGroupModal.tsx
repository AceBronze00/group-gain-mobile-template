
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Users, DollarSign, Calendar as CalendarIcon, Settings, Key, Lock, Unlock, RefreshCw, UserCheck, Play, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateGroupModal = ({ open, onOpenChange }: CreateGroupModalProps) => {
  const { createGroup } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    groupName: '',
    contributionAmount: '',
    frequency: 'weekly',
    lockWithdrawals: true,
    allowMultipleContributions: false,
    payoutOrder: 'randomized',
    inviteCode: '',
    startDate: undefined as Date | undefined,
    isAutoStart: false
  });

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Biweekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const getNextContributionDate = () => {
    if (!formData.startDate) return null;
    
    const next = new Date(formData.startDate);
    switch (formData.frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'biweekly':
        next.setDate(next.getDate() + 14);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
    }
    return next;
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({...formData, inviteCode: result});
  };

  const resetForm = () => {
    setFormData({
      groupName: '',
      contributionAmount: '',
      frequency: 'weekly',
      lockWithdrawals: true,
      allowMultipleContributions: false,
      payoutOrder: 'randomized',
      inviteCode: '',
      startDate: undefined,
      isAutoStart: false
    });
    setStep(1);
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.groupName.trim() !== '';
      case 2:
        return parseFloat(formData.contributionAmount) > 0 && 
               (!formData.isAutoStart || (formData.isAutoStart && formData.startDate));
      case 3:
        return true;
      case 4:
        return formData.inviteCode.length === 6;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (!validateStep(5)) return;
    
    createGroup(formData);
    onOpenChange(false);
    resetForm();
  };

  React.useEffect(() => {
    if (open && !formData.inviteCode) {
      generateRandomCode();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Create New Group
          </DialogTitle>
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === step ? 'bg-blue-500' : i < step ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Group Details</h3>
                <p className="text-gray-600 text-sm">Set up your money pool basics</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="groupName">Group Name *</Label>
                  <Input
                    id="groupName"
                    placeholder="e.g., Coffee Fund, Vacation Pool"
                    value={formData.groupName}
                    onChange={(e) => setFormData({...formData, groupName: e.target.value})}
                    className="mt-1"
                    required
                  />
                </div>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Users className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">No Participant Limit</p>
                      <p className="text-xs text-blue-700">
                        Members can join your group at any time, even after it has started.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Financial Rules</h3>
                <p className="text-gray-600 text-sm">Set contribution amounts and frequency</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="contributionAmount">Contribution per Person *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="contributionAmount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="100.00"
                      value={formData.contributionAmount}
                      onChange={(e) => setFormData({...formData, contributionAmount: e.target.value})}
                      className="mt-1 pl-8"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Contribution Frequency *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {frequencies.map((freq) => (
                      <Button
                        key={freq.value}
                        variant={formData.frequency === freq.value ? "default" : "outline"}
                        onClick={() => setFormData({...formData, frequency: freq.value})}
                        className="h-10"
                        type="button"
                      >
                        {freq.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Cycle Start Configuration */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <Label className="text-base font-semibold">Cycle Start Configuration</Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <Switch
                      id="auto-start"
                      checked={formData.isAutoStart}
                      onCheckedChange={(checked) => setFormData({...formData, isAutoStart: checked})}
                    />
                    <Label htmlFor="auto-start" className="flex-1">
                      <div className="font-medium">Automatic Start</div>
                      <div className="text-sm text-gray-500">
                        Cycle begins automatically on the selected start date
                      </div>
                    </Label>
                  </div>

                  {formData.isAutoStart && (
                    <div className="space-y-3">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) => setFormData({...formData, startDate: date})}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>

                      {formData.startDate && getNextContributionDate() && (
                        <Card className="p-3 bg-blue-50 border-blue-200">
                          <div className="flex items-start space-x-2">
                            <CalendarIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-blue-800">Next Contribution Due</p>
                              <p className="text-xs text-blue-700">
                                {format(getNextContributionDate()!, "PPP")}
                              </p>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  )}

                  {!formData.isAutoStart && (
                    <Card className="p-3 bg-gray-50 border-gray-200">
                      <div className="flex items-start space-x-2">
                        <Play className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">Manual Start</p>
                          <p className="text-xs text-gray-600">
                            You can manually trigger the cycle start after group creation
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <Label className="font-medium">Allow Multiple Contributions</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Members can contribute multiple shares for multiple payouts
                    </p>
                  </div>
                  <Switch
                    checked={formData.allowMultipleContributions}
                    onCheckedChange={(checked) => setFormData({...formData, allowMultipleContributions: checked})}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <RefreshCw className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Payout Order</h3>
                <p className="text-gray-600 text-sm">Choose how the payout sequence is determined</p>
              </div>

              <div className="space-y-4">
                <RadioGroup 
                  value={formData.payoutOrder} 
                  onValueChange={(value) => setFormData({...formData, payoutOrder: value})}
                >
                  <Card className={`p-4 cursor-pointer transition-all ${
                    formData.payoutOrder === 'randomized' 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="randomized" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <RefreshCw className="h-4 w-4 text-purple-500" />
                          <Label className="font-medium text-purple-700">Randomized Order</Label>
                          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-600 border-purple-200">
                            Recommended
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Payout order will be automatically randomized after all participants join. 
                          Ensures fairness and prevents gaming.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className={`p-4 cursor-pointer transition-all ${
                    formData.payoutOrder === 'manual' 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="manual" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <UserCheck className="h-4 w-4 text-blue-500" />
                          <Label className="font-medium text-blue-700">Manually Set Order</Label>
                        </div>
                        <p className="text-sm text-gray-600">
                          You can arrange the payout order from the Members tab. 
                          Order becomes locked after the first payout is sent.
                        </p>
                      </div>
                    </div>
                  </Card>
                </RadioGroup>

                <Card className="p-3 bg-yellow-50 border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <Settings className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Order Policy</p>
                      <p className="text-xs text-yellow-700">
                        {formData.payoutOrder === 'randomized' 
                          ? "The system will randomly assign payout positions after all members join."
                          : "You'll be able to drag and drop members to set the payout sequence."
                        }
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                {formData.lockWithdrawals ? (
                  <Lock className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                ) : (
                  <Unlock className="h-12 w-12 text-green-500 mx-auto mb-2" />
                )}
                <h3 className="text-lg font-semibold">Withdrawal Policy</h3>
                <p className="text-gray-600 text-sm">Choose when members can withdraw their payouts</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Card 
                    className={`p-4 cursor-pointer transition-all ${
                      formData.lockWithdrawals 
                        ? 'border-orange-300 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-200'
                    }`}
                    onClick={() => setFormData({...formData, lockWithdrawals: true})}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                        formData.lockWithdrawals 
                          ? 'border-orange-500 bg-orange-500' 
                          : 'border-gray-300'
                      }`}>
                        {formData.lockWithdrawals && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Lock className="h-4 w-4 text-orange-500" />
                          <Label className="font-medium text-orange-700">Lock Until Group Completes</Label>
                          <Badge variant="outline" className="text-xs bg-orange-100 text-orange-600 border-orange-200">
                            Recommended
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Payouts stay locked in member wallets until all members have received their turn. 
                          This ensures everyone stays committed to the group.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card 
                    className={`p-4 cursor-pointer transition-all ${
                      !formData.lockWithdrawals 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 hover:border-green-200'
                    }`}
                    onClick={() => setFormData({...formData, lockWithdrawals: false})}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                        !formData.lockWithdrawals 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {!formData.lockWithdrawals && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Unlock className="h-4 w-4 text-green-500" />
                          <Label className="font-medium text-green-700">Allow Immediate Withdrawal</Label>
                        </div>
                        <p className="text-sm text-gray-600">
                          Members can withdraw their payouts immediately after receiving them. 
                          More flexible but may reduce group commitment.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Key className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Invite Code & Review</h3>
                <p className="text-gray-600 text-sm">Create your invite code and review settings</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="inviteCode">Group Invite Code *</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="inviteCode"
                      placeholder="6-character code"
                      value={formData.inviteCode}
                      onChange={(e) => setFormData({...formData, inviteCode: e.target.value.toUpperCase().slice(0, 6)})}
                      className="text-center font-mono text-lg tracking-wider"
                      maxLength={6}
                      required
                    />
                    <Button
                      type="button"
                      onClick={generateRandomCode}
                      variant="outline"
                      className="px-3"
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <Card className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Name:</span>
                    <span className="font-semibold">{formData.groupName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contribution:</span>
                    <span className="font-semibold">${formData.contributionAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <Badge variant="secondary" className="capitalize">{formData.frequency}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Multiple Contributions:</span>
                    <Badge variant={formData.allowMultipleContributions ? "default" : "outline"}>
                      {formData.allowMultipleContributions ? "Allowed" : "Single Only"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payout Order:</span>
                    <Badge variant="secondary" className="capitalize">{formData.payoutOrder}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Withdrawal Policy:</span>
                    <Badge variant={formData.lockWithdrawals ? "outline" : "default"} className="flex items-center space-x-1">
                      {formData.lockWithdrawals ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      <span>{formData.lockWithdrawals ? "Locked" : "Immediate"}</span>
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cycle Start:</span>
                    <Badge variant={formData.isAutoStart ? "default" : "secondary"} className="flex items-center space-x-1">
                      {formData.isAutoStart ? <CalendarIcon className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      <span>{formData.isAutoStart ? "Automatic" : "Manual"}</span>
                    </Badge>
                  </div>
                  {formData.isAutoStart && formData.startDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-semibold text-sm">{format(formData.startDate, "MMM dd, yyyy")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invite Code:</span>
                    <Badge variant="default" className="font-mono">{formData.inviteCode}</Badge>
                  </div>
                </Card>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <Button
              onClick={step === 5 ? handleSubmit : handleNext}
              className="flex items-center"
              disabled={!validateStep(step)}
            >
              {step === 5 ? 'Create Group' : 'Next'}
              {step !== 5 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
