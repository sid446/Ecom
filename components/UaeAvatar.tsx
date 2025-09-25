import React from 'react';

// Define the shape of the user profile we expect
interface UserProfile {
  name?: string;
}

interface UserAvatarProps {
  user: UserProfile | null;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  // Function to calculate initials from the user's name
  const getInitials = (name: string | undefined): string => {
    if (!name) return '?';

    const words = name.split(' ');
    const firstInitial = words[0]?.[0] || '';
    const lastInitial = words.length > 1 ? words[words.length - 1]?.[0] : '';
    
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const initials = getInitials(user?.name);

  return (
    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-zinc-700 text-white rounded-full font-bold text-xs">
      {initials}
    </div>
  );
};

export default UserAvatar;