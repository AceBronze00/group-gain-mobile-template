
import ProfileHeader from "./ProfileHeader";
import SettingsSection from "./SettingsSection";
import QuickInfoCard from "./QuickInfoCard";

interface User {
  name: string;
  trustScore: number;
  groupsCompleted: number;
  avatar: string;
  email: string;
  phone: string;
  bio: string;
}

interface ActiveGroup {
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
  status: string;
}

interface ProfileContentProps {
  user: User;
  activeGroups: ActiveGroup[];
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  onTrustScoreClick: () => void;
  onSettingClick: (tab: string) => void;
}

const ProfileContent = ({ 
  user, 
  activeGroups, 
  isSettingsOpen, 
  setIsSettingsOpen, 
  onTrustScoreClick, 
  onSettingClick 
}: ProfileContentProps) => {
  return (
    <div className="space-y-6 pb-20">
      <ProfileHeader 
        user={user} 
        activeGroups={activeGroups} 
        onTrustScoreClick={onTrustScoreClick} 
      />
      
      <SettingsSection 
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        onSettingClick={onSettingClick}
      />

      <QuickInfoCard user={user} />
    </div>
  );
};

export default ProfileContent;
