import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BaliTripExpensesTable = () => {
  const expenses = [
    { id: 1, member: "Sarah Chen", item: "Hotel (3 nights)", amount: 450, date: "2024-01-15", status: "paid" },
    { id: 2, member: "Mike Rodriguez", item: "Scuba diving tour", amount: 120, date: "2024-01-16", status: "pending" },
    { id: 3, member: "Emma Thompson", item: "Local transport", amount: 85, date: "2024-01-16", status: "paid" },
    { id: 4, member: "James Park", item: "Group dinner", amount: 180, date: "2024-01-17", status: "paid" },
    { id: 5, member: "Lisa Wang", item: "Temple entrance fees", amount: 45, date: "2024-01-17", status: "pending" },
    { id: 6, member: "David Brown", item: "Cooking class", amount: 95, date: "2024-01-18", status: "paid" },
    { id: 7, member: "Sarah Chen", item: "Airport transfer", amount: 75, date: "2024-01-14", status: "paid" },
    { id: 8, member: "Mike Rodriguez", item: "Snorkeling gear rental", amount: 35, date: "2024-01-16", status: "pending" },
    { id: 9, member: "Emma Thompson", item: "Souvenir shopping", amount: 125, date: "2024-01-18", status: "paid" },
    { id: 10, member: "James Park", item: "Spa treatment", amount: 200, date: "2024-01-17", status: "paid" },
    { id: 11, member: "Lisa Wang", item: "Beach club entry", amount: 60, date: "2024-01-16", status: "pending" },
    { id: 12, member: "David Brown", item: "Traditional show", amount: 80, date: "2024-01-17", status: "paid" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const perPersonShare = totalExpenses / 6;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Bali Trip Expenses</CardTitle>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total: {formatCurrency(totalExpenses)}</span>
          <span>Per person: {formatCurrency(perPersonShare)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Expense Item</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.member}</TableCell>
                <TableCell>{expense.item}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={expense.status === 'paid' ? 'default' : 'secondary'}
                    className={expense.status === 'paid' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }
                  >
                    {expense.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BaliTripExpensesTable;