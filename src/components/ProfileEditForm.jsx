import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Cookies from 'js-cookie';
import styles from '../styles_components/ProfileEditForm.module.css';

const ProfileEditForm = ({ profile, onUpdateProfile }) => {
  const { user, getAuthHeaders } = useContext(AuthContext); // getAuthHeaders to include Authorization
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

    // Get CSRF Token
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      console.error('CSRF-токен отсутствует.');
      return;
    }

    try {
      const response = await fetch(`/api/profile/${userID}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          ...getAuthHeaders(), // Include Authorization headers
        },
        body: JSON.stringify(newProfile),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile updated successfully:', data);

        // Update the parent state to reflect changes immediately
        onUpdateProfile(newProfile);

        handleClose(); // Close the dialog after saving
      } else {
        const errorText = await response.text();
        console.error('Failed to update profile:', errorText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
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
                  value={newProfile.avatar}
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
                  value={newProfile.bio}
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
