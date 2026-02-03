import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Edit2, Sparkles, TrendingUp } from "lucide-react";

interface SavingsGoalCardProps {
  goalAmount: number;
  currentSavings: number;
  goalName: string;
  onUpdateGoal: (name: string, amount: number) => void;
}

const SavingsGoalCard = ({ goalAmount, currentSavings, goalName, onUpdateGoal }: SavingsGoalCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(goalName);
  const [editAmount, setEditAmount] = useState(goalAmount.toString());

  const progress = goalAmount > 0 ? Math.min((currentSavings / goalAmount) * 100, 100) : 0;
  const remaining = Math.max(goalAmount - currentSavings, 0);
  const isComplete = progress >= 100;

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
      onUpdateGoal(editName.trim(), amount);
      setIsEditOpen(false);
    }
  };

  if (goalAmount === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 rounded-2xl">
        <div className="text-center space-y-4">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <Target className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Set a Savings Goal</h3>
            <p className="text-sm text-gray-600 mt-1">Track your progress towards a financial target</p>
          </div>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Target className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Your Savings Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
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
                <Button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-700">
                  Set Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 rounded-2xl ${isComplete ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`rounded-full p-2 ${isComplete ? 'bg-green-100' : 'bg-purple-100'}`}>
            {isComplete ? (
              <Sparkles className="h-5 w-5 text-green-600" />
            ) : (
              <Target className="h-5 w-5 text-purple-600" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{goalName}</h3>
            <p className="text-xs text-gray-500">Personal Savings Goal</p>
          </div>
        </div>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit2 className="h-4 w-4 text-gray-500" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="goalAmount">Target Amount ($)</Label>
                <Input
                  id="goalAmount"
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-700">
                Update Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(currentSavings)}</p>
            <p className="text-sm text-gray-500">of {formatCurrency(goalAmount)}</p>
          </div>
          <div className={`text-right ${isComplete ? 'text-green-600' : 'text-purple-600'}`}>
            <p className="text-xl font-bold">{Math.round(progress)}%</p>
          </div>
        </div>

        <Progress 
          value={progress} 
          className={`h-3 ${isComplete ? 'bg-green-100' : 'bg-purple-100'}`}
        />

        {isComplete ? (
          <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-100 rounded-lg py-2">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold text-sm">Goal Achieved! 🎉</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-gray-600">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-sm">{formatCurrency(remaining)} left to go</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SavingsGoalCard;
