
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import TrustScoreProfile from "@/components/TrustScoreProfile";
import ProfileSettings from "./ProfileSettings";
import ProfileContent from "./ProfileContent";
import { mockUser, mockActiveGroups } from "@/data/mockUserData";

const ProfileTab = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTrustScore, setShowTrustScore] = useState(false);

  if (showTrustScore) {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setShowTrustScore(false)}
            className="text-blue-600"
          >
            ← Back to Profile
          </Button>
        </div>
        <TrustScoreProfile />
      </div>
    );
  }

  if (activeSettingsTab) {
    return (
      <ProfileSettings
        activeSettingsTab={activeSettingsTab}
        setActiveSettingsTab={setActiveSettingsTab}
        user={mockUser}
        activeGroups={mockActiveGroups}
      />
    );
  }

  return (
    <ProfileContent
      user={mockUser}
      activeGroups={mockActiveGroups}
      isSettingsOpen={isSettingsOpen}
      setIsSettingsOpen={setIsSettingsOpen}
      onTrustScoreClick={() => setShowTrustScore(true)}
      onSettingClick={setActiveSettingsTab}
    />
  );
};

export default ProfileTab;
