import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface Group {
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
  myPayoutDate: string;
  membersPaid: number;
  status: 'active' | 'completed';
  allowDoubleContribution?: boolean;
  isDoubleContributor?: boolean;
  inviteCode: string;
  adminId: string;
  isAdmin: boolean;
  membersList: string[];
  createdAt: string;
}

interface AppContextType {
  groups: Group[];
  walletBalance: number;
  currentUserId: string;
  createGroup: (groupData: any) => void;
  makePayment: (groupId: number, amount: number) => void;
  joinGroup: (groupCode: string) => void;
  joinGroupByUrl: (groupCode: string) => void;
  cashoutGroup: (groupId: number) => void;
  generateInviteUrl: (groupCode: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [walletBalance, setWalletBalance] = useState(500.00);
  const currentUserId = "currentUser";
  const { toast } = useToast();

  const createGroup = (groupData: any) => {
    const groupId = Date.now();
    const memberLimit = parseInt(groupData.memberLimit);
    const contributionAmount = parseFloat(groupData.contributionAmount);
    
    // Calculate next payout date based on frequency
    const getNextPayoutDate = (frequency: string) => {
      const now = new Date();
      switch (frequency) {
        case 'weekly':
          return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        case 'monthly':
          return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        case 'daily':
          return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        default:
          return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      }
    };

    const nextPayoutDate = getNextPayoutDate(groupData.frequency);

    const newGroup: Group = {
      id: groupId,
      name: groupData.groupName,
      members: 1,
      totalAmount: contributionAmount * memberLimit,
      contributionAmount: contributionAmount,
      frequency: groupData.frequency,
      nextPayout: nextPayoutDate.toISOString().split('T')[0],
      payoutRecipient: "You",
      progress: 0,
      myTurn: true,
      position: 1,
      myPayoutDate: nextPayoutDate.toISOString().split('T')[0],
      membersPaid: 0,
      status: 'active',
      allowDoubleContribution: groupData.allowDoubleContribution || false,
      isDoubleContributor: false,
      inviteCode: groupData.inviteCode,
      adminId: currentUserId,
      isAdmin: true,
      membersList: [currentUserId],
      createdAt: new Date().toISOString()
    };

    setGroups(prev => [...prev, newGroup]);
    
    // Deduct wallet balance if making initial contribution
    if (walletBalance >= contributionAmount) {
      setWalletBalance(prev => prev - contributionAmount);
    }

    toast({
      title: "Group Created Successfully!",
      description: `"${groupData.groupName}" is ready. Share invite code: ${groupData.inviteCode}`,
    });
  };

  const joinGroup = (groupCode: string) => {
    // Check if already in a group with this code
    const existingGroup = groups.find(g => g.inviteCode === groupCode);
    if (existingGroup) {
      toast({
        title: "Already in Group!",
        description: `You're already part of "${existingGroup.name}"`,
        variant: "destructive"
      });
      return;
    }

    // Create a mock group for the joined group (in a real app, this would fetch from server)
    const joinedGroupData = {
      groupName: `Group ${groupCode}`,
      contributionAmount: 100,
      frequency: 'weekly',
      memberLimit: 6,
      allowDoubleContribution: Math.random() > 0.5,
      inviteCode: groupCode
    };

    const groupId = Date.now();
    const nextPayoutDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const myPayoutPosition = Math.floor(Math.random() * 5) + 2; // Position 2-6
    const myPayoutDate = new Date(Date.now() + (myPayoutPosition * 7 * 24 * 60 * 60 * 1000));

    const newGroup: Group = {
      id: groupId,
      name: joinedGroupData.groupName,
      members: 6,
      totalAmount: joinedGroupData.contributionAmount * joinedGroupData.memberLimit,
      contributionAmount: joinedGroupData.contributionAmount,
      frequency: joinedGroupData.frequency,
      nextPayout: nextPayoutDate.toISOString().split('T')[0],
      payoutRecipient: "Member 1",
      progress: Math.floor(Math.random() * 60) + 10, // 10-70% progress
      myTurn: false,
      position: myPayoutPosition,
      myPayoutDate: myPayoutDate.toISOString().split('T')[0],
      membersPaid: Math.floor(Math.random() * 4) + 1,
      status: 'active',
      allowDoubleContribution: joinedGroupData.allowDoubleContribution,
      isDoubleContributor: false,
      inviteCode: groupCode,
      adminId: "otherUser",
      isAdmin: false,
      membersList: ["member1", "member2", "member3", "member4", "member5", currentUserId],
      createdAt: new Date().toISOString()
    };

    setGroups(prev => [...prev, newGroup]);
    toast({
      title: "Joined Group Successfully!",
      description: `Welcome to "${joinedGroupData.groupName}"! Your position is #${myPayoutPosition}`,
    });
  };

  const makePayment = (groupId: number, amount: number) => {
    if (walletBalance < amount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add funds to your wallet first.",
        variant: "destructive"
      });
      return;
    }

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const newMembersPaid = Math.min(group.membersPaid + 1, group.members);
        const newProgress = Math.min((newMembersPaid / group.members) * 100, 100);
        
        // If it's my turn and the group is complete, I receive the payout
        if (group.myTurn && newProgress >= 100) {
          const payoutAmount = group.isDoubleContributor ? group.totalAmount * 2 : group.totalAmount;
          setWalletBalance(prevBalance => prevBalance + payoutAmount - amount);
          
          toast({
            title: "Payment Complete - You Win!",
            description: `You received $${payoutAmount.toLocaleString()} from "${group.name}"`,
          });
          
          // Reset for next round or mark as completed
          return {
            ...group,
            progress: 0,
            membersPaid: 0,
            myTurn: false,
            position: group.members, // Move to end
            payoutRecipient: "Next Member",
            nextPayout: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            myPayoutDate: new Date(Date.now() + (group.members * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
          };
        }
        
        return {
          ...group,
          progress: newProgress,
          membersPaid: newMembersPaid
        };
      }
      return group;
    }));

    // Deduct payment from wallet
    setWalletBalance(prev => prev - amount);
    
    toast({
      title: "Payment Successful!",
      description: `Payment of $${amount.toLocaleString()} has been processed.`,
    });
  };

  const cashoutGroup = (groupId: number) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      const payoutAmount = group.isDoubleContributor ? group.totalAmount * 2 : group.totalAmount;
      setWalletBalance(prev => prev + payoutAmount);
      
      // Mark group as completed
      setGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, status: 'completed' as const } : g
      ));
      
      toast({
        title: "Cashout Successful!",
        description: `$${payoutAmount.toLocaleString()} has been added to your wallet.`,
      });
    }
  };

  const generateInviteUrl = (groupCode: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/?invite=${groupCode}`;
  };

  const joinGroupByUrl = (groupCode: string) => {
    // Same logic as joinGroup but for URL-based invites
    joinGroup(groupCode);
  };

  return (
    <AppContext.Provider value={{
      groups,
      walletBalance,
      currentUserId,
      createGroup,
      makePayment,
      joinGroup,
      joinGroupByUrl,
      cashoutGroup,
      generateInviteUrl
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
