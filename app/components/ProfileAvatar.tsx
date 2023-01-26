import FallbackUserAvatar from './FallbackUserAvatar';
import type { SerializedUserAuthData } from '~/core/session/types/user-session';

const ProfileAvatar: React.FCC<{ user: Maybe<SerializedUserAuthData> }> = ({
  user,
}) => {
  if (!user) {
    return null;
  }

  const photoURL = user?.photoURL;
  const size = 36;

  if (photoURL) {
    return (
      <div>
        <img
          loading={'lazy'}
          decoding={'async'}
          width={size}
          height={size}
          className={'rounded-full object-cover'}
          src={photoURL}
          alt={photoURL}
          style={{ height: size }}
        />
      </div>
    );
  }

  return <FallbackUserAvatar text={getUserInitials(user)} />;
};

function getUserInitials(user: SerializedUserAuthData) {
  const displayName = getDisplayName(user);

  return displayName[0] ?? '';
}

function getDisplayName(user: SerializedUserAuthData) {
  if (user.displayName) {
    return user.displayName;
  }

  return user.email ?? '';
}

export default ProfileAvatar;
