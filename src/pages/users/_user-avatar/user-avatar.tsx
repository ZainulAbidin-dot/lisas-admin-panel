import { VerifiedIcon } from 'lucide-react';

import styles from './user-avatar.module.css';

interface UserAvatarProps {
  profileImage: string;
  name: string;
  isVerified: boolean;
  profileCompletionPercentage: number;
}

export function UserAvatar({
  profileImage,
  isVerified,
  profileCompletionPercentage,
}: UserAvatarProps) {
  return (
    <div className={styles['user-avatar-wrapper']}>
      <div className={styles['user-avatar-image-wrapper']}>
        <img
          src={profileImage}
          alt="name"
          className={styles['user-avatar-image']}
        />
        {isVerified && (
          <div className={styles['user-avatar-verified-icon-wrapper']}>
            <VerifiedIcon
              className={styles['user-avatar-verified-icon']}
              fill="#0097fc"
            />
          </div>
        )}
      </div>
      <div className={styles['profile-completion-percentage']}>
        {profileCompletionPercentage}% Completed
      </div>
    </div>
  );
}
