
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

export const mockCompletedGroups = [
  {
    id: 3,
    name: "Emergency Fund Circle",
    members: 6,
    totalAmount: 1200,
    contributionAmount: 200,
    frequency: "monthly",
    completedDate: "2024-06-15",
    yourPosition: 4,
    status: "completed",
    membersToRate: [
      { id: 1, name: "Sarah M.", avatar: "/placeholder.svg", hasRated: false },
      { id: 2, name: "Mike J.", avatar: "/placeholder.svg", hasRated: true },
      { id: 3, name: "Emma D.", avatar: "/placeholder.svg", hasRated: false },
      { id: 4, name: "James W.", avatar: "/placeholder.svg", hasRated: true },
      { id: 5, name: "Lisa K.", avatar: "/placeholder.svg", hasRated: false }
    ]
  },
  {
    id: 4,
    name: "Holiday Savings Group",
    members: 8,
    totalAmount: 2400,
    contributionAmount: 300,
    frequency: "weekly",
    completedDate: "2024-05-20",
    yourPosition: 2,
    status: "completed",
    membersToRate: [
      { id: 6, name: "David R.", avatar: "/placeholder.svg", hasRated: false },
      { id: 7, name: "Anna L.", avatar: "/placeholder.svg", hasRated: false },
      { id: 8, name: "Tom B.", avatar: "/placeholder.svg", hasRated: true },
      { id: 9, name: "Sophie C.", avatar: "/placeholder.svg", hasRated: false },
      { id: 10, name: "Chris P.", avatar: "/placeholder.svg", hasRated: false },
      { id: 11, name: "Maya S.", avatar: "/placeholder.svg", hasRated: true },
      { id: 12, name: "Alex T.", avatar: "/placeholder.svg", hasRated: false }
    ]
  }
];
