import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import styles from '../styles/ProfileEditForm.module.css';

const ProfileEditForm = ({ profile }) => {
  const { user } = useContext(AuthContext);
  const userID = user['user_id'];

  const [open, setOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    avatar: profile.avatar,
    bio: profile.bio,
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleProfile = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/profile/${userID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfile),
    });
    const data = await response.json();
    console.log(data);
    handleClose(); // Close the dialog after saving
  };

  return (
    <div className={styles.container}>
      <button className={styles.editButton} onClick={handleClickOpen}>
        ✎
      </button>

      {open && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <form onSubmit={handleProfile} className={styles.form}>
              <div className={styles.dialogHeader}>
                <h2>Edit Profile</h2>
                <button className={styles.closeButton} onClick={handleClose}>
                  ×
                </button>
              </div>
              <div className={styles.dialogContent}>
                <label htmlFor="avatar" className={styles.label}>
                  Avatar URL:
                </label>
                <input
                  id="avatar"
                  type="url"
                  className={styles.input}
                  required
                  defaultValue={profile?.avatar}
                  onChange={(e) =>
                    setNewProfile({ ...newProfile, avatar: e.target.value })
                  }
                />

                <label htmlFor="bio" className={styles.label}>
                  Biography:
                </label>
                <textarea
                  id="bio"
                  className={styles.textarea}
                  rows="4"
                  required
                  defaultValue={profile?.bio}
                  onChange={(e) =>
                    setNewProfile({ ...newProfile, bio: e.target.value })
                  }
                />
              </div>
              <div className={styles.dialogActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditForm;
