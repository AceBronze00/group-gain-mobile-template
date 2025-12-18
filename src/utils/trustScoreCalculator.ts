
interface PeerRating {
  onTimePayments: boolean;
  wouldGroupAgain: boolean;
  starRating: number;
  raterTrustScore: number;
  groupSize: number;
  groupDuration: number;
  daysAgo: number;
}

interface TrustScoreData {
  groupsCompleted: number;
  onTimePaymentRate: number;
  organizerRoles: number;
  peerRatings: PeerRating[];
  disputes: number;
  latePayments: number;
  // New bonus factors
  isVerified?: boolean;
  accountAgeDays?: number;
}

export const calculateTrustScore = (data: TrustScoreData): number => {
  let score = 0;

  // On-Time Payments (35% weight)
  const onTimePaymentScore = (data.onTimePaymentRate / 100) * 35;
  score += onTimePaymentScore;

  // Groups Completed (20% weight)
  const groupsScore = Math.min(data.groupsCompleted * 2.5, 20);
  score += groupsScore;

  // Group Organizer Roles (15% weight)
  const organizerScore = Math.min(data.organizerRoles * 3, 15);
  score += organizerScore;

  // Peer Ratings (15% weight)
  if (data.peerRatings.length > 0) {
    let weightedRatingSum = 0;
    let totalWeight = 0;

    data.peerRatings.forEach(rating => {
      // Base weight
      let weight = 1;

      // Weight by rater trust score (higher trust raters have more influence)
      const raterWeight = Math.min(rating.raterTrustScore / 75, 1.5);
      weight *= raterWeight;

      // Weight by group size (larger groups carry more weight)
      const sizeWeight = Math.min(rating.groupSize / 4, 1.3);
      weight *= sizeWeight;

      // Time decay (older ratings have less impact)
      const timeWeight = Math.max(1 - (rating.daysAgo / 365), 0.5);
      weight *= timeWeight;

      // Calculate rating value (0-5 star scale)
      let ratingValue = rating.starRating;
      
      // Bonus for positive behaviors
      if (rating.onTimePayments) ratingValue += 0.5;
      if (rating.wouldGroupAgain) ratingValue += 0.5;

      // Normalize to 0-1 scale
      ratingValue = Math.min(ratingValue / 6, 1);

      weightedRatingSum += ratingValue * weight;
      totalWeight += weight;
    });

    const averageRating = totalWeight > 0 ? weightedRatingSum / totalWeight : 0.75;
    const peerRatingScore = averageRating * 15;
    score += peerRatingScore;
  } else {
    // Default neutral score for new users
    score += 11.25; // 75% of 15
  }

  // === BONUS FACTORS (up to 15 points) ===
  
  // Verification Status Bonus (up to 8 points)
  if (data.isVerified) {
    score += 8;
  }

  // Account Age Bonus (up to 7 points)
  // 1 point per 90 days, max 7 points (630+ days / ~21 months)
  if (data.accountAgeDays !== undefined) {
    const ageBonus = Math.min(Math.floor(data.accountAgeDays / 90), 7);
    score += ageBonus;
  }

  // === NEGATIVE FACTORS ===
  
  // Disputes penalty (up to -10 points)
  const disputesPenalty = Math.min(data.disputes * 5, 10);
  score -= disputesPenalty;

  // Late payments penalty (up to -5 points)
  const latePaymentsPenalty = Math.min(data.latePayments * 2, 5);
  score -= latePaymentsPenalty;

  // Ensure score is between 0 and 100
  return Math.round(Math.max(0, Math.min(100, score)));
};
