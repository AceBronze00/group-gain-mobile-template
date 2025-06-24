
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";
import PoolHistoryItem from "./PoolHistoryItem";

interface PoolHistoryProps {
  history: Array<{
    id: number;
    groupName: string;
    status: string;
    totalAmount: number;
    myContribution: number;
    payout: number;
    participants: number;
    duration: string;
    completedDate?: string;
    failedDate?: string;
    reason?: string;
    membersToRate?: Array<{
      id: number;
      name: string;
      avatar: string;
      hasRated: boolean;
    }>;
  }>;
  onRateMember: (member: any, groupName: string) => void;
}

const PoolHistory = ({ history, onRateMember }: PoolHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No history</h3>
        <p className="text-gray-500">Your completed pools will appear here</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Pool History</h3>
      {history.map((pool) => (
        <PoolHistoryItem
          key={pool.id}
          pool={pool}
          onRateMember={onRateMember}
        />
      ))}
    </div>
  );
};

export default PoolHistory;
