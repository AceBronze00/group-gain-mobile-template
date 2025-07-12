import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Play, Users, DollarSign } from "lucide-react";
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

  const handleStartCycle = () => {
    if (!group || !startDate) return;

    toast({
      title: "Cycle Started Successfully",
      description: `The financial cycle for "${group.name}" has been started on ${format(startDate, "PPP")}.`,
    });
    
    onOpenChange(false);
    setStartDate(new Date());
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-500" />
            Start Cycle for {group.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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

          {/* Action Buttons */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartCycleModal;