
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Shield, Star, Users, Clock, Award, AlertTriangle, CheckCircle, X } from "lucide-react";

interface TrustScoreProfileProps {
  user?: {
    name: string;
    trustScore: number;
    groupsCompleted: number;
    onTimePayments: number;
    organizerRoles: number;
    peerRating: number;
    totalRaters: number;
    totalGroups: number;
    latePayments: number;
    disputes: number;
  };
}

const TrustScoreProfile = ({ user }: TrustScoreProfileProps) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState({
    onTimePayments: '',
    wouldGroupAgain: '',
    starRating: 0
  });

  // Default placeholder data
  const profileData = user || {
    name: "Alex Johnson",
    trustScore: 76,
    groupsCompleted: 7,
    onTimePayments: 100,
    organizerRoles: 3,
    peerRating: 4.6,
    totalRaters: 5,
    totalGroups: 4,
    latePayments: 0,
    disputes: 1
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 71) return { color: "text-green-600", bg: "bg-green-500", light: "bg-green-50" };
    if (score >= 51) return { color: "text-yellow-600", bg: "bg-yellow-500", light: "bg-yellow-50" };
    return { color: "text-red-600", bg: "bg-red-500", light: "bg-red-50" };
  };

  const scoreColors = getTrustScoreColor(profileData.trustScore);

  const handleStarClick = (rating: number) => {
    setRatingData(prev => ({ ...prev, starRating: rating }));
  };

  const handleSubmitRating = () => {
    console.log('Rating submitted:', ratingData);
    // TODO: Submit rating to backend
    setShowRatingModal(false);
    setRatingData({ onTimePayments: '', wouldGroupAgain: '', starRating: 0 });
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-6 p-4">
        {/* Trust Score Display */}
        <Card className={`p-6 ${scoreColors.light} border-2`}>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className={`h-6 w-6 ${scoreColors.color}`} />
              <h2 className="text-lg font-bold text-gray-800">Trust Score</h2>
            </div>
            
            <div className={`text-5xl font-bold ${scoreColors.color}`}>
              {profileData.trustScore}
              <span className="text-2xl text-gray-500">/100</span>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress 
                value={profileData.trustScore} 
                className="h-3"
              />
              <p className="text-sm text-gray-600">
                {profileData.trustScore >= 71 ? "Excellent" : 
                 profileData.trustScore >= 51 ? "Good" : "Needs Improvement"}
              </p>
            </div>
          </div>
        </Card>

        {/* Trust Score Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-blue-500" />
            Trust Score Breakdown
          </h3>
          
          <div className="space-y-4">
            {/* Groups Completed */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-gray-700">Groups Completed</span>
              </div>
              <Badge variant="outline" className="text-blue-600 bg-blue-50">
                {profileData.groupsCompleted}
              </Badge>
            </div>

            {/* On-Time Payments */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-gray-700">On-Time Payments</span>
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50">
                {profileData.onTimePayments}%
              </Badge>
            </div>

            {/* Group Organizer Roles */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-purple-500" />
                <span className="text-gray-700">Group Organizer Roles</span>
              </div>
              <Badge variant="outline" className="text-purple-600 bg-purple-50">
                {profileData.organizerRoles}
              </Badge>
            </div>

            {/* Peer Rating */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-gray-700">Peer Rating Average</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-yellow-600">
                  {profileData.peerRating} ⭐️
                </span>
              </div>
            </div>

            {/* Rating Tooltip */}
            <div className="text-xs text-gray-500 italic pl-6">
              Based on ratings from {profileData.totalRaters} users across {profileData.totalGroups} groups
            </div>

            {/* Late Payments */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-orange-500" />
                <span className="text-gray-700">Late Payments</span>
              </div>
              <Badge variant="outline" className="text-orange-600 bg-orange-50">
                {profileData.latePayments}
              </Badge>
            </div>

            {/* Disputes */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-gray-700">Disputes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-red-600 bg-red-50">
                  {profileData.disputes}
                </Badge>
                {profileData.disputes > 0 && (
                  <Badge variant="outline" className="text-green-600 bg-green-50 text-xs">
                    Resolved
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Rate User Button */}
        <Button 
          onClick={() => setShowRatingModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Rate This User After Group Completion
        </Button>
      </div>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Rate Group Member
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* On-Time Payments Question */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Did this user make all their payments on time?
              </Label>
              <RadioGroup
                value={ratingData.onTimePayments}
                onValueChange={(value) => setRatingData(prev => ({ ...prev, onTimePayments: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="payments-yes" />
                  <Label htmlFor="payments-yes" className="cursor-pointer">
                    <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="payments-no" />
                  <Label htmlFor="payments-no" className="cursor-pointer">
                    <X className="h-4 w-4 text-red-500 inline mr-1" />
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Would Group Again Question */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Would you group with this user again?
              </Label>
              <RadioGroup
                value={ratingData.wouldGroupAgain}
                onValueChange={(value) => setRatingData(prev => ({ ...prev, wouldGroupAgain: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="group-yes" />
                  <Label htmlFor="group-yes" className="cursor-pointer">
                    <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="group-no" />
                  <Label htmlFor="group-no" className="cursor-pointer">
                    <X className="h-4 w-4 text-red-500 inline mr-1" />
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Star Rating */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Overall Rating
              </Label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className="focus:outline-none transition-colors"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= ratingData.starRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center italic mt-2">
                Ratings are anonymous. Honest feedback helps protect the community.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRatingModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitRating}
                disabled={!ratingData.onTimePayments || !ratingData.wouldGroupAgain || ratingData.starRating === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrustScoreProfile;
