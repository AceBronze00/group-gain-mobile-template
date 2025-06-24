
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Users, DollarSign, Calendar, Settings } from "lucide-react";
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
    totalAmount: '',
    frequency: 'weekly',
    memberLimit: '5',
    allowDoubleContribution: false
  });

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    createGroup(formData);
    onOpenChange(false);
    setStep(1);
    setFormData({
      groupName: '',
      contributionAmount: '',
      totalAmount: '',
      frequency: 'weekly',
      memberLimit: '5',
      allowDoubleContribution: false
    });
  };

  const calculateEstimatedPayout = () => {
    const contribution = parseFloat(formData.contributionAmount) || 0;
    const members = parseInt(formData.memberLimit) || 1;
    return contribution * members;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Create New Group
          </DialogTitle>
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3].map((i) => (
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
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    placeholder="e.g., Coffee Fund, Vacation Pool"
                    value={formData.groupName}
                    onChange={(e) => setFormData({...formData, groupName: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="memberLimit">Maximum Members</Label>
                  <Input
                    id="memberLimit"
                    type="number"
                    min="2"
                    max="20"
                    value={formData.memberLimit}
                    onChange={(e) => setFormData({...formData, memberLimit: e.target.value})}
                    className="mt-1"
                  />
                </div>
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
                  <Label htmlFor="contributionAmount">Contribution per Person</Label>
                  <Input
                    id="contributionAmount"
                    type="number"
                    placeholder="100"
                    value={formData.contributionAmount}
                    onChange={(e) => setFormData({...formData, contributionAmount: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Contribution Frequency</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {frequencies.map((freq) => (
                      <Button
                        key={freq.value}
                        variant={formData.frequency === freq.value ? "default" : "outline"}
                        onClick={() => setFormData({...formData, frequency: freq.value})}
                        className="h-10"
                      >
                        {freq.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Double Contribution Option */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="allowDoubleContribution"
                      checked={formData.allowDoubleContribution}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, allowDoubleContribution: !!checked})
                      }
                    />
                    <div className="space-y-1">
                      <Label 
                        htmlFor="allowDoubleContribution" 
                        className="text-sm font-medium cursor-pointer"
                      >
                        Allow Double Contributions
                      </Label>
                      <p className="text-xs text-gray-600">
                        Members can contribute 2x and receive 2x payouts (get paid twice in rotation)
                      </p>
                    </div>
                  </div>
                </Card>

                {formData.contributionAmount && (
                  <Card className="p-4 bg-blue-50">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Estimated Payout per Member</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${calculateEstimatedPayout().toLocaleString()}
                      </p>
                      {formData.allowDoubleContribution && (
                        <p className="text-xs text-gray-500 mt-1">
                          Double contributors get: ${(calculateEstimatedPayout() * 2).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Settings className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Review & Create</h3>
                <p className="text-gray-600 text-sm">Confirm your group settings</p>
              </div>

              <Card className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Name:</span>
                  <span className="font-semibold">{formData.groupName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Members:</span>
                  <span className="font-semibold">{formData.memberLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contribution:</span>
                  <span className="font-semibold">${formData.contributionAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <Badge variant="secondary">{formData.frequency}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Double Contributions:</span>
                  <Badge variant={formData.allowDoubleContribution ? "default" : "secondary"}>
                    {formData.allowDoubleContribution ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Expected Payout:</span>
                  <span className="font-bold text-green-600">
                    ${calculateEstimatedPayout().toLocaleString()}
                  </span>
                </div>
              </Card>
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
              onClick={step === 3 ? handleSubmit : handleNext}
              className="flex items-center"
              disabled={step === 1 && !formData.groupName}
            >
              {step === 3 ? 'Create Group' : 'Next'}
              {step !== 3 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
