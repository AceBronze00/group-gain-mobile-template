
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, Clock, ChevronRight, DollarSign } from "lucide-react";

interface GroupSummaryCardProps {
  group: {
    id: number;
    name: string;
    totalAmount: number;
    progress: number;
    members: number;
    nextPayout: string;
    myPayoutDate: string;
    position: number;
    isAdmin?: boolean;
    myTurn?: boolean;
  };
  onPayment?: () => void;
  onExpandDetails?: () => void;
}

const GroupSummaryCard = ({ group, onPayment, onExpandDetails }: GroupSummaryCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getDaysUntilPayout = (date: string) => {
    const today = new Date();
    const payoutDate = new Date(date);
    const diffTime = payoutDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-8 bg-white border-0 shadow-lg rounded-2xl max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {group.name}
          </h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{group.members} members</span>
            </div>
            <Badge 
              variant="secondary" 
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium"
            >
              {group.isAdmin ? "Admin" : "Participant"}
            </Badge>
            <Badge 
              variant="outline" 
              className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1 rounded-full font-medium"
            >
              Position {group.position}
            </Badge>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900 mb-3">
            {formatCurrency(group.totalAmount)}
          </div>
          <Button
            onClick={onPayment}
            className={`px-6 py-2 rounded-xl font-semibold shadow-md transition-all duration-200 hover:scale-105 ${
              group.myTurn 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Pay Now
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">Group Progress</span>
          <span className="text-sm font-bold text-blue-600">{group.progress}%</span>
        </div>
        <Progress 
          value={group.progress} 
          className="h-3 bg-gray-100 rounded-full overflow-hidden"
        />
      </div>

      {/* Payout Information */}
      <div className="space-y-4">
        {/* Next Payout */}
        <div 
          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          onClick={onExpandDetails}
        >
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <span className="text-sm font-medium text-gray-900">Next Payout</span>
              <p className="text-sm text-gray-600">{formatDate(group.nextPayout)}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>

        {/* My Payout */}
        <div className="flex items-center p-4 bg-blue-50 rounded-xl">
          <Clock className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <span className="text-sm font-medium text-gray-900">My Payout</span>
            <p className="text-sm text-gray-600">
              {formatDate(group.myPayoutDate)} • {getDaysUntilPayout(group.myPayoutDate)} days
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroupSummaryCard;
