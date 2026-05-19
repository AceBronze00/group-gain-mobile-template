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
  lockWithdrawals: boolean;
  allowMultipleContributions: boolean;
  payoutOrder: 'randomized' | 'manual';
  payoutSequence: string[];
  hasStarted: boolean;
  totalPayoutsSent: number;
  isPaused?: boolean;
  pauseVote?: {
    active: boolean;
    yes: number;
    no: number;
    hasVoted?: boolean;
    requestedBy?: string;
    requestedAt?: string;
  };
  deletionVote?: {
    active: boolean;
    yes: number;
    no: number;
    hasVoted?: boolean;
    requestedBy?: string;
    requestedAt?: string;
  };
}

export interface WalletEntry {
  id: number;
  userId: string;
  groupId: number;
  groupName: string;
  amount: number;
  receivedDate: string;
  isLocked: boolean;
  groupLockPolicy: boolean;
}

interface AppContextType {
  groups: Group[];
  walletBalance: number;
  walletEntries: WalletEntry[];
  currentUserId: string;
  createGroup: (groupData: any) => void;
  makePayment: (groupId: number, amount: number) => void;
  joinGroup: (groupCode: string, lateJoinerPayment?: number) => Promise<{ isLateJoiner: boolean; requiredAmount: number } | void>;
  joinGroupByUrl: (groupCode: string) => void;
  cashoutGroup: (groupId: number) => void;
  generateInviteUrl: (groupCode: string) => string;
  getWithdrawableBalance: () => number;
  getPendingUnlockBalance: () => number;
  getLockedEntries: () => WalletEntry[];
  getUnlockedEntries: () => WalletEntry[];
  withdrawFunds: (amount: number) => void;
  depositFunds: (amount: number) => void;
  updatePayoutOrder: (groupId: number, newOrder: string[]) => void;
  deleteGroup: (groupId: number) => void;
  calculateLateJoinerAmount: (groupCode: string) => number;
  setNestPaused: (groupId: number, paused: boolean) => void;
  startPauseVote: (groupId: number) => void;
  castPauseVote: (groupId: number, approve: boolean) => void;
  startDeletionVote: (groupId: number) => void;
  castDeletionVote: (groupId: number, approve: boolean) => void;
  seedDemoPausedNest: () => void;
  seedDemoCompletedNests: () => void;
  seedDemoWallet: () => void;
  // Navigation state for settings
  pendingSettingsTab: string | null;
  setPendingSettingsTab: (tab: string | null) => void;
  navigateToSettings: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const currentUserId = "currentUser";

  // Seed example wallet entries so Available and Locked sheets show content out of the box.
  const _now = Date.now();
  const _day = 24 * 60 * 60 * 1000;

  const initialGroups: Group[] = [
    {
      id: 8001,
      name: "Rent Split Crew",
      members: 6,
      totalAmount: 2400,
      contributionAmount: 400,
      frequency: "monthly",
      nextPayout: new Date(_now + 21 * _day).toISOString().split("T")[0],
      payoutRecipient: "Alex",
      progress: 50,
      myTurn: false,
      position: 4,
      myPayoutDate: new Date(_now + 21 * _day).toISOString().split("T")[0],
      membersPaid: 3,
      status: "active",
      inviteCode: "DEMO-RENT",
      adminId: "otherUser",
      isAdmin: false,
      membersList: ["m1", "m2", "m3", currentUserId, "m4", "m5"],
      createdAt: new Date(_now - 60 * _day).toISOString(),
      isComplete: false,
      allMembersPaidOut: false,
      lockWithdrawals: false,
      allowMultipleContributions: false,
      payoutOrder: "manual",
      payoutSequence: ["m1", "m2", "m3", currentUserId, "m4", "m5"],
      hasStarted: true,
      totalPayoutsSent: 7200,
    },
    {
      id: 8002,
      name: "Wedding Fund",
      members: 5,
      totalAmount: 1500,
      contributionAmount: 300,
      frequency: "weekly",
      nextPayout: new Date(_now + 10 * _day).toISOString().split("T")[0],
      payoutRecipient: "Jamie",
      progress: 20,
      myTurn: false,
      position: 2,
      myPayoutDate: new Date(_now + 10 * _day).toISOString().split("T")[0],
      membersPaid: 1,
      status: "active",
      inviteCode: "DEMO-WED",
      adminId: "otherUser",
      isAdmin: false,
      membersList: ["m1", currentUserId, "m2", "m3", "m4"],
      createdAt: new Date(_now - 14 * _day).toISOString(),
      isComplete: false,
      allMembersPaidOut: false,
      lockWithdrawals: false,
      allowMultipleContributions: false,
      payoutOrder: "manual",
      payoutSequence: ["m1", currentUserId, "m2", "m3", "m4"],
      hasStarted: true,
      totalPayoutsSent: 1500,
    },
  ];

