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
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, TrendingUp } from "lucide-react";

const GroupContributionsTable = () => {
  const contributions = [
    { id: 1, member: "Sarah Chen", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-05", status: "completed", position: 1 },
    { id: 2, member: "Mike Rodriguez", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-05", status: "completed", position: 2 },
    { id: 3, member: "Emma Thompson", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-05", status: "completed", position: 3 },
    { id: 4, member: "James Park", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-05", status: "completed", position: 4 },
    { id: 5, member: "Lisa Wang", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-05", status: "completed", position: 5 },
    { id: 6, member: "David Brown", avatar: "/placeholder.svg", round: 1, amount: 500, date: "2024-01-05", status: "completed", position: 6 },
    
    { id: 7, member: "Sarah Chen", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-05", status: "completed", position: 1 },
    { id: 8, member: "Mike Rodriguez", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-05", status: "completed", position: 2 },
    { id: 9, member: "Emma Thompson", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-05", status: "completed", position: 3 },
    { id: 10, member: "James Park", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-05", status: "completed", position: 4 },
    { id: 11, member: "Lisa Wang", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-05", status: "completed", position: 5 },
    { id: 12, member: "David Brown", avatar: "/placeholder.svg", round: 2, amount: 500, date: "2024-02-05", status: "completed", position: 6 },
    
    { id: 13, member: "Sarah Chen", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-05", status: "pending", position: 1 },
    { id: 14, member: "Mike Rodriguez", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-05", status: "completed", position: 2 },
    { id: 15, member: "Emma Thompson", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-05", status: "completed", position: 3 },
    { id: 16, member: "James Park", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-05", status: "pending", position: 4 },
    { id: 17, member: "Lisa Wang", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-05", status: "completed", position: 5 },
    { id: 18, member: "David Brown", avatar: "/placeholder.svg", round: 3, amount: 500, date: "2024-03-05", status: "pending", position: 6 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalContributions = contributions.filter(c => c.status === 'completed').length * 500;
  const totalRounds = 6;
  const completedRounds = 2;
  const progressPercentage = (completedRounds / totalRounds) * 100;
  
  const members = [...new Set(contributions.map(c => c.member))];

  const getRoundStatus = (round: number) => {
    const roundContributions = contributions.filter(c => c.round === round);
    const completedCount = roundContributions.filter(c => c.status === 'completed').length;
    if (completedCount === 6) return 'completed';
    if (completedCount > 0) return 'in-progress';
    return 'pending';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-500" />
              Weekend Getaway Fund
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Monthly contributions for weekend getaway fund</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalContributions)}</div>
            <p className="text-xs text-gray-500">Total Collected</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center text-blue-600 mb-1">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Members</span>
            </div>
            <div className="text-lg font-bold text-blue-800">{members.length}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center text-green-600 mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Rounds</span>
            </div>
            <div className="text-lg font-bold text-green-800">{completedRounds}/{totalRounds}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center text-purple-600 mb-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Progress</span>
            </div>
            <div className="text-lg font-bold text-purple-800">{Math.round(progressPercentage)}%</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Group Progress</span>
            <span className="text-sm font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-gray-100" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Round</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.map((contribution) => (
              <TableRow key={contribution.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contribution.avatar} alt={contribution.member} />
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                        {contribution.member.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{contribution.member}</div>
                      <div className="text-xs text-gray-500">Position #{contribution.position}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`rounded-full text-xs ${
                        getRoundStatus(contribution.round) === 'completed' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : getRoundStatus(contribution.round) === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      Round {contribution.round}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(contribution.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(contribution.amount)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={contribution.status === 'completed' ? 'default' : 'secondary'}
                    className={contribution.status === 'completed' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }
                  >
                    {contribution.status === 'completed' ? 'Paid' : 'Pending'}
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

export default GroupContributionsTable;