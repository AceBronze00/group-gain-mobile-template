
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import TrustScoreDisplay from "./trust-score/TrustScoreDisplay";
import TrustScoreBreakdown from "./trust-score/TrustScoreBreakdown";
import RatingModal from "./trust-score/RatingModal";
import { calculateTrustScore } from "@/utils/trustScoreCalculator";

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
    groupsLeftActive: number;
    groupsLeftInactive: number;
  };
}

const TrustScoreProfile = ({ user }: TrustScoreProfileProps) => {
  const [showRatingModal, setShowRatingModal] = useState(false);

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
    groupsLeftActive: 0,
    groupsLeftInactive: 0
  };

  // Calculate trust score using the algorithm
  const calculatedTrustScore = calculateTrustScore({
    groupsCompleted: profileData.groupsCompleted,
    onTimePaymentRate: profileData.onTimePayments,
    organizerRoles: profileData.organizerRoles,
    peerRatings: [
      {
        onTimePayments: true,
        wouldGroupAgain: true,
        starRating: Math.round(profileData.peerRating),
        raterTrustScore: 75,
        groupSize: 6,
        groupDuration: 90,
        daysAgo: 30
      }
    ],
    groupsLeftActive: profileData.groupsLeftActive,
    groupsLeftInactive: profileData.groupsLeftInactive,
    latePayments: profileData.latePayments,
    isVerified: true,
    accountAgeDays: 365
  });

  return (
    <>
      <div className="max-w-md mx-auto space-y-6 p-4">
        <TrustScoreDisplay trustScore={calculatedTrustScore} />
        
        <TrustScoreBreakdown
          groupsCompleted={profileData.groupsCompleted}
          onTimePayments={profileData.onTimePayments}
          organizerRoles={profileData.organizerRoles}
          peerRating={profileData.peerRating}
          totalRaters={profileData.totalRaters}
          totalGroups={profileData.totalGroups}
          latePayments={profileData.latePayments}
          groupsLeftActive={profileData.groupsLeftActive}
          groupsLeftInactive={profileData.groupsLeftInactive}
        />

        <Button 
          onClick={() => setShowRatingModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Rate This User After Group Completion
        </Button>
      </div>

      <RatingModal
        showRatingModal={showRatingModal}
        setShowRatingModal={setShowRatingModal}
      />
    </>
  );
};

export default TrustScoreProfile;
