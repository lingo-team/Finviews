import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  profile_picture: string | null;
}

export function UserAvatar() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('profile_picture')
          .eq('user_id', user.id)
          .single();

        if (profile?.profile_picture) {
          setProfilePicture(profile.profile_picture);
        }
      }
    }

    fetchUserProfile();
  }, []);

  if (!profilePicture) {
    return (
      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
        <span className="text-white font-medium">FV</span>
      </div>
    );
  }

  return (
    <img
      src={profilePicture}
      alt="User profile"
      className="h-8 w-8 rounded-full object-cover"
    />
  );
}