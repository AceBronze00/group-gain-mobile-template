
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Wallet, Clock } from "lucide-react";

interface TransactionItemProps {
  transaction: {
    id: number;
    type: string;
    amount: number;
    description: string;
    date: string;
    status: string;
  };
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="p-4 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            transaction.type === 'cashout' ? 'bg-green-100' :
            transaction.type === 'deposit' ? 'bg-blue-100' : 'bg-orange-100'
          }`}>
            {transaction.type === 'cashout' && <ArrowUpRight className="h-4 w-4 text-green-600" />}
            {transaction.type === 'deposit' && <Wallet className="h-4 w-4 text-blue-600" />}
            {transaction.type === 'transfer' && <Clock className="h-4 w-4 text-orange-600" />}
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{transaction.description}</p>
            <p className="text-xs text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold text-sm ${
            transaction.type === 'deposit' ? 'text-green-600' : 'text-gray-800'
          }`}>
            {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </p>
          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="mt-1 text-xs">
            {transaction.status}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default TransactionItem;
