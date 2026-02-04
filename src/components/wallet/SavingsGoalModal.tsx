import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Target, Edit2, Sparkles, TrendingUp, Users, CheckCircle, Flame, Clock, Calendar } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from "@/components/ui/slider";

interface SavingsGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TIMEFRAME_OPTIONS = [
  { months: 1, label: '1 month' },
  { months: 3, label: '3 months' },
  { months: 6, label: '6 months' },
  { months: 12, label: '1 year' },
  { months: 24, label: '2 years' },
];

// Animated counter component
const AnimatedNumber = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>${displayValue.toLocaleString()}</span>;
};

// Confetti particle component
const Confetti = () => {
  const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{ 
            left: `${particle.x}%`, 
            top: -10,
            backgroundColor: particle.color,
            rotate: particle.rotation
          }}
          initial={{ y: -10, opacity: 1, scale: 1 }}
          animate={{ 
            y: 400, 
            opacity: [1, 1, 0],
            rotate: particle.rotation + 360,
            x: (Math.random() - 0.5) * 100
          }}
          transition={{ 
            duration: 2 + Math.random(),
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// Animated circular progress ring
const ProgressRing = ({ progress, isComplete }: { progress: number; isComplete: boolean }) => {
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle with gradient */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isComplete ? "url(#successGradient)" : "url(#progressGradient)"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Animated glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full ${isComplete ? 'bg-green-400' : 'bg-purple-400'} opacity-20 blur-xl`}
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
};

const SavingsGoalModal = ({ open, onOpenChange }: SavingsGoalModalProps) => {
  const { savingsGoal, updateSavingsGoal, walletEntries } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(savingsGoal.name || 'My Savings Goal');
  const [editAmount, setEditAmount] = useState(savingsGoal.targetAmount.toString());
  const [editTimeframe, setEditTimeframe] = useState(savingsGoal.timeframeMonths || 12);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalSavedFromGroups = walletEntries.reduce((total, entry) => total + entry.amount, 0);
  
  const groupBreakdown = walletEntries.map(entry => ({
    name: entry.groupName,
    amount: entry.amount,
    date: new Date(entry.receivedDate).toLocaleDateString()
  }));

  const sortedEntries = [...walletEntries].sort((a, b) => 
    new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime()
  );
  
  let cumulativeAmount = 0;
  const savingsHistory = sortedEntries.map(entry => {
    cumulativeAmount += entry.amount;
    return {
      date: new Date(entry.receivedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: cumulativeAmount,
      group: entry.groupName
    };
  });

  if (savingsHistory.length > 0) {
    savingsHistory.unshift({ date: 'Start', amount: 0, group: '' });
  }

  const goalAmount = savingsGoal.targetAmount;
  const progress = goalAmount > 0 ? Math.min((totalSavedFromGroups / goalAmount) * 100, 100) : 0;
  const remaining = Math.max(goalAmount - totalSavedFromGroups, 0);
  const isComplete = progress >= 100;

  // Calculate time-related metrics
  const getTimeToGoal = () => {
    if (isComplete) return { text: "Goal reached!", subtext: "Congratulations!" };
    if (walletEntries.length < 2 || remaining <= 0) return { text: "Keep saving!", subtext: "More data needed" };
    
    // Calculate average monthly savings rate
    const sortedDates = walletEntries.map(e => new Date(e.receivedDate).getTime()).sort((a, b) => a - b);
    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];
    const monthsElapsed = Math.max((lastDate - firstDate) / (1000 * 60 * 60 * 24 * 30), 1);
    const avgMonthlyRate = totalSavedFromGroups / monthsElapsed;
    
    if (avgMonthlyRate <= 0) return { text: "Keep saving!", subtext: "More data needed" };
    
    const monthsToGoal = Math.ceil(remaining / avgMonthlyRate);
    
    if (monthsToGoal >= 12) {
      const years = Math.floor(monthsToGoal / 12);
      const months = monthsToGoal % 12;
      return { 
        text: months > 0 ? `~${years}y ${months}mo` : `~${years} year${years > 1 ? 's' : ''}`,
        subtext: "estimated"
      };
    }
    return { text: `~${monthsToGoal} month${monthsToGoal > 1 ? 's' : ''}`, subtext: "estimated" };
  };

  const getTargetDate = () => {
    if (!savingsGoal.startDate || !savingsGoal.timeframeMonths) return null;
    const start = new Date(savingsGoal.startDate);
    start.setMonth(start.getMonth() + savingsGoal.timeframeMonths);
    return start;
  };

  const getTimeRemaining = () => {
    const target = getTargetDate();
    if (!target) return null;
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    if (diffMs <= 0) return { text: "Deadline passed", urgent: true };
    
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      return { text: `${months} month${months > 1 ? 's' : ''} left`, urgent: false };
    }
    return { text: `${diffDays} day${diffDays > 1 ? 's' : ''} left`, urgent: diffDays <= 7 };
  };

  const timeToGoal = getTimeToGoal();
  const timeRemaining = getTimeRemaining();

  // Trigger confetti on goal completion
  useEffect(() => {
    if (isComplete && open) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, open]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSave = () => {
    const amount = parseFloat(editAmount) || 0;
    if (amount > 0 && editName.trim()) {
      updateSavingsGoal(editName.trim(), amount, editTimeframe);
      setIsEditing(false);
    }
  };

  const getTimeframeLabel = (months: number) => {
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;
    if (months === 12) return '1 year';
    const years = months / 12;
    return years === Math.floor(years) ? `${years} years` : `${months} months`;
  };

  const hasGoal = goalAmount > 0;

  const getMotivationalMessage = () => {
    if (isComplete) return { emoji: "🎉", text: "You crushed it! Time for a new goal?" };
    if (progress >= 75) return { emoji: "🔥", text: "So close! You're on fire!" };
    if (progress >= 50) return { emoji: "💪", text: "Halfway there! Keep pushing!" };
    if (progress >= 25) return { emoji: "🚀", text: "Great momentum! Keep it up!" };
    return { emoji: "🌱", text: "Every journey starts with a single step!" };
  };

  const motivation = getMotivationalMessage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {showConfetti && <Confetti />}
        
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Target className="h-5 w-5 text-purple-600" />
            </motion.div>
            <span>Savings Goal</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <AnimatePresence mode="wait">
            {!hasGoal || isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Flame className="h-4 w-4 mr-2 text-orange-500" />
                    </motion.div>
                    {hasGoal ? 'Edit Goal' : 'Set Your Savings Goal'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="goalName">Goal Name</Label>
                      <Input
                        id="goalName"
                        placeholder="e.g., Emergency Fund, Vacation"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="goalAmount">Target Amount ($)</Label>
                      <Input
                        id="goalAmount"
                        type="number"
                        placeholder="500"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Timeframe: {getTimeframeLabel(editTimeframe)}
                      </Label>
                      <div className="pt-3 pb-2 px-1">
                        <Slider
                          value={[editTimeframe]}
                          onValueChange={(value) => setEditTimeframe(value[0])}
                          min={1}
                          max={24}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 mo</span>
                        <span>6 mo</span>
                        <span>1 yr</span>
                        <span>2 yrs</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-700">
                        {hasGoal ? 'Update Goal' : 'Set Goal'}
                      </Button>
                      {hasGoal && (
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="display"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-5"
              >
                {/* Interactive Circular Progress */}
                <Card className={`p-4 relative overflow-hidden ${isComplete ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800">{savingsGoal.name}</h3>
                      <p className="text-xs text-gray-500">Personal Savings Goal</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* Animated Progress Ring */}
                  <div className="flex justify-center py-4">
                    <div className="relative">
                      <ProgressRing progress={progress} isComplete={isComplete} />
                      {/* Center Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                          className="text-center"
                        >
                          <p className={`text-3xl font-bold ${isComplete ? 'text-green-600' : 'text-purple-600'}`}>
                            {Math.round(progress)}%
                          </p>
                          <p className="text-xs text-gray-500">saved</p>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row with animated numbers */}
                  <div className="flex justify-between mt-2 px-2">
                    {[
                      { label: 'Saved', value: totalSavedFromGroups },
                      { label: 'Goal', value: goalAmount },
                      { label: 'Left', value: remaining }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-center"
                      >
                        <p className="text-lg font-bold text-foreground">
                          <AnimatedNumber value={stat.value} />
                        </p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Time-based metrics */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/60 rounded-lg p-3 text-center border border-border"
                    >
                      <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-bold text-foreground">{timeToGoal.text}</p>
                      <p className="text-xs text-muted-foreground">{timeToGoal.subtext}</p>
                    </motion.div>
                    
                    {timeRemaining && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className={`bg-white/60 rounded-lg p-3 text-center border ${timeRemaining.urgent ? 'border-destructive' : 'border-border'}`}
                      >
                        <Calendar className="h-4 w-4 mx-auto mb-1 text-primary" />
                        <p className={`text-sm font-bold ${timeRemaining.urgent ? 'text-destructive' : 'text-foreground'}`}>
                          {timeRemaining.text}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getTimeframeLabel(savingsGoal.timeframeMonths)} goal
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Motivational Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className={`mt-4 text-center py-3 rounded-lg ${isComplete ? 'bg-green-100' : 'bg-purple-100'}`}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      className="inline-block mr-2 text-xl"
                    >
                      {motivation.emoji}
                    </motion.span>
                    <span className={`text-sm font-medium ${isComplete ? 'text-green-700' : 'text-purple-700'}`}>
                      {motivation.text}
                    </span>
                  </motion.div>
                </Card>

                {/* Group Contributions with staggered animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    Savings from Nests
                  </h4>
                  
                  {groupBreakdown.length > 0 ? (
                    <div className="space-y-2">
                      {groupBreakdown.map((group, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <Card className="p-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800">{group.name}</p>
                                <p className="text-xs text-gray-500">Received {group.date}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </motion.div>
                                <span className="font-semibold text-green-600">{formatCurrency(group.amount)}</span>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="p-4 bg-gray-50 text-center">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="py-4"
                        >
                          <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 font-medium">No payouts yet</p>
                          <p className="text-xs text-gray-500 mt-1">Keep contributing to your nests to start saving!</p>
                        </motion.div>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavingsGoalModal;
