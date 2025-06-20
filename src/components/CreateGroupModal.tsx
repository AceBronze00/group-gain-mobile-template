
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Users, DollarSign, Calendar, Settings, Shield } from "lucide-react";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateGroupModal = ({ open, onOpenChange }: CreateGroupModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    groupName: '',
    contributionAmount: '',
    totalAmount: '',
    frequency: 'weekly',
    memberLimit: '5',
    groupInsurance: false,
    insuranceType: 'split' // 'split' or 'organizer'
  });

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Creating group:', formData);
    onOpenChange(false);
    setStep(1);
  };

  const calculateEstimatedPayout = () => {
    const contribution = parseFloat(formData.contributionAmount) || 0;
    const members = parseInt(formData.memberLimit) || 1;
    return contribution * members;
  };

  const calculateInsuranceCost = () => {
    const totalPool = calculateEstimatedPayout();
    const insuranceCost = totalPool * 0.01; // 1% of total pool
    return formData.insuranceType === 'split' ? insuranceCost / parseInt(formData.memberLimit) : insuranceCost;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Create New Group
          </DialogTitle>
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
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
          {/* Step 1: Basic Info */}
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

          {/* Step 2: Financial Settings */}
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

                {formData.contributionAmount && (
                  <Card className="p-4 bg-blue-50">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Estimated Payout per Member</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${calculateEstimatedPayout().toLocaleString()}
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Insurance Options */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Shield className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Group Insurance</h3>
                <p className="text-gray-600 text-sm">Protect your group's contributions</p>
              </div>

              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="groupInsurance" className="text-base font-medium">
                      Enable Group Insurance
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Protect against fraud and defaults (50% coverage)
                    </p>
                  </div>
                  <Switch
                    id="groupInsurance"
                    checked={formData.groupInsurance}
                    onCheckedChange={(checked) => setFormData({...formData, groupInsurance: checked})}
                  />
                </div>

                {formData.groupInsurance && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label>Insurance Payment</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          variant={formData.insuranceType === 'split' ? "default" : "outline"}
                          onClick={() => setFormData({...formData, insuranceType: 'split'})}
                          className="h-12 text-xs"
                        >
                          Split Among Members
                        </Button>
                        <Button
                          variant={formData.insuranceType === 'organizer' ? "default" : "outline"}
                          onClick={() => setFormData({...formData, insuranceType: 'organizer'})}
                          className="h-12 text-xs"
                        >
                          I'll Pay Full Cost
                        </Button>
                      </div>
                    </div>

                    <Card className="p-3 bg-green-50">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          {formData.insuranceType === 'split' ? 'Cost per member' : 'Total cost'}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          ${calculateInsuranceCost().toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          1% of total pool • Up to 50% coverage
                        </p>
                      </div>
                    </Card>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Coverage includes:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Member defaults or non-payment</li>
                        <li>• Fraudulent activity</li>
                        <li>• Organizer misconduct</li>
                        <li>• Maximum 50% of contribution covered</li>
                      </ul>
                    </div>
                  </div>
                )}

                {!formData.groupInsurance && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Members can still opt for individual insurance when joining (covers their own contribution only).
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
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
                  <span className="text-gray-600">Group Insurance:</span>
                  <Badge variant={formData.groupInsurance ? "default" : "outline"}>
                    {formData.groupInsurance ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                {formData.groupInsurance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Insurance Cost:</span>
                    <span className="font-medium">
                      ${calculateInsuranceCost().toFixed(2)} 
                      {formData.insuranceType === 'split' ? ' per member' : ' total'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Expected Payout:</span>
                  <span className="font-bold text-green-600">
                    ${calculateEstimatedPayout().toLocaleString()}
                  </span>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
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
              onClick={step === 4 ? handleSubmit : handleNext}
              className="flex items-center"
            >
              {step === 4 ? 'Create Group' : 'Next'}
              {step !== 4 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
