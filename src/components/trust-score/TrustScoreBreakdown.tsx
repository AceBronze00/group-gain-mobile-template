
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Award, Star, X, AlertTriangle } from "lucide-react";

interface TrustScoreBreakdownProps {
  groupsCompleted: number;
  onTimePayments: number;
  organizerRoles: number;
  peerRating: number;
  totalRaters: number;
  totalGroups: number;
  latePayments: number;
  groupsLeftActive: number;
  groupsLeftInactive: number;
}

const TrustScoreBreakdown = ({
  groupsCompleted,
  onTimePayments,
  organizerRoles,
  peerRating,
  totalRaters,
  totalGroups,
  latePayments,
  groupsLeftActive,
  groupsLeftInactive
}: TrustScoreBreakdownProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Award className="h-5 w-5 mr-2 text-blue-500" />
        Trust Score Breakdown
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-gray-700">Groups Completed</span>
          </div>
          <Badge variant="outline" className="text-blue-600 bg-blue-50">
            {groupsCompleted}
          </Badge>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-gray-700">On-Time Payments</span>
          </div>
          <Badge variant="outline" className="text-green-600 bg-green-50">
            {onTimePayments}%
          </Badge>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-purple-500" />
            <span className="text-gray-700">Group Organizer Roles</span>
          </div>
          <Badge variant="outline" className="text-purple-600 bg-purple-50">
            {organizerRoles}
          </Badge>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-gray-700">Peer Rating Average</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-yellow-600">
              {peerRating} ⭐️
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 italic pl-6">
          Based on ratings from {totalRaters} users across {totalGroups} groups
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <X className="h-4 w-4 text-orange-500" />
            <span className="text-gray-700">Late Payments</span>
          </div>
          <Badge variant="outline" className="text-orange-600 bg-orange-50">
            {latePayments}
          </Badge>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-gray-700">Nests Left (Active)</span>
          </div>
          <Badge variant="outline" className="text-red-600 bg-red-50">
            {groupsLeftActive}
          </Badge>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <X className="h-4 w-4 text-orange-400" />
            <span className="text-gray-700">Nests Left (Before Start)</span>
          </div>
          <Badge variant="outline" className="text-orange-500 bg-orange-50">
            {groupsLeftInactive}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default TrustScoreBreakdown;
