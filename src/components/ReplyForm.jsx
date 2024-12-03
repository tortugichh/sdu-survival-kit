import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from '../styles/ReplyForm.module.css';
import Cookies from 'js-cookie';

const ReplyForm = ({ thread }) => {
  const { user, authTokens } = useContext(AuthContext);
  const threadID = thread?.id;

  const [alertShow, setAlertShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState({
    content: '',
    thread: '',
    creator: { user },
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePost = async (event) => {
    event.preventDefault();

    if (!user) {
      setAlertShow(true);
      return;
    }

    // Get CSRF Token
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      console.error('CSRF-токен отсутствует.');
      return;
    }

    try {
      const response = await fetch(`/api/posts/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({
          ...post,
          thread: threadID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Post created:', data);
        setPost({ content: '', thread: '', creator: { user } });
        handleClose();
        window.location.reload(); // Reload to display the new reply
      } else {
        const errorText = await response.text();
        console.error('Failed to create post:', errorText);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.fab} onClick={handleClickOpen}>
        +
      </button>

      {open && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            {alertShow && (
              <div className={styles.alert}>
                <p>
                  Please login to reply to this thread.{' '}
                  <Link to="/login" className={styles.link}>
                    Click here to login.
                  </Link>
                </p>
                <button
                  className={styles.alertClose}
                  onClick={() => setAlertShow(false)}
                >
                  ×
                </button>
              </div>
            )}
            <form onSubmit={handlePost}>
              <div className={styles.dialogHeader}>
                <h2>
                  New Reply to <strong>{thread?.subject}</strong>
                </h2>
                <button className={styles.dialogClose} onClick={handleClose}>
                  ×
                </button>
              </div>
              <div className={styles.dialogContent}>
                <textarea
                  className={styles.textarea}
                  placeholder="What's on your mind?"
                  rows="10"
                  required
                  onChange={(e) =>
                    setPost({
                      ...post,
                      content: e.target.value,
                      thread: threadID,
                    })
                  }
                  value={post.content}
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
                <button type="submit" className={styles.submitButton}>
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyForm;
