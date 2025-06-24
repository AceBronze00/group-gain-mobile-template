
import RecentTransactions from "./RecentTransactions";
import PoolHistory from "./PoolHistory";

interface HistorySectionProps {
  transactionHistory: Array<{
    id: number;
    type: string;
    amount: number;
    description: string;
    date: string;
    status: string;
  }>;
  poolHistory: Array<{
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

const HistorySection = ({ transactionHistory, poolHistory, onRateMember }: HistorySectionProps) => {
  return (
    <div className="space-y-6">
      <RecentTransactions transactions={transactionHistory} />
      <PoolHistory history={poolHistory} onRateMember={onRateMember} />
    </div>
  );
};

export default HistorySection;
