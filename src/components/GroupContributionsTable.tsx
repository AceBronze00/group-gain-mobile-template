import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Users, TrendingUp, History, Eye, ChevronRight, MapPin } from "lucide-react";

const GroupContributionsTable = () => {
  const [showDetails, setShowDetails] = useState(false);
  
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
  
  const members = [
    { name: "Sarah Chen", avatar: "/placeholder.svg", totalContributed: 1500, missedPayments: 0, position: 1 },
    { name: "Mike Rodriguez", avatar: "/placeholder.svg", totalContributed: 1500, missedPayments: 0, position: 2 },
    { name: "Emma Thompson", avatar: "/placeholder.svg", totalContributed: 1500, missedPayments: 0, position: 3 },
    { name: "James Park", avatar: "/placeholder.svg", totalContributed: 1000, missedPayments: 1, position: 4 },
    { name: "Lisa Wang", avatar: "/placeholder.svg", totalContributed: 1500, missedPayments: 0, position: 5 },
    { name: "David Brown", avatar: "/placeholder.svg", totalContributed: 1000, missedPayments: 1, position: 6 },
  ];

  const membersList = [...new Set(contributions.map(c => c.member))];

  const getRoundStatus = (round: number) => {
    const roundContributions = contributions.filter(c => c.round === round);
    const completedCount = roundContributions.filter(c => c.status === 'completed').length;
    if (completedCount === 6) return 'completed';
    if (completedCount > 0) return 'in-progress';
    return 'pending';
  };

  return (
    <>
      {/* Compact Card View */}
      <Card 
        className="p-5 bg-white/90 backdrop-blur-sm border-0 shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-102 hover:shadow-xl rounded-2xl"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-lg text-gray-800 mb-1 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-500" />
              Weekend Getaway Fund
            </h4>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {membersList.length} members
              </p>
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 rounded-full px-3 py-1">
                Active
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-800">
              {formatCurrency(totalContributions)}
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 mt-1 ml-auto" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="font-bold text-purple-600">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-gray-100" />
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
              <span className="font-medium">Next: Round {completedRounds + 1}</span>
            </div>
            <span className="text-xs text-gray-500">
              {completedRounds}/{totalRounds} rounds completed
            </span>
          </div>
        </div>
      </Card>

      {/* Detailed Modal View */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <MapPin className="h-6 w-6 mr-2 text-purple-500" />
              Weekend Getaway Fund
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Members
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center text-blue-600 mb-2">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">Active Members</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">{membersList.length}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center text-green-600 mb-2">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">Completed Rounds</span>
                    </div>
                    <div className="text-2xl font-bold text-green-800">{completedRounds}/{totalRounds}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center text-purple-600 mb-2">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800">{Math.round(progressPercentage)}%</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">Group Progress</h3>
                      <span className="text-sm font-bold text-purple-600">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3 bg-gray-100" />
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Next Milestone</h4>
                    <p className="text-sm text-gray-600">Complete Round 3 to unlock the weekend getaway planning phase!</p>
                    <div className="mt-3 text-xs text-gray-500">
                      Expected completion: March 15, 2024
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <div className="space-y-4">
                  {members.map((member, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-sm bg-purple-100 text-purple-600">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-800">{member.name}</h4>
                            <p className="text-sm text-gray-600">Position #{member.position}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(member.totalContributed)}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant={member.missedPayments === 0 ? "default" : "secondary"}
                              className={member.missedPayments === 0 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                              }
                            >
                              {member.missedPayments === 0 ? "On Track" : `${member.missedPayments} Missed`}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
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
                              <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
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
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupContributionsTable;