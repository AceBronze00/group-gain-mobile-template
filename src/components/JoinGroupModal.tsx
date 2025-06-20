import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, DollarSign, Calendar, Shield, CheckCircle, AlertTriangle } from "lucide-react";

interface JoinGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinGroupModal = ({ open, onOpenChange }: JoinGroupModalProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [foundGroup, setFoundGroup] = useState(null);
  const [individualInsurance, setIndividualInsurance] = useState(false);

  // Mock group data that would be found by invite code
  const mockGroup = {
    id: 1,
    name: "Weekend Getaway Fund",
    members: 6,
    maxMembers: 8,
    contributionAmount: 200,
    frequency: "monthly",
    totalAmount: 1600,
    nextPayout: "2024-07-10",
    currentRecipient: "Lisa Chen",
    creator: "Sarah Mitchell",
    trustScoreAvg: 84,
    hasGroupInsurance: false, // This determines if individual insurance is available
    memberList: [
      { name: "Sarah M.", avatar: "/placeholder.svg", trustScore: 92 },
      { name: "Mike J.", avatar: "/placeholder.svg", trustScore: 78 },
      { name: "Emma D.", avatar: "/placeholder.svg", trustScore: 88 },
      { name: "James W.", avatar: "/placeholder.svg", trustScore: 71 },
      { name: "Lisa C.", avatar: "/placeholder.svg", trustScore: 95 },
      { name: "David R.", avatar: "/placeholder.svg", trustScore: 82 }
    ]
  };

  const handleSearch = () => {
    if (inviteCode.trim()) {
      // Mock API call - in real app, this would validate the invite code
      if (inviteCode === 'WEEKEND123' || inviteCode.length >= 6) {
        setFoundGroup(mockGroup);
      } else {
        setFoundGroup(null);
      }
    }
  };

  const handleJoin = () => {
    console.log('Joining group:', foundGroup, 'Individual insurance:', individualInsurance);
    onOpenChange(false);
    setInviteCode('');
    setFoundGroup(null);
    setIndividualInsurance(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrustScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateIndividualInsuranceCost = () => {
    return foundGroup ? Math.max(0.50, foundGroup.contributionAmount * 0.005) : 0.50;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Join Existing Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite Code Input */}
          <div className="space-y-4">
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Enter Invite Code</h3>
              <p className="text-gray-600 text-sm">Get the code from a group member</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="inviteCode"
                  placeholder="Enter group invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={!inviteCode.trim()}>
                  Search
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Try: WEEKEND123 (demo)
              </p>
            </div>
          </div>

          {/* Found Group Details */}
          {foundGroup && (
            <Card className="p-4 space-y-4">
              <div className="text-center">
                <h4 className="text-lg font-bold text-gray-800">{foundGroup.name}</h4>
                <p className="text-sm text-gray-600">Created by {foundGroup.creator}</p>
              </div>

              {/* Insurance Status */}
              <div className="flex items-center justify-center space-x-2">
                <Shield className={`h-4 w-4 ${foundGroup.hasGroupInsurance ? 'text-green-500' : 'text-gray-400'}`} />
                <Badge variant={foundGroup.hasGroupInsurance ? "default" : "outline"}>
                  {foundGroup.hasGroupInsurance ? "Group Insurance Enabled" : "No Group Insurance"}
                </Badge>
              </div>

              {/* Group Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <div className="font-bold">{formatCurrency(foundGroup.contributionAmount)}</div>
                  <div className="text-xs text-gray-500">{foundGroup.frequency}</div>
                </div>
                <div className="text-center">
                  <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <div className="font-bold">{foundGroup.members}/{foundGroup.maxMembers}</div>
                  <div className="text-xs text-gray-500">Members</div>
                </div>
              </div>

              {/* Individual Insurance Option */}
              {!foundGroup.hasGroupInsurance && (
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="individualInsurance"
                      checked={individualInsurance}
                      onCheckedChange={(checked) => setIndividualInsurance(checked === true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="individualInsurance" className="text-sm font-medium cursor-pointer">
                        Add Individual Insurance (+${calculateIndividualInsuranceCost().toFixed(2)})
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Protect your contribution (50% coverage) against defaults and fraud
                      </p>
                      {individualInsurance && (
                        <div className="mt-2 p-2 bg-white rounded border">
                          <div className="flex items-center space-x-1 mb-1">
                            <Shield className="h-3 w-3 text-green-500" />
                            <span className="text-xs font-medium">Coverage includes:</span>
                          </div>
                          <ul className="text-xs text-gray-600 space-y-0.5">
                            <li>• Up to 50% of your contribution</li>
                            <li>• Protection from member defaults</li>
                            <li>• Fraud protection</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Next Payout Info */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Next Payout</span>
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-xs text-gray-600">
                  {foundGroup.currentRecipient} • {new Date(foundGroup.nextPayout).toLocaleDateString()}
                </p>
                <p className="text-sm font-bold text-blue-600 mt-1">
                  {formatCurrency(foundGroup.totalAmount)}
                </p>
              </div>

              {/* Group Trust Score */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Trust Score</span>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className={`font-bold ${getTrustScoreColor(foundGroup.trustScoreAvg)}`}>
                    {foundGroup.trustScoreAvg}
                  </span>
                </div>
              </div>

              {/* Current Members Preview */}
              <div>
                <p className="text-sm font-medium mb-2">Current Members</p>
                <div className="flex -space-x-2">
                  {foundGroup.memberList.slice(0, 5).map((member, index) => (
                    <Avatar key={index} className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {foundGroup.memberList.length > 5 && (
                    <div className="h-8 w-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{foundGroup.memberList.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Cost Breakdown */}
              <Card className="p-3 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Contribution:</span>
                    <span className="font-medium">{formatCurrency(foundGroup.contributionAmount)}</span>
                  </div>
                  {individualInsurance && (
                    <div className="flex justify-between text-sm">
                      <span>Individual Insurance:</span>
                      <span className="font-medium">+${calculateIndividualInsuranceCost().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total per month:</span>
                    <span>{formatCurrency(foundGroup.contributionAmount + (individualInsurance ? calculateIndividualInsuranceCost() : 0))}</span>
                  </div>
                </div>
              </Card>

              {/* Join Button */}
              <Button 
                onClick={handleJoin} 
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Join This Group
              </Button>
            </Card>
          )}

          {/* No Group Found */}
          {inviteCode && !foundGroup && (
            <Card className="p-6 text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No group found with this invite code</p>
              <p className="text-sm text-gray-500 mt-1">
                Double-check the code or ask for a new one
              </p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
