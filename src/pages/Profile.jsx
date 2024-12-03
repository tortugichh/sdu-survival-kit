import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ProfileEditForm from '../components/ProfileEditForm';
import styles from '../styles/Profile.module.css';

const Profile = () => {
  let { user, authTokens } = useContext(AuthContext);  // Import authTokens from the AuthContext

  let params = useParams();
  let profileID = params.id;

  let isMyself = user !== null && user['user_id'] === parseInt(profileID);

  const [profile, setProfile] = useState();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${profileID}`, {
          headers: {
            'Authorization': `Bearer ${authTokens?.access}`,  // Use the authTokens here
          },
        });
        if (response.ok) {
          let data = await response.json();
          setProfile(data);
        } else {
          console.error('Failed to fetch the profile data, authorization issue.');
        }
      } catch (err) {
        console.error('The requested profile does not exist or unauthorized.');
      }
    };

    if (authTokens) {
      getProfile();
    }
  }, [profileID, authTokens]);

  return (
    <div className={styles.container}>
      {profile && (
        <div className={styles.profileWrapper}>
          <h1 className={styles.profileTitle}>{profile?.name}'s Profile</h1>

          <div className={styles.card}>
            {isMyself && <ProfileEditForm profile={profile} />}

            <div className={styles.avatarSection}>
              <img
                className={styles.avatar}
                src={profile?.avatar}
                alt="avatar"
              />
              <h2 className={styles.profileName}>{profile?.name}</h2>
              <div className={styles.status}>{profile?.status}</div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.bioSection}>
              <p className={styles.bio}>{profile?.bio}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