  const [groups, setGroups] = useState<Group[]>(initialGroups);

  const initialWalletEntries: WalletEntry[] = [
    {
      id: 9001,
      userId: currentUserId,
      groupId: 9001,
      groupName: "Summer Savings Circle",
      amount: 1200,
      receivedDate: new Date(_now - 12 * _day).toISOString(),
      isLocked: false,
      groupLockPolicy: false,
    },
    {
      id: 9002,
      userId: currentUserId,
      groupId: 9002,
      groupName: "Family Vacation Fund",
      amount: 800,
      receivedDate: new Date(_now - 3 * _day).toISOString(),
      isLocked: false,
      groupLockPolicy: false,
    },
    {
      id: 9101,
      userId: currentUserId,
      groupId: 9101,
      groupName: "Office Lunch Pool",
      amount: 450,
      receivedDate: new Date(_now - 5 * _day).toISOString(),
      isLocked: true,
      groupLockPolicy: true,
    },
    {
      id: 9102,
      userId: currentUserId,
      groupId: 9102,
      groupName: "Holiday Gift Squad",
      amount: 600,
      receivedDate: new Date(_now - 1 * _day).toISOString(),
      isLocked: true,
      groupLockPolicy: true,
    },
  ];

  const [walletEntries, setWalletEntries] = useState<WalletEntry[]>(initialWalletEntries);
  const [walletBalance, setWalletBalance] = useState(250);
  const [pendingSettingsTab, setPendingSettingsTab] = useState<string | null>(null);
  const { toast } = useToast();

  const navigateToSettings = (tab: string) => {
    setPendingSettingsTab(tab);
  };


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

  const calculateLateJoinerAmount = (groupCode: string) => {
    const group = groups.find(g => g.inviteCode === groupCode);
    return group ? group.totalPayoutsSent : 0;
  };

