
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import TrustScoreProfile from "@/components/TrustScoreProfile";
import ProfileSettings from "./ProfileSettings";
import ProfileContent from "./ProfileContent";
import { mockUser } from "@/data/mockUserData";
import { useApp } from "@/contexts/AppContext";
import NestListModal from "./NestListModal";
import GroupDetailsModal from "@/components/GroupDetailsModal";

const ProfileTab = () => {
  const { pendingSettingsTab, setPendingSettingsTab, groups } = useApp();
  const [activeSettingsTab, setActiveSettingsTab] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTrustScore, setShowTrustScore] = useState(false);
  const [nestListVariant, setNestListVariant] = useState<"active" | "completed" | null>(null);
  const [selectedNest, setSelectedNest] = useState<any>(null);

  // Handle navigation from other components (like SettingsTab)
  useEffect(() => {
    if (pendingSettingsTab) {
      setActiveSettingsTab(pendingSettingsTab);
      setPendingSettingsTab(null);
    }
  }, [pendingSettingsTab, setPendingSettingsTab]);

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
      />
    );
  }

  const activeGroups = groups.filter((g) => g.status !== "completed");

  return (
    <>
      <ProfileContent
        user={mockUser}
        activeGroups={activeGroups as any}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        onTrustScoreClick={() => setShowTrustScore(true)}
        onSettingClick={setActiveSettingsTab}
        onActiveNestsClick={() => setNestListVariant("active")}
        onCompletedNestsClick={() => setNestListVariant("completed")}
      />
      {nestListVariant && (
        <NestListModal
          open={!!nestListVariant}
          onOpenChange={(o) => !o && setNestListVariant(null)}
          variant={nestListVariant}
          onSelect={(nest) => {
            setSelectedNest(nest);
            setNestListVariant(null);
          }}
        />
      )}
      {selectedNest && (
        <GroupDetailsModal
          group={selectedNest}
          open={!!selectedNest}
          onOpenChange={(o) => !o && setSelectedNest(null)}
        />
      )}
    </>
  );
};

export default ProfileTab;
