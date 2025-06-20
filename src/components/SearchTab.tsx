
import { useState } from 'react';
import UserSearchModal from "@/components/UserSearchModal";

const SearchTab = () => {
  const [showUserSearch, setShowUserSearch] = useState(true);

  return (
    <div className="pb-20">
      <UserSearchModal 
        open={showUserSearch} 
        onOpenChange={setShowUserSearch} 
      />
    </div>
  );
};

export default SearchTab;
