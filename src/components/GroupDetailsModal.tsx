import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GroupMember {
  id: number;
  name: string;
  avatar: string;
  trustScore: number;
  position: number;
  hasReceived: boolean;
  hasPaid: boolean;
  joinedDate: string;
}

interface GroupDetailsModalProps {
  group: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GroupDetailsModal = ({ group, open, onOpenChange }: GroupDetailsModalProps) => {
  const { toast } = useToast();

  // Mock members data
  const members: GroupMember[] = [
    {
      id: 1,
      name: "You",
      avatar: "/placeholder.svg",
      trustScore: 85,
      position: group.position,
      hasReceived: false,
      hasPaid: true,
      joinedDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah M.",
      avatar: "/placeholder.svg",
      trustScore: 92,
      position: 1,
      hasReceived: true,
      hasPaid: true,
      joinedDate: "2024-01-10"
    },
    {
      id: 3,
      name: "Mike J.",
      avatar: "/placeholder.svg",
      trustScore: 78,
      position: 2,
      hasReceived: true,
      hasPaid: true,
      joinedDate: "2024-01-12"
    },
    {
      id: 4,
      name: "Emma D.",
      avatar: "/placeholder.svg",
      trustScore: 88,
      position: 4,
      hasReceived: false,
      hasPaid: true,
      joinedDate: "2024-01-18"
    },
    {
      id: 5,
      name: "James W.",
      avatar: "/placeholder.svg",
      trustScore: 71,
      position: 5,
      hasReceived: false,
      hasPaid: false,
      joinedDate: "2024-01-20"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDaysUntilPayout = (date: string) => {
    const today = new Date();
    const payoutDate = new Date(date);
    const diffTime = payoutDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const copyInviteCode = () => {
    if (group.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {group.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-96">
            <TabsContent value="overview" className="space-y-4">
              {/* Group Stats */}
              <Card className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-bold">{formatCurrency(group.totalAmount)}</div>
                    <div className="text-xs text-gray-500">Pool Amount</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-lg font-bold">{group.members}</div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                </div>
              </Card>

              {/* Next Payout */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Next Payout</h4>
                  <Badge variant={group.myTurn ? "default" : "secondary"}>
                    {group.myTurn ? "Your Turn" : `${getDaysUntilPayout(group.nextPayout)} days`}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Recipient: {group.payoutRecipient}</span>
                    <span>{new Date(group.nextPayout).toLocaleDateString()}</span>
                  </div>
                  <Progress value={group.progress} className="h-2" />
                  <div className="text-xs text-gray-500 text-center">
                    {group.progress}% collected
                  </div>
                </div>
              </Card>

              {/* Your Position */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Your Position</h4>
                    <p className="text-sm text-gray-600">
                      You're #{group.position} in the payout queue
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">#{group.position}</div>
                    <div className="text-xs text-gray-500">of {group.members}</div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-3">
              {/* Payment Summary */}
              <Card className="p-3 bg-muted/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">This Cycle</span>
                  <span className="text-sm text-muted-foreground">
                    {members.filter(m => m.hasPaid).length} of {members.length} paid
                  </span>
                </div>
                <Progress 
                  value={(members.filter(m => m.hasPaid).length / members.length) * 100} 
                  className="h-2 mt-2" 
                />
              </Card>

              {members
                .sort((a, b) => {
                  // Members who received payout go to the bottom
                  if (a.hasReceived && !b.hasReceived) return 1;
                  if (!a.hasReceived && b.hasReceived) return -1;
                  // Among remaining, sort by position (next to receive at top)
                  return a.position - b.position;
                })
                .map((member) => (
                  <Card key={member.id} className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-blue-500 text-white text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {member.hasReceived && (
                          <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{member.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            #{member.position}
                          </Badge>
                        </div>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <div className="flex items-center">
                            <Shield className="h-3 w-3 text-blue-500 mr-1" />
                            <span className={`text-xs ${getTrustScoreColor(member.trustScore)}`}>
                              Trust: {member.trustScore}
                            </span>
                          </div>
                          {/* Payment Status */}
                          {member.hasPaid ? (
                            <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {/* Payout Status */}
                          {member.hasReceived && (
                            <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Received Payout
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="history" className="space-y-3">
              <Card className="p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Sarah M. received payout</p>
                    <p className="text-xs text-gray-500">March 15, 2024</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(group.totalAmount)}
                  </span>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">Mike J. received payout</p>
                    <p className="text-xs text-gray-500">March 8, 2024</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(group.totalAmount)}
                  </span>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Group created</p>
                    <p className="text-xs text-gray-500">January 10, 2024</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-3">
              {/* Group Info */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  Group Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Start Date</span>
                    <span className="text-sm font-medium">
                      {group.startDate ? new Date(group.startDate).toLocaleDateString() : 'Not started'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">End Date</span>
                    <span className="text-sm font-medium">
                      {group.endDate ? new Date(group.endDate).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Frequency</span>
                    <Badge variant="secondary" className="capitalize">
                      {group.frequency || 'Monthly'}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Cycle Info */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">
                  Cycle Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cycle Status</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-medium">
                        Cycle {group.currentCycle || 1}/{group.totalCycles || 2}
                      </Badge>
                      <Badge variant="outline" className="font-medium">
                        Round {group.currentRound || 1}/{group.roundsPerCycle || group.members || 5}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contribution</span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(group.contributionAmount || 0)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Invite Code - Admin Only */}
              {group.isAdmin && (
                <Card className="p-4 border-primary/20 bg-primary/5">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    Admin: Invite Code
                  </h4>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-background px-3 py-2 rounded-md text-sm font-mono border">
                      {group.inviteCode || 'N/A'}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyInviteCode}
                      disabled={!group.inviteCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share this code with others to invite them to join
                  </p>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetailsModal;
