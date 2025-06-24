
export const mockUser = {
  name: "Alex Johnson",
  trustScore: 85,
  groupsCompleted: 12,
  avatar: "/placeholder.svg",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  bio: "Saving enthusiast and group organizer"
};

export const mockActiveGroups = [
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
    status: "active"
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
    status: "active"
  }
];