  const updatePayoutOrder = (groupId: number, newOrder: string[]) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId && !group.hasStarted
        ? { ...group, payoutSequence: newOrder }
        : group
    ));
  };

  const createGroup = (groupData: any) => {
    const groupId = Date.now();
    const memberLimit = parseInt(groupData.maxMembers || groupData.memberLimit);
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
      lockWithdrawals: groupData.lockWithdrawals ?? true,
      allowMultipleContributions: groupData.allowMultipleContributions ?? false,
      payoutOrder: groupData.payoutOrder ?? 'randomized',
      payoutSequence: [currentUserId],
      hasStarted: false,
      totalPayoutsSent: 0
    };

    setGroups(prev => [...prev, newGroup]);
    
    if (walletBalance >= contributionAmount) {
      setWalletBalance(prev => prev - contributionAmount);
    }

    toast({
      title: "Group Created Successfully!",
      description: `"${groupData.groupName}" is ready. ${newGroup.lockWithdrawals ? 'Funds will be locked until group completion.' : 'Funds will be immediately withdrawable.'}`,
    });
  };

  const joinGroup = async (groupCode: string, lateJoinerPayment?: number): Promise<{ isLateJoiner: boolean; requiredAmount: number } | void> => {
    // Check if already in a group with this code
    const existingGroup = groups.find(g => g.inviteCode === groupCode && g.membersList.includes(currentUserId));
    if (existingGroup) {
      toast({
        title: "Already in Group!",
        description: `You're already part of "${existingGroup.name}"`,
        variant: "destructive"
      });
      return;
    }

    // Check if it's a late joiner scenario
    const mockGroup = groups.find(g => g.inviteCode === groupCode.toUpperCase());
    const isLateJoiner = mockGroup && mockGroup.hasStarted;
    const requiredPayment = isLateJoiner ? calculateLateJoinerAmount(groupCode) : 100;

    if (isLateJoiner && !lateJoinerPayment) {
      // This will trigger the late joiner modal in the UI
      return { isLateJoiner: true, requiredAmount: requiredPayment };
    }

    const joinedGroupData = {
      groupName: `Group ${groupCode}`,
      contributionAmount: lateJoinerPayment || 100,
      frequency: 'weekly',
      memberLimit: 6,
      inviteCode: groupCode,
      lockWithdrawals: Math.random() > 0.5
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
      lockWithdrawals: joinedGroupData.lockWithdrawals,
      allowMultipleContributions: false,
      payoutOrder: 'randomized',
      payoutSequence: ["member1", "member2", "member3", "member4", "member5", currentUserId],
      hasStarted: true,
      totalPayoutsSent: isLateJoiner ? requiredPayment : 0
    };

    setGroups(prev => [...prev, newGroup]);
    
    if (lateJoinerPayment) {
      setWalletBalance(prev => prev - lateJoinerPayment);
    }
    
    toast({
      title: "Joined Group Successfully!",
      description: `Welcome to "${joinedGroupData.groupName}"! ${isLateJoiner ? `Paid catch-up amount of $${lateJoinerPayment}` : ''}`,
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
        
        if (group.myTurn && isGroupComplete) {
          const payoutAmount = group.totalAmount;
          const shouldLockFunds = group.lockWithdrawals && !group.allMembersPaidOut;
          
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
            status: allPaidOut ? 'completed' as const : 'active' as const,
            hasStarted: true,
            totalPayoutsSent: group.totalPayoutsSent + payoutAmount
          };
        }
        
        return {
          ...group,
          progress: newProgress,
          membersPaid: newMembersPaid,
          hasStarted: true
        };
      }
      return group;
    }));

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
      
      setGroups(prev => prev.map(g => 
        g.id === groupId ? { 
          ...g, 
          status: 'completed' as const, 
          isComplete: true,
          allMembersPaidOut: true 
        } : g
      ));
      
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

    let remainingAmount = amount;
    setWalletEntries(prev => {
      return prev.filter(entry => {
        if (entry.userId === currentUserId && !entry.isLocked && remainingAmount > 0) {
          if (entry.amount <= remainingAmount) {
            remainingAmount -= entry.amount;
            return false;
          } else {
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

  const depositFunds = (amount: number) => {
    setWalletBalance(prev => prev + amount);
    toast({
      title: "Deposit Successful!",
      description: `$${amount.toLocaleString()} has been added to your wallet.`,
    });
  };

  const deleteGroup = (groupId: number) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setWalletEntries(prev => prev.filter(e => e.groupId !== groupId));
    toast({
      title: "Nest Deleted",
      description: "The nest has been permanently removed.",
    });
  };

  const setNestPaused = (groupId: number, paused: boolean) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, isPaused: paused } : g));
    toast({
      title: paused ? "Nest Paused" : "Nest Resumed",
      description: paused
        ? "Contributions and payouts are temporarily suspended."
        : "Contributions and payouts have resumed.",
    });
  };

  const startPauseVote = (groupId: number) => {
    setGroups(prev => prev.map(g => g.id === groupId
      ? { ...g, pauseVote: {
          active: true, yes: 0, no: 0, hasVoted: false,
          requestedBy: "You", requestedAt: new Date().toISOString()
        } }
      : g));
    toast({
      title: "Pause Vote Started",
      description: "All members can now vote on whether to pause this nest. Majority required.",
    });
  };

  const castPauseVote = (groupId: number, approve: boolean) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId || !g.pauseVote || g.pauseVote.hasVoted) return g;
      const yes = g.pauseVote.yes + (approve ? 1 : 0);
      const no = g.pauseVote.no + (approve ? 0 : 1);
      const totalVoted = yes + no;
      const majorityThreshold = Math.floor(g.members / 2) + 1;
      // Resolve vote when majority reached either way, or all members voted
      if (yes >= majorityThreshold) {
        setTimeout(() => toast({
          title: "Pause Approved",
          description: "Majority voted to pause. The nest is now paused.",
        }), 0);
        return { ...g, isPaused: true, pauseVote: undefined };
      }
      if (no >= majorityThreshold || totalVoted >= g.members) {
        setTimeout(() => toast({
          title: "Pause Rejected",
          description: "Majority voted against pausing. Activity continues.",
        }), 0);
        return { ...g, pauseVote: undefined };
      }
      return {
        ...g,
        pauseVote: { ...g.pauseVote, yes, no, hasVoted: true },
      };
    }));
    toast({
      title: "Vote Recorded",
      description: approve ? "You voted to pause." : "You voted to keep active.",
    });
    // Simulate remaining members voting over the next few seconds
    simulateRemainingVotes(groupId, "pause");
  };

  const startDeletionVote = (groupId: number) => {
    setGroups(prev => prev.map(g => g.id === groupId
      ? { ...g, deletionVote: {
          active: true, yes: 0, no: 0, hasVoted: false,
          requestedBy: "You", requestedAt: new Date().toISOString()
        } }
      : g));
    toast({
      title: "Deletion Vote Started",
      description: "All members can now vote on whether to delete this nest.",
    });
  };

  const castDeletionVote = (groupId: number, approve: boolean) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId || !g.deletionVote || g.deletionVote.hasVoted) return g;
      const yes = g.deletionVote.yes + (approve ? 1 : 0);
      const no = g.deletionVote.no + (approve ? 0 : 1);
      const totalVoted = yes + no;
      const majorityThreshold = Math.floor(g.members / 2) + 1;
      if (yes >= majorityThreshold) {
        setTimeout(() => {
          toast({
            title: "Deletion Approved",
            description: "Majority voted to delete. The nest has been removed.",
          });
          setGroups(curr => curr.filter(x => x.id !== groupId));
          setWalletEntries(curr => curr.filter(e => e.groupId !== groupId));
        }, 0);
        return { ...g, deletionVote: { ...g.deletionVote, yes, no, hasVoted: true } };
      }
      if (no >= majorityThreshold || totalVoted >= g.members) {
        setTimeout(() => toast({
          title: "Deletion Rejected",
          description: "Majority voted to keep the nest. Activity continues.",
        }), 0);
        return { ...g, deletionVote: undefined };
      }
      return {
        ...g,
        deletionVote: { ...g.deletionVote, yes, no, hasVoted: true },
      };
    }));
    toast({
      title: "Vote Recorded",
      description: approve ? "You voted to delete." : "You voted to keep.",
    });
    simulateRemainingVotes(groupId, "delete");
  };

  // Simulate remaining members casting their votes over a few seconds
  const simulateRemainingVotes = (groupId: number, kind: "pause" | "delete") => {
    let step = 0;
    const tick = () => {
      let shouldContinue = false;
      setGroups(prev => prev.map(g => {
        if (g.id !== groupId) return g;
        const vote = kind === "pause" ? g.pauseVote : g.deletionVote;
        if (!vote) return g;
        const totalVoted = vote.yes + vote.no;
        const remaining = g.members - totalVoted;
        if (remaining <= 0) return g;
        const majorityThreshold = Math.floor(g.members / 2) + 1;
        // Random vote, slightly weighted toward the initiator's intent
        const approve = Math.random() < 0.55;
        const yes = vote.yes + (approve ? 1 : 0);
        const no = vote.no + (approve ? 0 : 1);
        const newTotal = yes + no;
        // Resolve if threshold reached
        if (yes >= majorityThreshold) {
          if (kind === "pause") {
            setTimeout(() => toast({
              title: "Pause Approved",
              description: "Majority voted to pause. The nest is now paused.",
            }), 0);
            return { ...g, isPaused: true, pauseVote: undefined };
          } else {
            setTimeout(() => {
              toast({
                title: "Deletion Approved",
                description: "Majority voted to delete. The nest has been removed.",
              });
              setGroups(curr => curr.filter(x => x.id !== groupId));
              setWalletEntries(curr => curr.filter(e => e.groupId !== groupId));
            }, 0);
            return { ...g, deletionVote: { ...vote, yes, no } };
          }
        }
        if (no >= majorityThreshold || newTotal >= g.members) {
          setTimeout(() => toast({
            title: kind === "pause" ? "Pause Rejected" : "Deletion Rejected",
            description: kind === "pause"
              ? "Majority voted against pausing. Activity continues."
              : "Majority voted to keep the nest. Activity continues.",
          }), 0);
          return kind === "pause"
            ? { ...g, pauseVote: undefined }
            : { ...g, deletionVote: undefined };
        }
        shouldContinue = newTotal < g.members;
        return kind === "pause"
          ? { ...g, pauseVote: { ...vote, yes, no } }
          : { ...g, deletionVote: { ...vote, yes, no } };
      }));
      step++;
      if (shouldContinue && step < 20) {
        setTimeout(tick, 1200 + Math.random() * 800);
      }
    };
    setTimeout(tick, 1200 + Math.random() * 800);
  };

  const seedDemoPausedNest = () => {
    const groupId = Date.now();
    const nextPayoutDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const myPayoutDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
    const demoNest: Group = {
      id: groupId,
      name: "Demo: Family Savings",
      members: 5,
      totalAmount: 500,
      contributionAmount: 100,
      frequency: "weekly",
      nextPayout: nextPayoutDate.toISOString().split('T')[0],
      payoutRecipient: "Sarah M.",
      progress: 40,
      myTurn: false,
      position: 4,
      myPayoutDate: myPayoutDate.toISOString().split('T')[0],
      membersPaid: 2,
      status: 'active',
      inviteCode: "DEMO-PAUSED",
      adminId: "otherUser",
      isAdmin: false,
      membersList: ["member1", "member2", "member3", "member4", currentUserId],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      isComplete: false,
      allMembersPaidOut: false,
      lockWithdrawals: true,
      allowMultipleContributions: false,
      payoutOrder: 'manual',
      payoutSequence: ["member1", "member2", "member3", "member4", currentUserId],
      hasStarted: true,
      totalPayoutsSent: 200,
      isPaused: true,
      deletionVote: {
        active: true, yes: 1, no: 1, hasVoted: false,
        requestedBy: "Sarah M.",
        requestedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    };
    setGroups(prev => [...prev, demoNest]);
    toast({
      title: "Demo Nest Loaded",
      description: "Open it to see the paused state and cast a deletion vote.",
    });
  };

  const seedDemoCompletedNests = () => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const samples = [
      {
        name: "Holiday Travel Fund",
        members: 6,
        contributionAmount: 250,
        frequency: "monthly",
        completedDaysAgo: 14,
        startedDaysAgo: 200,
      },
      {
        name: "Office Lunch Pool",
        members: 5,
        contributionAmount: 50,
        frequency: "weekly",
        completedDaysAgo: 45,
        startedDaysAgo: 80,
      },
      {
        name: "Down Payment Circle",
        members: 8,
        contributionAmount: 500,
        frequency: "monthly",
        completedDaysAgo: 90,
        startedDaysAgo: 330,
      },
      {
        name: "Wedding Gift Nest",
        members: 4,
        contributionAmount: 150,
        frequency: "weekly",
        completedDaysAgo: 120,
        startedDaysAgo: 180,
      },
    ];

    const completed: Group[] = samples.map((s, idx) => {
      const completedDate = new Date(now - s.completedDaysAgo * day);
      const memberIds = Array.from({ length: s.members - 1 }, (_, i) => `member${idx}_${i}`);
      const fullList = [...memberIds, currentUserId];
      return {
        id: now + idx + 1,
        name: s.name,
        members: s.members,
        totalAmount: s.contributionAmount * s.members,
        contributionAmount: s.contributionAmount,
        frequency: s.frequency,
        nextPayout: completedDate.toISOString().split("T")[0],
        payoutRecipient: "All members paid",
        progress: 100,
        myTurn: false,
        position: (idx % s.members) + 1,
        myPayoutDate: completedDate.toISOString().split("T")[0],
        membersPaid: s.members,
        status: "completed",
        inviteCode: `DONE-${idx}`,
        adminId: idx % 2 === 0 ? currentUserId : "otherUser",
        isAdmin: idx % 2 === 0,
        membersList: fullList,
        createdAt: new Date(now - s.startedDaysAgo * day).toISOString(),
        isComplete: true,
        allMembersPaidOut: true,
        lockWithdrawals: true,
        allowMultipleContributions: false,
        payoutOrder: "randomized",
        payoutSequence: fullList,
        hasStarted: true,
        totalPayoutsSent: s.contributionAmount * s.members,
      };
    });

    setGroups(prev => [...prev, ...completed]);
    toast({
      title: "Demo Completed Nests Loaded",
      description: `${completed.length} archived nests added to your history.`,
    });
  };

  const seedDemoWallet = () => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const unlocked: WalletEntry[] = [
      {
        id: now + 101,
        userId: currentUserId,
        groupId: now + 101,
        groupName: "Summer Savings Circle",
        amount: 1200,
        receivedDate: new Date(now - 12 * day).toISOString(),
        isLocked: false,
        groupLockPolicy: false,
      },
      {
        id: now + 102,
        userId: currentUserId,
        groupId: now + 102,
        groupName: "Family Vacation Fund",
        amount: 800,
        receivedDate: new Date(now - 3 * day).toISOString(),
        isLocked: false,
        groupLockPolicy: false,
      },
    ];

    const locked: WalletEntry[] = [
      {
        id: now + 201,
        userId: currentUserId,
        groupId: now + 201,
        groupName: "Office Lunch Pool",
        amount: 450,
        receivedDate: new Date(now - 5 * day).toISOString(),
        isLocked: true,
        groupLockPolicy: true,
      },
      {
        id: now + 202,
        userId: currentUserId,
        groupId: now + 202,
        groupName: "Holiday Gift Squad",
        amount: 600,
        receivedDate: new Date(now - 1 * day).toISOString(),
        isLocked: true,
        groupLockPolicy: true,
      },
    ];

    const pendingGroups: Group[] = [
      {
        id: now + 301,
        name: "Rent Split Crew",
        members: 6,
        totalAmount: 2400,
        contributionAmount: 400,
        frequency: "monthly",
        nextPayout: new Date(now + 21 * day).toISOString().split("T")[0],
        payoutRecipient: "Alex",
        progress: 50,
        myTurn: false,
        position: 4,
        myPayoutDate: new Date(now + 21 * day).toISOString().split("T")[0],
        membersPaid: 3,
        status: "active",
        inviteCode: "DEMO-RENT",
        adminId: "otherUser",
        isAdmin: false,
        membersList: ["m1", "m2", "m3", currentUserId, "m4", "m5"],
        createdAt: new Date(now - 60 * day).toISOString(),
        isComplete: false,
        allMembersPaidOut: false,
        lockWithdrawals: false,
        allowMultipleContributions: false,
        payoutOrder: "manual",
        payoutSequence: ["m1", "m2", "m3", currentUserId, "m4", "m5"],
        hasStarted: true,
        totalPayoutsSent: 7200,
      },
      {
        id: now + 302,
        name: "Wedding Fund",
        members: 5,
        totalAmount: 1500,
        contributionAmount: 300,
        frequency: "weekly",
        nextPayout: new Date(now + 10 * day).toISOString().split("T")[0],
        payoutRecipient: "Jamie",
        progress: 20,
        myTurn: false,
        position: 2,
        myPayoutDate: new Date(now + 10 * day).toISOString().split("T")[0],
        membersPaid: 1,
        status: "active",
        inviteCode: "DEMO-WED",
        adminId: "otherUser",
        isAdmin: false,
        membersList: ["m1", currentUserId, "m2", "m3", "m4"],
        createdAt: new Date(now - 14 * day).toISOString(),
        isComplete: false,
        allMembersPaidOut: false,
        lockWithdrawals: false,
        allowMultipleContributions: false,
        payoutOrder: "manual",
        payoutSequence: ["m1", currentUserId, "m2", "m3", "m4"],
        hasStarted: true,
        totalPayoutsSent: 1500,
      },
    ];

    setWalletBalance(prev => prev + 250);
    setWalletEntries(prev => [...prev, ...unlocked, ...locked]);
    setGroups(prev => [...prev, ...pendingGroups]);

    toast({
      title: "Demo Wallet Data Loaded",
      description: "Available, pending, and locked example funds added.",
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
      withdrawFunds,
      depositFunds,
      updatePayoutOrder,
      deleteGroup,
      calculateLateJoinerAmount,
      setNestPaused,
      startPauseVote,
      castPauseVote,
      startDeletionVote,
      castDeletionVote,
      seedDemoPausedNest,
      seedDemoCompletedNests,
      seedDemoWallet,
      pendingSettingsTab,
      setPendingSettingsTab,
      navigateToSettings,
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
