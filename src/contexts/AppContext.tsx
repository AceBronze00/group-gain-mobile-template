
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
}

interface AppContextType {
  groups: Group[];
  walletBalance: number;
  createGroup: (groupData: any) => void;
  makePayment: (groupId: number, amount: number) => void;
  joinGroup: (groupCode: string) => void;
  cashoutGroup: (groupId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialGroups: Group[] = [
  {
    id: 1,
    name: "Coffee Fund",
    members: 5,
    totalAmount: 500,
    contributionAmount: 100,
    frequency: "weekly",
    nextPayout: "2024-06-27",
    payoutRecipient: "Sarah M.",
    progress: 80,
    myTurn: false,
    position: 3,
    myPayoutDate: "2024-07-11",
    membersPaid: 4,
    status: 'active',
    allowDoubleContribution: false
  },
  {
    id: 2,
    name: "Vacation Pool",
    members: 8,
    totalAmount: 2400,
    contributionAmount: 300,
    frequency: "monthly",
    nextPayout: "2024-07-15",
    payoutRecipient: "You",
    progress: 60,
    myTurn: true,
    position: 1,
    myPayoutDate: "2024-07-15",
    membersPaid: 5,
    status: 'active',
    allowDoubleContribution: true,
    isDoubleContributor: false
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [walletBalance, setWalletBalance] = useState(1250.75);
  const { toast } = useToast();

  const createGroup = (groupData: any) => {
    const newGroup: Group = {
      id: Date.now(),
      name: groupData.groupName,
      members: parseInt(groupData.memberLimit),
      totalAmount: parseFloat(groupData.contributionAmount) * parseInt(groupData.memberLimit),
      contributionAmount: parseFloat(groupData.contributionAmount),
      frequency: groupData.frequency,
      nextPayout: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      payoutRecipient: "You",
      progress: 12,
      myTurn: true,
      position: 1,
      myPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      membersPaid: 1,
      status: 'active',
      allowDoubleContribution: groupData.allowDoubleContribution || false,
      isDoubleContributor: false
    };

    setGroups(prev => [...prev, newGroup]);
    toast({
      title: "Group Created!",
      description: `"${groupData.groupName}" has been created successfully.`,
    });
  };

  const makePayment = (groupId: number, amount: number) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const newMembersPaid = group.membersPaid + 1;
        const newProgress = Math.min((newMembersPaid / group.members) * 100, 100);
        
        if (group.myTurn && newProgress >= 100) {
          const payoutAmount = group.isDoubleContributor ? group.totalAmount * 2 : group.totalAmount;
          setWalletBalance(prevBalance => prevBalance + payoutAmount);
          toast({
            title: "Payment Complete!",
            description: `You've received $${payoutAmount} from "${group.name}"`,
          });
          
          return {
            ...group,
            progress: 0,
            membersPaid: 0,
            myTurn: false,
            position: group.position + 1,
            payoutRecipient: "Next Member",
            nextPayout: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            myPayoutDate: new Date(Date.now() + (group.members - 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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

    toast({
      title: "Payment Successful!",
      description: `Payment of $${amount} has been processed.`,
    });
  };

  const joinGroup = (groupCode: string) => {
    const newGroup: Group = {
      id: Date.now(),
      name: `Group ${groupCode}`,
      members: 6,
      totalAmount: 600,
      contributionAmount: 100,
      frequency: "weekly",
      nextPayout: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      payoutRecipient: "Member 1",
      progress: 33,
      myTurn: false,
      position: 4,
      myPayoutDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      membersPaid: 2,
      status: 'active',
      allowDoubleContribution: Math.random() > 0.5,
      isDoubleContributor: false
    };

    setGroups(prev => [...prev, newGroup]);
    toast({
      title: "Joined Group!",
      description: `Successfully joined group with code: ${groupCode}`,
    });
  };

  const cashoutGroup = (groupId: number) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      const payoutAmount = group.isDoubleContributor ? group.totalAmount * 2 : group.totalAmount;
      setWalletBalance(prev => prev + payoutAmount);
      toast({
        title: "Cashout Successful!",
        description: `$${payoutAmount} has been added to your wallet.`,
      });
    }
  };

  return (
    <AppContext.Provider value={{
      groups,
      walletBalance,
      createGroup,
      makePayment,
      joinGroup,
      cashoutGroup
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
