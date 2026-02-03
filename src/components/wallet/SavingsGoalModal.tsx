import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Target, Edit2, Sparkles, TrendingUp, Users, CheckCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface SavingsGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SavingsGoalModal = ({ open, onOpenChange }: SavingsGoalModalProps) => {
  const { savingsGoal, updateSavingsGoal, groups, walletEntries } = useApp();
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

  const goalAmount = savingsGoal.targetAmount;
  const progress = goalAmount > 0 ? Math.min((totalSavedFromGroups / goalAmount) * 100, 100) : 0;
  const remaining = Math.max(goalAmount - totalSavedFromGroups, 0);
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
      updateSavingsGoal(editName.trim(), amount);
      setIsEditing(false);
    }
  };

  const hasGoal = goalAmount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Savings Goal</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Goal Setup / Edit Section */}
          {!hasGoal || isEditing ? (
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h3 className="font-semibold mb-3">{hasGoal ? 'Edit Goal' : 'Set Your Goal'}</h3>
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
              {/* Progress Overview */}
              <Card className={`p-5 ${isComplete ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'}`}>
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
                      <h3 className="font-bold text-gray-800">{savingsGoal.name}</h3>
                      <p className="text-xs text-gray-500">Personal Savings Goal</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalSavedFromGroups)}</p>
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

              {/* Group Contributions Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Savings from Nests
                </h4>
                
                {groupBreakdown.length > 0 ? (
                  <div className="space-y-2">
                    {groupBreakdown.map((group, index) => (
                      <Card key={index} className="p-3 bg-gray-50">
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
                    <p className="text-sm text-gray-500">No payouts received yet. Keep contributing to your nests!</p>
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
