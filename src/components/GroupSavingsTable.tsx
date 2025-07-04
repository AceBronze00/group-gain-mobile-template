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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const GroupSavingsTable = () => {
  const contributions = [
    { id: 1, member: "Sarah Chen", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-01", status: "paid" },
    { id: 2, member: "Mike Rodriguez", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-01", status: "paid" },
    { id: 3, member: "Emma Thompson", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-01", status: "paid" },
    { id: 4, member: "James Park", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-01", status: "paid" },
    { id: 5, member: "Lisa Wang", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-01", status: "paid" },
    { id: 6, member: "David Brown", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-01", status: "paid" },
    
    { id: 7, member: "Sarah Chen", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-01", status: "paid" },
    { id: 8, member: "Mike Rodriguez", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-01", status: "paid" },
    { id: 9, member: "Emma Thompson", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-01", status: "paid" },
    { id: 10, member: "James Park", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-01", status: "paid" },
    { id: 11, member: "Lisa Wang", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-01", status: "paid" },
    { id: 12, member: "David Brown", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-01", status: "paid" },
    
    { id: 13, member: "Sarah Chen", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-01", status: "paid" },
    { id: 14, member: "Mike Rodriguez", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-01", status: "pending" },
    { id: 15, member: "Emma Thompson", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-01", status: "paid" },
    { id: 16, member: "James Park", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-01", status: "paid" },
    { id: 17, member: "Lisa Wang", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-01", status: "pending" },
    { id: 18, member: "David Brown", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-01", status: "paid" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalPool = contributions.filter(c => c.status === 'paid').reduce((sum, contribution) => sum + contribution.amount, 0);
  const expectedTotal = contributions.length * 500;
  const currentRound = Math.max(...contributions.map(c => c.round));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Friends Savings Pool</CardTitle>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Collected: {formatCurrency(totalPool)}</span>
          <span>Current Round: {currentRound}</span>
          <span>Expected: {formatCurrency(expectedTotal)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Contribution</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.map((contribution) => (
              <TableRow key={contribution.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contribution.avatar} alt={contribution.member} />
                      <AvatarFallback className="text-xs">
                        {contribution.member.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{contribution.member}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    Round {contribution.round}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(contribution.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(contribution.amount)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={contribution.status === 'paid' ? 'default' : 'secondary'}
                    className={contribution.status === 'paid' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }
                  >
                    {contribution.status}
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

export default GroupSavingsTable;