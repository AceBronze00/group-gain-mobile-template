import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
  RefreshCw,
  Trash2,
  Crown,
  Trophy,
  PauseCircle,
  PlayCircle,
  Vote,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import RoundDetailsModal from "./RoundDetailsModal";

interface GroupMember {
  id: number;
  name: string;
  avatar: string;
  trustScore: number;
  position: number;
  hasReceived: boolean;
  hasPaid: boolean;
  joinedDate: string;
  payoutsReceived: number;
  payoutsExpected: number;
  isUpNext?: boolean;
}

interface GroupDetailsModalProps {
  group: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GroupDetailsModal = ({ group, open, onOpenChange }: GroupDetailsModalProps) => {
  const { toast } = useToast();
  const { deleteGroup, setNestPaused, startDeletionVote: startVote, castDeletionVote, startPauseVote, castPauseVote } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRoundDetails, setShowRoundDetails] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);
  const [pauseVoteOpen, setPauseVoteOpen] = useState(false);

  const isPaused = !!group.isPaused;
  const voteActive = !!group.deletionVote?.active;
  const yesVotes = group.deletionVote?.yes ?? 0;
  const noVotes = group.deletionVote?.no ?? 0;
  const hasVoted = !!group.deletionVote?.hasVoted;

  const pauseVoteActive = !!group.pauseVote?.active;
  const pauseYes = group.pauseVote?.yes ?? 0;
  const pauseNo = group.pauseVote?.no ?? 0;
  const hasVotedPause = !!group.pauseVote?.hasVoted;

  const handleTogglePause = () => {
    if (isPaused) {
      setNestPaused(group.id, false);
    } else if (!pauseVoteActive) {
      startPauseVote(group.id);
      setPauseVoteOpen(true);
    } else {
      setPauseVoteOpen(true);
    }
  };
  const startDeletionVote = () => { startVote(group.id); setVoteOpen(true); };
  const castVote = (approve: boolean) => castDeletionVote(group.id, approve);
  const castPause = (approve: boolean) => castPauseVote(group.id, approve);

  const handleDeleteGroup = () => {
    deleteGroup(group.id);
    onOpenChange(false);
  };

  // Mock members data — payoutsExpected is how many times each member is scheduled
  // to receive a payout across all rounds (e.g., total rounds / members)
  const members: GroupMember[] = [
    {
      id: 1,
      name: "You",
      avatar: "/placeholder.svg",
      trustScore: 85,
      position: group.position,
      hasReceived: false,
      hasPaid: true,
      joinedDate: "2024-01-15",
      payoutsReceived: 0,
      payoutsExpected: 2,
    },
    {
      id: 2,
      name: "Sarah M.",
      avatar: "/placeholder.svg",
      trustScore: 92,
      position: 1,
      hasReceived: true,
      hasPaid: true,
      joinedDate: "2024-01-10",
      payoutsReceived: 2,
      payoutsExpected: 2,
    },
    {
      id: 3,
      name: "Mike J.",
      avatar: "/placeholder.svg",
      trustScore: 78,
      position: 2,
      hasReceived: true,
      hasPaid: true,
      joinedDate: "2024-01-12",
      payoutsReceived: 1,
      payoutsExpected: 2,
      isUpNext: true,
    },
    {
      id: 4,
      name: "Emma D.",
      avatar: "/placeholder.svg",
      trustScore: 88,
      position: 4,
      hasReceived: false,
      hasPaid: true,
      joinedDate: "2024-01-18",
      payoutsReceived: 0,
      payoutsExpected: 2,
    },
    {
      id: 5,
      name: "James W.",
      avatar: "/placeholder.svg",
      trustScore: 71,
      position: 5,
      hasReceived: false,
      hasPaid: false,
      joinedDate: "2024-01-20",
      payoutsReceived: 0,
      payoutsExpected: 2,
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

        {/* Member-visible status banners */}
        {(isPaused || voteActive || pauseVoteActive) && (
          <div className="space-y-2">
            {isPaused && (
              <Card className="p-3 border-amber-300 bg-amber-50">
                <div className="flex items-center gap-2">
                  <PauseCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800">Nest is paused</p>
                    <p className="text-xs text-amber-700">
                      The admin has temporarily suspended contributions and payouts.
                    </p>
                  </div>
                </div>
              </Card>
            )}
            {pauseVoteActive && (
              <Card className="p-3 border-amber-300 bg-amber-50">
                <div className="flex items-start gap-2">
                  <Vote className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-800">
                      {group.pauseVote?.requestedBy && group.pauseVote.requestedBy !== "You"
                        ? `${group.pauseVote.requestedBy} requested a pause vote`
                        : "Pause vote in progress"}
                    </p>
                    <p className="text-xs text-amber-700">
                      {pauseYes} pause · {pauseNo} keep active · {pauseYes + pauseNo}/{group.members} voted
                      {group.pauseVote?.requestedAt && (
                        <> · {new Date(group.pauseVote.requestedAt).toLocaleString()}</>
                      )}
                    </p>
                    {hasVotedPause && (
                      <p className="text-xs text-amber-800 mt-1">✓ Your vote has been recorded</p>
                    )}
                  </div>
                  <Button size="sm" onClick={() => setPauseVoteOpen(true)}>
                    {hasVotedPause ? "View" : "Vote"}
                  </Button>
                </div>
              </Card>
            )}
            {voteActive && (
              <Card className="p-3 border-primary/30 bg-primary/5">
                <div className="flex items-start gap-2">
                  <Vote className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">
                      {group.deletionVote?.requestedBy && group.deletionVote.requestedBy !== "You"
                        ? `${group.deletionVote.requestedBy} requested a deletion vote`
                        : "Deletion vote in progress"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {yesVotes} delete · {noVotes} keep · {yesVotes + noVotes}/{group.members} voted
                      {group.deletionVote?.requestedAt && (
                        <> · {new Date(group.deletionVote.requestedAt).toLocaleString()}</>
                      )}
                    </p>
                    {hasVoted && (
                      <p className="text-xs text-primary mt-1">✓ Your vote has been recorded</p>
                    )}
                  </div>
                  <Button size="sm" onClick={() => setVoteOpen(true)}>
                    {hasVoted ? "View" : "Vote"}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

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
              {/* Payment Summary - clickable to open Round Details */}
              <Card
                className="p-3 bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setShowRoundDetails(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowRoundDetails(true);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">This Round</span>
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
                  // 1. "Up Next" member at the very top
                  if (a.isUpNext && !b.isUpNext) return -1;
                  if (!a.isUpNext && b.isUpNext) return 1;
                  // 2. Members who finished all their payouts go to the bottom
                  const aDone = a.payoutsReceived >= a.payoutsExpected;
                  const bDone = b.payoutsReceived >= b.payoutsExpected;
                  if (aDone && !bDone) return 1;
                  if (!aDone && bDone) return -1;
                  // 3. Otherwise sort by queue position
                  return a.position - b.position;
                })
                .map((member) => {
                  const allPayoutsDone = member.payoutsReceived >= member.payoutsExpected;
                  return (
                  <Card
                    key={member.id}
                    className={`p-3 ${member.isUpNext ? "border-2 border-primary bg-primary/5" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-blue-500 text-white text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {member.isUpNext && (
                          <Crown className="absolute -top-1 -right-1 h-4 w-4 text-primary bg-background rounded-full p-0.5" />
                        )}
                        {!member.isUpNext && allPayoutsDone && (
                          <Trophy className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full p-0.5" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold flex items-center gap-2">
                            {member.name}
                            {member.isUpNext && (
                              <Badge className="text-[10px] bg-primary text-primary-foreground hover:bg-primary">
                                UP NEXT
                              </Badge>
                            )}
                          </h4>
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
                          {/* Payout count */}
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              allPayoutsDone
                                ? "bg-green-100 text-green-700 border-green-300"
                                : member.payoutsReceived > 0
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "text-muted-foreground"
                            }`}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Payouts: {member.payoutsReceived}/{member.payoutsExpected}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                  );
                })}
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

              {/* Round Info */}
              <Card className="p-4">
                <h4 className="font-semibold mb-3">
                  Round Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Round Status</span>
                    <Badge variant="secondary" className="font-medium">
                      Round {group.currentRound || 1} of {group.totalRounds || group.members || 5}
                    </Badge>
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

              {/* Delete Nest - Admin Only */}
              {group.isAdmin && (
                <Card className="p-4 border-destructive/30 bg-destructive/5">
                  <h4 className="font-semibold mb-2 text-destructive flex items-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Danger Zone
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Pausing requires a majority member vote. You can also start a deletion vote or permanently delete this nest.
                  </p>
                  {isPaused && (
                    <Badge variant="outline" className="mb-3 text-amber-600 border-amber-300">
                      <PauseCircle className="h-3 w-3 mr-1" />
                      Nest is currently paused
                    </Badge>
                  )}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTogglePause}
                      className="w-full"
                    >
                      {isPaused ? (
                        <><PlayCircle className="h-4 w-4 mr-2" />Resume Nest</>
                      ) : pauseVoteActive ? (
                        <><Vote className="h-4 w-4 mr-2" />View Pause Vote</>
                      ) : (
                        <><PauseCircle className="h-4 w-4 mr-2" />Start Pause Vote</>
                      )}
                    </Button>
                    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Nest
                    </Button>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{group.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this nest and all associated data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteGroup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => (voteActive ? setVoteOpen(true) : startDeletionVote())}
                  >
                    <Vote className="h-4 w-4 mr-2" />
                    {voteActive ? "View Deletion Vote" : "Start Deletion Vote"}
                  </Button>
                </Card>
              )}

              {/* Member Actions - non-admins */}
              {!group.isAdmin && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Vote className="h-4 w-4 mr-2 text-primary" />
                    Member Actions
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {voteActive
                      ? "A deletion vote is in progress. Cast your vote below."
                      : "If something is wrong, you can request a deletion vote among members."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => (voteActive ? setVoteOpen(true) : startDeletionVote())}
                  >
                    <Vote className="h-4 w-4 mr-2" />
                    {voteActive
                      ? hasVoted ? "View Deletion Vote" : "Cast Your Vote"
                      : "Request Deletion Vote"}
                  </Button>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>

      {(() => {
        const totalRounds = group.totalRounds || group.members || members.length;
        const currentRound = group.currentRound || 1;
        const startDate = group.startDate || group.createdAt || null;

        const frequencyDays =
          group.frequency === "daily" ? 1
          : group.frequency === "biweekly" ? 14
          : group.frequency === "monthly" ? 30
          : 7;

        const baseDate = startDate ? new Date(startDate) : new Date();
        const orderedMembers = [...members].sort((a, b) => a.position - b.position);

        const rounds = Array.from({ length: totalRounds }, (_, i) => {
          const roundNumber = i + 1;
          const recipient = orderedMembers[i % orderedMembers.length];
          const scheduled = new Date(baseDate.getTime() + i * frequencyDays * 24 * 60 * 60 * 1000);
          const status: "scheduled" | "active" | "completed" =
            roundNumber < currentRound ? "completed"
            : roundNumber === currentRound ? "active"
            : "scheduled";
          return {
            roundNumber,
            recipientName: recipient?.name ?? "—",
            recipientAvatar: recipient?.avatar ?? "/placeholder.svg",
            scheduledDate: scheduled.toISOString(),
            actualDate: status === "completed" ? scheduled.toISOString() : null,
            status,
          };
        });

        return (
          <RoundDetailsModal
            open={showRoundDetails}
            onOpenChange={setShowRoundDetails}
            groupName={group.name}
            startDate={startDate}
            totalRounds={totalRounds}
            rounds={rounds}
          />
        );
      })()}

      <AlertDialog open={voteOpen} onOpenChange={setVoteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Vote className="h-5 w-5 mr-2 text-primary" />
              Vote to Delete "{group.name}"
            </AlertDialogTitle>
            <AlertDialogDescription>
              Members vote on whether this nest should be deleted. A majority is required to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <ThumbsUp className="h-5 w-5 mx-auto text-destructive mb-1" />
                <div className="text-2xl font-bold">{yesVotes}</div>
                <div className="text-xs text-muted-foreground">Delete</div>
              </Card>
              <Card className="p-3 text-center">
                <ThumbsDown className="h-5 w-5 mx-auto text-green-600 mb-1" />
                <div className="text-2xl font-bold">{noVotes}</div>
                <div className="text-xs text-muted-foreground">Keep</div>
              </Card>
            </div>

            <div className="text-xs text-center text-muted-foreground">
              {yesVotes + noVotes} of {group.members} members have voted
            </div>

            {!hasVoted ? (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="destructive" size="sm" onClick={() => castVote(true)}>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Vote Delete
                </Button>
                <Button variant="outline" size="sm" onClick={() => castVote(false)}>
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Vote Keep
                </Button>
              </div>
            ) : (
              <p className="text-xs text-center text-muted-foreground">
                Your vote has been recorded.
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default GroupDetailsModal;
