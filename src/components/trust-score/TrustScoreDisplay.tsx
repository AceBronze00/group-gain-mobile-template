
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield } from "lucide-react";

interface TrustScoreDisplayProps {
  trustScore: number;
}

const TrustScoreDisplay = ({ trustScore }: TrustScoreDisplayProps) => {
  const getTrustScoreColor = (score: number) => {
    if (score >= 71) return { color: "text-green-600", bg: "bg-green-500", light: "bg-green-50" };
    if (score >= 51) return { color: "text-yellow-600", bg: "bg-yellow-500", light: "bg-yellow-50" };
    return { color: "text-red-600", bg: "bg-red-500", light: "bg-red-50" };
  };

  const scoreColors = getTrustScoreColor(trustScore);

  return (
    <Card className={`p-6 ${scoreColors.light} border-2`}>
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Shield className={`h-6 w-6 ${scoreColors.color}`} />
          <h2 className="text-lg font-bold text-gray-800">Trust Score</h2>
        </div>
        
        <div className={`text-5xl font-bold ${scoreColors.color}`}>
          {trustScore}
          <span className="text-2xl text-gray-500">/100</span>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={trustScore} 
            className="h-3"
          />
          <p className="text-sm text-gray-600">
            {trustScore >= 71 ? "Excellent" : 
             trustScore >= 51 ? "Good" : "Needs Improvement"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TrustScoreDisplay;
