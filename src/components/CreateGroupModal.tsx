
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Calendar, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateGroupModal = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    maxMembers: 5,
    contributionAmount: '',
    frequency: 'weekly',
    startDate: ''
  });

  const frequencies = [
    { value: 'daily', label: 'Daily', description: 'Every day' },
    { value: 'weekly', label: 'Weekly', description: 'Every week' },
    { value: 'monthly', label: 'Monthly', description: 'Every month' }
  ];

  const handleInputChange = (field, value) => {
    setGroupData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Group Created Successfully!",
      description: `${groupData.name} has been created. Share the invite code with friends.`,
    });
    onOpenChange(false);
    setStep(1);
    setGroupData({
      name: '',
      description: '',
      maxMembers: 5,
      contributionAmount: '',
      frequency: 'weekly',
      startDate: ''
    });
  };

  const calculateTotalPayout = () => {
    return groupData.contributionAmount * groupData.maxMembers;
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return groupData.name.trim() !== '';
      case 2:
        return groupData.contributionAmount !== '' && groupData.maxMembers > 0;
      case 3:
        return groupData.frequency !== '' && groupData.startDate !== '';
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            Create New Group
          </DialogTitle>
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= num
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Group Details</h3>
                <p className="text-sm text-gray-600">Give your group a name and description</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="e.g., Coffee Fund, Vacation Pool"
                  value={groupData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="What's this group for?"
                  value={groupData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Financial Settings</h3>
                <p className="text-sm text-gray-600">Set contribution amounts and group size</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contributionAmount">Contribution Amount per Person</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="contributionAmount"
                    type="number"
                    placeholder="100"
                    value={groupData.contributionAmount}
                    onChange={(e) => handleInputChange('contributionAmount', e.target.value)}
                    className="pl-10 text-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxMembers">Maximum Members</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="maxMembers"
                    type="number"
                    min="2"
                    max="20"
                    value={groupData.maxMembers}
                    onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value))}
                    className="pl-10 text-lg"
                  />
                </div>
              </div>

              {groupData.contributionAmount && groupData.maxMembers && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${calculateTotalPayout().toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-700">Total Payout Amount</div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Schedule & Rules</h3>
                <p className="text-sm text-gray-600">When and how often will members contribute?</p>
              </div>
              
              <div className="space-y-2">
                <Label>Contribution Frequency</Label>
                <Select value={groupData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        <div>
                          <div className="font-medium">{freq.label}</div>
                          <div className="text-sm text-gray-500">{freq.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="startDate"
                    type="date"
                    value={groupData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <Card className="p-4 bg-green-50 border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Group Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Name:</span>
                    <span className="font-medium">{groupData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Members:</span>
                    <span className="font-medium">{groupData.maxMembers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contribution:</span>
                    <span className="font-medium">${groupData.contributionAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <Badge variant="outline" className="text-xs">
                      {frequencies.find(f => f.value === groupData.frequency)?.label}
                    </Badge>
                  </div>
                  <div className="flex justify-between font-semibold text-green-700 pt-2 border-t">
                    <span>Total Payout:</span>
                    <span>${calculateTotalPayout().toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <div className="ml-auto">
            {step < 3 ? (
              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={!isStepValid()}
                className="bg-green-500 hover:bg-green-600"
              >
                Create Group
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
