import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { format, addDays, addWeeks, addMonths, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Bell
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  avatar: string;
  status: "paid" | "unpaid" | "late";
  paymentDate?: Date;
}

interface FinancialRulesProps {
  groupId?: string;
  isAdmin?: boolean;
}

const FinancialRulesPage = ({ groupId, isAdmin = true }: FinancialRulesProps) => {
  // Form state
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "biweekly" | "monthly">("weekly");
  const [startDate, setStartDate] = useState<Date>();
  const [contributionAmount, setContributionAmount] = useState("100");
  const [gracePeriodEnabled, setGracePeriodEnabled] = useState(false);
  const [gracePeriodHours, setGracePeriodHours] = useState("12");
  const [autoRemindersEnabled, setAutoRemindersEnabled] = useState(true);

  // Simulation state
  const [currentCycleStart, setCurrentCycleStart] = useState(new Date());
  const [nextDueDate, setNextDueDate] = useState(new Date());
  const [nextPayoutDate, setNextPayoutDate] = useState(new Date());
  const [currentRecipient, setCurrentRecipient] = useState("Sarah Chen");

  // Mock members data
  const [members] = useState<Member[]>([
    { id: "1", name: "John Doe", avatar: "/placeholder.svg", status: "paid", paymentDate: new Date() },
    { id: "2", name: "Sarah Chen", avatar: "/placeholder.svg", status: "paid", paymentDate: new Date() },
    { id: "3", name: "Mike Johnson", avatar: "/placeholder.svg", status: "unpaid" },
    { id: "4", name: "Emily Davis", avatar: "/placeholder.svg", status: "late" },
    { id: "5", name: "Alex Wang", avatar: "/placeholder.svg", status: "paid", paymentDate: new Date() },
  ]);

  // Calculate next dates based on frequency
  const calculateNextDates = (start: Date, freq: string) => {
    let nextDue: Date;
    switch (freq) {
      case "daily":
        nextDue = addDays(start, 1);
        break;
      case "weekly":
        nextDue = addWeeks(start, 1);
        break;
      case "biweekly":
        nextDue = addWeeks(start, 2);
        break;
      case "monthly":
        nextDue = addMonths(start, 1);
        break;
      default:
        nextDue = addWeeks(start, 1);
    }
    const nextPayout = addDays(nextDue, 1);
    return { nextDue, nextPayout };
  };

  // Update dates when frequency or start date changes
  useEffect(() => {
    if (startDate) {
      const { nextDue, nextPayout } = calculateNextDates(startDate, frequency);
      setNextDueDate(nextDue);
      setNextPayoutDate(nextPayout);
    }
  }, [frequency, startDate]);

  // Countdown timer
  const getTimeRemaining = (targetDate: Date) => {
    const now = new Date();
    const diffInMs = targetDate.getTime() - now.getTime();
    
    if (diffInMs <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };
    
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes, expired: false };
  };

  const [timeUntilDue, setTimeUntilDue] = useState(getTimeRemaining(nextDueDate));
  const [timeUntilPayout, setTimeUntilPayout] = useState(getTimeRemaining(nextPayoutDate));

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilDue(getTimeRemaining(nextDueDate));
      setTimeUntilPayout(getTimeRemaining(nextPayoutDate));
    }, 60000);

    return () => clearInterval(interval);
  }, [nextDueDate, nextPayoutDate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "late":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: "default",
      unpaid: "secondary",
      late: "destructive"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants]} className="capitalize">
        {status === "paid" ? "✔️ Paid" : status === "unpaid" ? "⚠️ Unpaid" : "❗ Late"}
      </Badge>
    );
  };

  const paidCount = members.filter(m => m.status === "paid").length;
  const progressPercentage = (paidCount / members.length) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <DollarSign className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Financial Rules</h1>
          <p className="text-muted-foreground">Configure contribution frequency, payment rules, and payout settings</p>
        </div>
      </div>

      {/* Contribution Frequency Setup */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Contribution Frequency Setup</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frequency Selection */}
          <div className="space-y-3">
            <Label>Contribution Frequency *</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "biweekly", label: "Biweekly" },
                { value: "monthly", label: "Monthly" }
              ].map((freq) => (
                <Button
                  key={freq.value}
                  variant={frequency === freq.value ? "default" : "outline"}
                  onClick={() => setFrequency(freq.value as any)}
                  disabled={!isAdmin}
                  className="justify-center"
                >
                  {freq.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <Label>Cycle Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!isAdmin}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select start date"}
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
        </div>

        <Separator className="my-4" />

        {/* Contribution Amount */}
        <div className="space-y-3">
          <Label htmlFor="amount">Contribution Amount per Person ($)</Label>
          <Input
            id="amount"
            type="number"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
            disabled={!isAdmin}
            className="max-w-xs"
          />
        </div>
      </Card>

      {/* Current Cycle Status */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Timer className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Current Cycle Status</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Countdown to Next Contribution */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-medium mb-2">Next Contribution Due</h4>
            <div className="text-2xl font-bold text-primary">
              {timeUntilDue.expired ? "Overdue" : `${timeUntilDue.days}d ${timeUntilDue.hours}h ${timeUntilDue.minutes}m`}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {format(nextDueDate, "MMM dd, yyyy 'at' 11:59 PM")}
            </p>
          </div>

          {/* Countdown to Payout */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <h4 className="font-medium mb-2">Next Payout</h4>
            <div className="text-2xl font-bold text-green-500">
              {timeUntilPayout.expired ? "Ready" : `${timeUntilPayout.days}d ${timeUntilPayout.hours}h ${timeUntilPayout.minutes}m`}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              To: {currentRecipient}
            </p>
          </div>

          {/* Progress */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <h4 className="font-medium mb-2">Payment Progress</h4>
            <div className="text-2xl font-bold text-blue-500">
              {paidCount}/{members.length}
            </div>
            <Progress value={progressPercentage} className="mt-2" />
          </div>
        </div>

        {/* Member Status */}
        <div className="space-y-3">
          <h4 className="font-medium">Member Payment Status</h4>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(member.status)}
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {member.paymentDate && (
                    <span className="text-sm text-muted-foreground">
                      {format(member.paymentDate, "MMM dd, HH:mm")}
                    </span>
                  )}
                  {getStatusBadge(member.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Late Payment Rules */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Late Payment Rules</h3>
        </div>

        <div className="space-y-6">
          {/* Grace Period */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Enable Grace Period</Label>
              <p className="text-sm text-muted-foreground">
                Allow extra time for late payments before marking as overdue
              </p>
            </div>
            <Switch
              checked={gracePeriodEnabled}
              onCheckedChange={setGracePeriodEnabled}
              disabled={!isAdmin}
            />
          </div>

          {gracePeriodEnabled && (
            <div className="ml-6 space-y-3">
              <Label>Grace Period Duration</Label>
              <Select value={gracePeriodHours} onValueChange={setGracePeriodHours} disabled={!isAdmin}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Auto Reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Automatic Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Send notification reminders before due dates
              </p>
            </div>
            <Switch
              checked={autoRemindersEnabled}
              onCheckedChange={setAutoRemindersEnabled}
              disabled={!isAdmin}
            />
          </div>

          {/* Late Payment Actions */}
          <div className="space-y-3">
            <Label className="font-medium">When a payment is missed:</Label>
            <div className="space-y-2">
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  <strong>Automatic Actions:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Member status marked as "Late"</li>
                    <li>• Group admin receives notification</li>
                    <li>• Late member receives payment reminder</li>
                    <li>• Admin can choose to delay payout or proceed</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </Card>

      {/* Admin Actions */}
      {isAdmin && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Admin Actions</h3>
          </div>

          <div className="flex gap-3">
            <Button>Save Financial Rules</Button>
            <Button variant="outline">Send Payment Reminder</Button>
            <Button variant="outline">Process Early Payout</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FinancialRulesPage;