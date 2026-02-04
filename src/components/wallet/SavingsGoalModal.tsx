import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Target, Edit2, Sparkles, TrendingUp, Users, CheckCircle, Flame } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface SavingsGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SavingsGoalModal = ({ open, onOpenChange }: SavingsGoalModalProps) => {
  const { savingsGoal, updateSavingsGoal, walletEntries } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(savingsGoal.name || 'My Savings Goal');
  const [editAmount, setEditAmount] = useState(savingsGoal.targetAmount.toString());

  // Calculate total saved from all groups (payouts received)
  const totalSavedFromGroups = walletEntries.reduce((total, entry) => total + entry.amount, 0);
  
  // Group breakdown
  const groupBreakdown = walletEntries.map(entry => ({
    name: entry.groupName,
    amount: entry.amount,
    date: new Date(entry.receivedDate).toLocaleDateString()
  }));

  // Create cumulative savings data for the area chart
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

  // Add starting point if we have entries
  if (savingsHistory.length > 0) {
    savingsHistory.unshift({ date: 'Start', amount: 0, group: '' });
  }

  const goalAmount = savingsGoal.targetAmount;
  const progress = goalAmount > 0 ? Math.min((totalSavedFromGroups / goalAmount) * 100, 100) : 0;
  const remaining = Math.max(goalAmount - totalSavedFromGroups, 0);
  const isComplete = progress >= 100;

  // Data for circular progress chart
  const circularData = [
    { name: 'Saved', value: Math.min(totalSavedFromGroups, goalAmount), color: isComplete ? '#10b981' : '#8b5cf6' },
    { name: 'Remaining', value: remaining, color: '#e5e7eb' }
  ];

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
      updateSavingsGoal(editName.trim(), amount);
      setIsEditing(false);
    }
  };

  const hasGoal = goalAmount > 0;

  // Motivational messages based on progress
  const getMotivationalMessage = () => {
    if (isComplete) return "🎉 You crushed it! Time for a new goal?";
    if (progress >= 75) return "🔥 So close! You're on fire!";
    if (progress >= 50) return "💪 Halfway there! Keep pushing!";
    if (progress >= 25) return "🚀 Great momentum! Keep it up!";
    return "🌱 Every journey starts with a single step!";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Savings Goal</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Goal Setup / Edit Section */}
          {!hasGoal || isEditing ? (
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <h3 className="font-semibold mb-3 flex items-center">
                <Flame className="h-4 w-4 mr-2 text-orange-500" />
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
          ) : (
            <>
              {/* Interactive Circular Progress */}
              <Card className={`p-4 ${isComplete ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{savingsGoal.name}</h3>
                    <p className="text-xs text-gray-500">Personal Savings Goal</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>

                {/* Circular Progress Chart */}
                <div className="relative flex items-center justify-center">
                  <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={circularData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {circularData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className={`text-3xl font-bold ${isComplete ? 'text-green-600' : 'text-purple-600'}`}>
                      {Math.round(progress)}%
                    </p>
                    <p className="text-xs text-gray-500">saved</p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between mt-4 px-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(totalSavedFromGroups)}</p>
                    <p className="text-xs text-gray-500">Saved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(goalAmount)}</p>
                    <p className="text-xs text-gray-500">Goal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(remaining)}</p>
                    <p className="text-xs text-gray-500">Left</p>
                  </div>
                </div>

                {/* Motivational Message */}
                <div className={`mt-4 text-center py-2 rounded-lg ${isComplete ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                  <p className="text-sm font-medium">{getMotivationalMessage()}</p>
                </div>
              </Card>

              {/* Savings Growth Chart */}
              {savingsHistory.length > 1 && (
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-800 flex items-center mb-3">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    Your Savings Journey
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={savingsHistory}>
                        <defs>
                          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#9ca3af' }}
                        />
                        <YAxis hide />
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value), 'Total Saved']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          fill="url(#savingsGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}

              {/* Group Contributions Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Savings from Nests
                </h4>
                
                {groupBreakdown.length > 0 ? (
                  <div className="space-y-2">
                    {groupBreakdown.map((group, index) => (
                      <Card key={index} className="p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{group.name}</p>
                            <p className="text-xs text-gray-500">Received {group.date}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-semibold text-green-600">{formatCurrency(group.amount)}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-4 bg-gray-50 text-center">
                    <div className="py-4">
                      <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 font-medium">No payouts yet</p>
                      <p className="text-xs text-gray-500 mt-1">Keep contributing to your nests to start saving!</p>
                    </div>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SavingsGoalModal;
