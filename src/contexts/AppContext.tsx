
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
  inviteCode: string;
  adminId: string;
  isAdmin: boolean;
  membersList: string[];
  createdAt: string;
  isComplete: boolean;
  allMembersPaidOut: boolean;
  lockWithdrawals: boolean; // New field for group-level lock setting
}

export interface WalletEntry {
  id: number;
  userId: string;
  groupId: number;
  groupName: string;
  amount: number;
  receivedDate: string;
  isLocked: boolean; // New field for individual entry lock status
  groupLockPolicy: boolean; // Track the group's original lock policy
}

interface AppContextType {
  groups: Group[];
  walletBalance: number;
  walletEntries: WalletEntry[];
  currentUserId: string;
  createGroup: (groupData: any) => void;
  makePayment: (groupId: number, amount: number) => void;
  joinGroup: (groupCode: string) => void;
  joinGroupByUrl: (groupCode: string) => void;
  cashoutGroup: (groupId: number) => void;
  generateInviteUrl: (groupCode: string) => string;
  getWithdrawableBalance: () => number;
  getPendingUnlockBalance: () => number;
  getLockedEntries: () => WalletEntry[];
  getUnlockedEntries: () => WalletEntry[];
  withdrawFunds: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with a sample active group with lock setting
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "Weekend Getaway Fund",
      members: 6,
      totalAmount: 1800,
      contributionAmount: 300,
      frequency: "weekly",
      nextPayout: "2024-07-05",
      payoutRecipient: "Sarah M.",
      progress: 65,
      myTurn: false,
      position: 3,
      myPayoutDate: "2024-07-19",
      membersPaid: 4,
      status: 'active',
      inviteCode: "GETAWAY2024",
      adminId: "admin123",
      isAdmin: true,
      membersList: ["currentUser", "sarah123", "mike456", "emma789", "james101", "lisa202"],
      createdAt: "2024-06-20T10:00:00.000Z",
      isComplete: false,
      allMembersPaidOut: false,
      lockWithdrawals: true // This group locks withdrawals until completion
    }
  ]);

  // Initialize wallet entries with lock status
  const [walletEntries, setWalletEntries] = useState<WalletEntry[]>([
    {
      id: 1,
      userId: "currentUser",
      groupId: 2,
      groupName: "Emergency Fund",
      amount: 1800,
      receivedDate: "2024-06-20T10:00:00.000Z",
      isLocked: false, // This was from a completed group with no lock policy
      groupLockPolicy: false
    },
    {
      id: 2,
      userId: "currentUser", 
      groupId: 3,
      groupName: "Holiday Shopping",
      amount: 1200,
      receivedDate: "2024-06-18T10:00:00.000Z",
      isLocked: true, // This is from an active group with lock policy
      groupLockPolicy: true
    }
  ]);

  const [walletBalance, setWalletBalance] = useState(500.00);
  const currentUserId = "currentUser";
  const { toast } = useToast();

  const getWithdrawableBalance = () => {
    return walletEntries
      .filter(entry => entry.userId === currentUserId && !entry.isLocked)
      .reduce((total, entry) => total + entry.amount, 0);
  };

  const getPendingUnlockBalance = () => {
    return walletEntries
      .filter(entry => entry.userId === currentUserId && entry.isLocked)
      .reduce((total, entry) => total + entry.amount, 0);
  };

  const getLockedEntries = () => {
    return walletEntries.filter(entry => entry.userId === currentUserId && entry.isLocked);
  };

  const getUnlockedEntries = () => {
    return walletEntries.filter(entry => entry.userId === currentUserId && !entry.isLocked);
  };

  const unlockGroupFunds = (groupId: number) => {
    setWalletEntries(prev => prev.map(entry => 
      entry.groupId === groupId && entry.isLocked
        ? { ...entry, isLocked: false }
        : entry
    ));
  };

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
      inviteCode: groupData.inviteCode,
      adminId: currentUserId,
      isAdmin: true,
      membersList: [currentUserId],
      createdAt: new Date().toISOString(),
      isComplete: false,
      allMembersPaidOut: false,
      lockWithdrawals: groupData.lockWithdrawals ?? true // Default to true if not specified
    };

    setGroups(prev => [...prev, newGroup]);
    
    // Deduct wallet balance if making initial contribution
    if (walletBalance >= contributionAmount) {
      setWalletBalance(prev => prev - contributionAmount);
    }

    toast({
      title: "Group Created Successfully!",
      description: `"${groupData.groupName}" is ready. ${newGroup.lockWithdrawals ? 'Funds will be locked until group completion.' : 'Funds will be immediately withdrawable.'}`,
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

    // Create a mock group for the joined group
    const joinedGroupData = {
      groupName: `Group ${groupCode}`,
      contributionAmount: 100,
      frequency: 'weekly',
      memberLimit: 6,
      inviteCode: groupCode,
      lockWithdrawals: Math.random() > 0.5 // Random lock policy for demo
    };

    const groupId = Date.now();
    const nextPayoutDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const myPayoutPosition = Math.floor(Math.random() * 5) + 2;
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
      progress: Math.floor(Math.random() * 60) + 10,
      myTurn: false,
      position: myPayoutPosition,
      myPayoutDate: myPayoutDate.toISOString().split('T')[0],
      membersPaid: Math.floor(Math.random() * 4) + 1,
      status: 'active',
      inviteCode: groupCode,
      adminId: "otherUser",
      isAdmin: false,
      membersList: ["member1", "member2", "member3", "member4", "member5", currentUserId],
      createdAt: new Date().toISOString(),
      isComplete: false,
      allMembersPaidOut: false,
      lockWithdrawals: joinedGroupData.lockWithdrawals
    };

    setGroups(prev => [...prev, newGroup]);
    toast({
      title: "Joined Group Successfully!",
      description: `Welcome to "${joinedGroupData.groupName}"! Funds ${newGroup.lockWithdrawals ? 'will be locked until completion' : 'will be immediately withdrawable'}.`,
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
        const isGroupComplete = newProgress >= 100;
        
        // If it's my turn and the group is complete, I receive the payout
        if (group.myTurn && isGroupComplete) {
          const payoutAmount = group.totalAmount;
          
          // Determine if funds should be locked based on group setting
          const shouldLockFunds = group.lockWithdrawals && !group.allMembersPaidOut;
          
          // Add wallet entry for this payout
          const newWalletEntry: WalletEntry = {
            id: Date.now(),
            userId: currentUserId,
            groupId: group.id,
            groupName: group.name,
            amount: payoutAmount,
            receivedDate: new Date().toISOString(),
            isLocked: shouldLockFunds,
            groupLockPolicy: group.lockWithdrawals
          };
          
          setWalletEntries(prevEntries => [...prevEntries, newWalletEntry]);
          
          const allPaidOut = newMembersPaid === group.members;
          
          // If all members are paid out and this group locks withdrawals, unlock all funds
          if (allPaidOut && group.lockWithdrawals) {
            setTimeout(() => unlockGroupFunds(group.id), 100);
          }
          
          toast({
            title: "Payment Complete - You Win!",
            description: `You received $${payoutAmount.toLocaleString()} from "${group.name}" - ${shouldLockFunds ? 'Funds locked until group completion' : 'Available for withdrawal now'}!`,
          });
          
          return {
            ...group,
            progress: newProgress,
            membersPaid: newMembersPaid,
            myTurn: false,
            isComplete: allPaidOut,
            allMembersPaidOut: allPaidOut,
            status: allPaidOut ? 'completed' as const : 'active' as const
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
      const payoutAmount = group.totalAmount;
      const shouldLockFunds = group.lockWithdrawals;
      
      // Add wallet entry for cashout
      const newWalletEntry: WalletEntry = {
        id: Date.now(),
        userId: currentUserId,
        groupId: group.id,
        groupName: group.name,
        amount: payoutAmount,
        receivedDate: new Date().toISOString(),
        isLocked: shouldLockFunds,
        groupLockPolicy: group.lockWithdrawals
      };
      
      setWalletEntries(prevEntries => [...prevEntries, newWalletEntry]);
      
      // Mark group as completed
      setGroups(prev => prev.map(g => 
        g.id === groupId ? { 
          ...g, 
          status: 'completed' as const, 
          isComplete: true,
          allMembersPaidOut: true 
        } : g
      ));
      
      // If group locks withdrawals, unlock funds since it's now complete
      if (group.lockWithdrawals) {
        setTimeout(() => unlockGroupFunds(group.id), 100);
      }
      
      toast({
        title: "Cashout Successful!",
        description: `$${payoutAmount.toLocaleString()} has been added to your wallet${shouldLockFunds ? ' and unlocked since group is complete' : ' and is available for withdrawal'}.`,
      });
    }
  };

  const withdrawFunds = (amount: number) => {
    const withdrawableBalance = getWithdrawableBalance();
    
    if (amount > withdrawableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You can only withdraw $${withdrawableBalance.toLocaleString()}.`,
        variant: "destructive"
      });
      return;
    }

    // Remove withdrawn amounts from unlocked entries (FIFO basis)
    let remainingAmount = amount;
    setWalletEntries(prev => {
      return prev.filter(entry => {
        if (entry.userId === currentUserId && !entry.isLocked && remainingAmount > 0) {
          if (entry.amount <= remainingAmount) {
            remainingAmount -= entry.amount;
            return false; // Remove this entry
          } else {
            // Partially withdraw from this entry
            entry.amount -= remainingAmount;
            remainingAmount = 0;
            return true;
          }
        }
        return true;
      });
    });

    toast({
      title: "Withdrawal Successful!",
      description: `$${amount.toLocaleString()} has been transferred to your bank account.`,
    });
  };

  const generateInviteUrl = (groupCode: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/?invite=${groupCode}`;
  };

  const joinGroupByUrl = (groupCode: string) => {
    joinGroup(groupCode);
  };

  return (
    <AppContext.Provider value={{
      groups,
      walletBalance,
      walletEntries,
      currentUserId,
      createGroup,
      makePayment,
      joinGroup,
      joinGroupByUrl,
      cashoutGroup,
      generateInviteUrl,
      getWithdrawableBalance,
      getPendingUnlockBalance,
      getLockedEntries,
      getUnlockedEntries,
      withdrawFunds
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
