
import TransactionItem from "./TransactionItem";

interface RecentTransactionsProps {
  transactions: Array<{
    id: number;
    type: string;
    amount: number;
    description: string;
    date: string;
    status: string;
  }>;
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

export default RecentTransactions;
