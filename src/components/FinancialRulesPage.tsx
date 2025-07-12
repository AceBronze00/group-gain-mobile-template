import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Play, Settings, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FinancialRulesPageProps {
  onBack: () => void;
  groupId?: string;
}

const FinancialRulesPage = ({ onBack, groupId }: FinancialRulesPageProps) => {
  const [frequency, setFrequency] = useState<string>("weekly");
  const [startDate, setStartDate] = useState<Date>();
  const [isAutoStart, setIsAutoStart] = useState(false);
  const [cycleActive, setCycleActive] = useState(false);
  const { toast } = useToast();

  const handleStartCycle = () => {
    if (!startDate && isAutoStart) {
      toast({
        title: "Error",
        description: "Please select a start date for automatic start.",
        variant: "destructive",
      });
      return;
    }

    setCycleActive(true);
    toast({
      title: "Cycle Started!",
      description: `The ${frequency} contribution cycle has been activated.`,
    });
  };

  const handleStopCycle = () => {
    setCycleActive(false);
    toast({
      title: "Cycle Stopped",
      description: "The contribution cycle has been deactivated.",
    });
  };

  const getNextContributionDate = () => {
    if (!startDate) return null;
    
    const next = new Date(startDate);
    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'biweekly':
        next.setDate(next.getDate() + 14);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
    }
    return next;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Rules</h1>
          <p className="text-sm text-gray-600">Configure contribution cycles and payment rules</p>
        </div>
      </div>

      {/* Cycle Status */}
      <Card className="border-0 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${cycleActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <CardTitle className="text-lg">Cycle Status</CardTitle>
            </div>
            <Badge variant={cycleActive ? "default" : "secondary"} className={cycleActive ? "bg-green-500" : ""}>
              {cycleActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <CardDescription>
            {cycleActive 
              ? `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} cycle is currently running`
              : "No active contribution cycle"
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Contribution Frequency */}
      <Card className="border-0 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span>Contribution Frequency</span>
          </CardTitle>
          <CardDescription>Select how often members contribute to the pool</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="flex-1 cursor-pointer">
                <div className="font-medium">Daily</div>
                <div className="text-sm text-gray-500">Members contribute every day</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                <div className="font-medium">Weekly</div>
                <div className="text-sm text-gray-500">Members contribute once per week</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="biweekly" id="biweekly" />
              <Label htmlFor="biweekly" className="flex-1 cursor-pointer">
                <div className="font-medium">Biweekly</div>
                <div className="text-sm text-gray-500">Members contribute every two weeks</div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                <div className="font-medium">Monthly</div>
                <div className="text-sm text-gray-500">Members contribute once per month</div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Start Date Configuration */}
      <Card className="border-0 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            <span>Start Date</span>
          </CardTitle>
          <CardDescription>Configure when the first contribution cycle begins</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
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

          {startDate && getNextContributionDate() && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Next contribution due:</strong> {format(getNextContributionDate()!, "PPP")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cycle Start Configuration */}
      <Card className="border-0 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <span>Cycle Start Method</span>
          </CardTitle>
          <CardDescription>Choose how the contribution cycle should begin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              id="auto-start"
              checked={isAutoStart}
              onCheckedChange={setIsAutoStart}
            />
            <Label htmlFor="auto-start" className="flex-1">
              <div className="font-medium">Automatic Start</div>
              <div className="text-sm text-gray-500">
                Cycle begins automatically on the selected start date
              </div>
            </Label>
          </div>
          
          {!isAutoStart && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                <strong>Manual Start:</strong> You can manually trigger the cycle start below
              </p>
            </div>
          )}

          {isAutoStart && startDate && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Automatic Start:</strong> Cycle will begin on {format(startDate, "PPP")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cycle Control */}
      <Card className="border-0 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span>Cycle Control</span>
          </CardTitle>
          <CardDescription>Start or stop the contribution cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!cycleActive ? (
              <Button
                onClick={handleStartCycle}
                disabled={!startDate && isAutoStart}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Cycle
              </Button>
            ) : (
              <Button
                onClick={handleStopCycle}
                variant="destructive"
                className="w-full py-3 rounded-xl"
              >
                Stop Cycle
              </Button>
            )}
            
            {!startDate && isAutoStart && (
              <p className="text-sm text-red-500 text-center">
                Please select a start date before starting an automatic cycle
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialRulesPage;