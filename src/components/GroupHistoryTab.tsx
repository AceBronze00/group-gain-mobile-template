
import { Card } from "@/components/ui/card";
import { CheckCircle, Users } from "lucide-react";

interface GroupHistoryTabProps {
  group: any;
}

const GroupHistoryTab = ({ group }: GroupHistoryTabProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-4">
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Sarah M. received payout</p>
            <p className="text-sm text-gray-500">March 15, 2024</p>
          </div>
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(group.totalAmount)}
          </span>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-4">
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Mike J. received payout</p>
            <p className="text-sm text-gray-500">March 8, 2024</p>
          </div>
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(group.totalAmount)}
          </span>
        </div>
      </Card>

      <Card className="p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-4">
          <Users className="h-6 w-6 text-blue-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Group created</p>
            <p className="text-sm text-gray-500">January 10, 2024</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GroupHistoryTab;
