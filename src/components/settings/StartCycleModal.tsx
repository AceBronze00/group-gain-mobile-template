import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Play, Users, DollarSign, ArrowUpDown, GripVertical, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ActiveGroup {
  id: number;
  name: string;
  members: number;
  totalAmount: number;
  contributionAmount: number;
  frequency: string;
  nextPayout: string;
  payoutRecipient: string;
  progress: number;
  myTurn: boolean;
  position: number;
}

interface StartCycleModalProps {
  group: ActiveGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StartCycleModal = ({ group, open, onOpenChange }: StartCycleModalProps) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [contributionAmount, setContributionAmount] = useState(group?.contributionAmount || 0);
  
  // Mock: in real app, check if any payments have been made
  const hasPaymentsStarted = false; // This would come from backend data
  
  // Mock member data - in real app this would come from group data
  const [payoutOrder, setPayoutOrder] = useState([
    { id: 1, name: "John Doe", position: 1, isCurrentUser: false },
    { id: 2, name: "You", position: 2, isCurrentUser: true },
    { id: 3, name: "Jane Smith", position: 3, isCurrentUser: false },
    { id: 4, name: "Mike Johnson", position: 4, isCurrentUser: false },
  ]);

  const handleStartCycle = () => {
    if (!group || !startDate) return;

    toast({
      title: "Cycle Started Successfully",
      description: `The financial cycle for "${group.name}" has been started on ${format(startDate, "PPP")}.`,
    });
    
    onOpenChange(false);
    setStartDate(new Date());
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...payoutOrder];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    newOrder.forEach((member, i) => member.position = i + 1);
    setPayoutOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === payoutOrder.length - 1) return;
    const newOrder = [...payoutOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    newOrder.forEach((member, i) => member.position = i + 1);
    setPayoutOrder(newOrder);
  };

  const handleOrderChange = () => {
    toast({
      title: "Payout Order Updated",
      description: "All group members have been notified of the order change.",
      action: (
        <div className="flex items-center gap-1 text-xs">
          <Bell className="h-3 w-3" />
          Notifications sent
        </div>
      )
    });
  };

  const handleContributionChange = () => {
    if (!group) return;

    toast({
      title: "Contribution Amount Updated",
      description: `Contribution amount changed from $${group.contributionAmount} to $${contributionAmount}. All members have been notified.`,
      action: (
        <div className="flex items-center gap-1 text-xs">
          <Bell className="h-3 w-3" />
          Notifications sent
        </div>
      )
    });
    
    onOpenChange(false);
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-500" />
            Manage {group.name}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="start" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="start">Start Cycle</TabsTrigger>
            <TabsTrigger value="order">Payout Order</TabsTrigger>
            <TabsTrigger value="settings">Contribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="start" className="space-y-4 mt-4">
            {/* Group Summary */}
            <Card className="p-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{group.members} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>${group.contributionAmount} {group.frequency}</span>
                </div>
              </div>
            </Card>

            {/* Start Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Cycle Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Start Cycle Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStartCycle}
                disabled={!startDate}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Start Cycle
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="order" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payout Order (Emergency Adjustment)</label>
              <p className="text-xs text-gray-600">Drag to reorder or use arrows. All members will be notified.</p>
            </div>

            {/* Payout Order List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {payoutOrder.map((member, index) => (
                <Card key={member.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
                          {member.position}
                        </span>
                        <span className={cn(
                          "text-sm font-medium",
                          member.isCurrentUser && "text-blue-600"
                        )}>
                          {member.name}
                          {member.isCurrentUser && " (You)"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveDown(index)}
                        disabled={index === payoutOrder.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Management Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleOrderChange}
                className="flex-1"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Update Order
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contribution Amount Settings</label>
              <p className="text-xs text-gray-600">
                {hasPaymentsStarted 
                  ? "Cannot change contribution amount after payments have been made."
                  : "Adjust the contribution amount. All members will be notified of changes."
                }
              </p>
            </div>

            {/* Current vs New Amount */}
            <Card className="p-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  <span>Current: ${group.contributionAmount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-green-500" />
                  <span>Frequency: {group.frequency}</span>
                </div>
              </div>
            </Card>

            {/* Contribution Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">New Contribution Amount</label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <Input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(Number(e.target.value))}
                  disabled={hasPaymentsStarted}
                  className="flex-1"
                  min="1"
                  step="1"
                />
              </div>
              {contributionAmount !== group.contributionAmount && !hasPaymentsStarted && (
                <p className="text-xs text-amber-600">
                  This will change the amount from ${group.contributionAmount} to ${contributionAmount}
                </p>
              )}
            </div>

            {/* Contribution Settings Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleContributionChange}
                disabled={hasPaymentsStarted || contributionAmount === group.contributionAmount || contributionAmount < 1}
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Update Amount
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StartCycleModal;