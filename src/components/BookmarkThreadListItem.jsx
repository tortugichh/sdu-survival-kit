import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import AuthContext from '../context/AuthContext';
import styles from '../styles_components/BookmarkThreadListItem.module.css';
import Cookies from 'js-cookie';

const BookmarkThreadListItem = ({ thread }) => {
  const { user, getAuthHeaders } = useContext(AuthContext);
  const [hide, setHide] = useState(false);

  const handleBookmark = async () => {
    // Get CSRF Token
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      console.error('CSRF-токен отсутствует.');
      return;
    }

    try {
      const response = await fetch(`https://api.sdu-survival-kit.site/api/pin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          ...getAuthHeaders(), // Include Authorization header
        },
        body: JSON.stringify({
          user: user['user_id'],
          thread: thread.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Bookmark removed.') {
          setHide(true);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to toggle bookmark:', errorText);
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
    }
  };

  return (
    !hide && (
      <div className={styles.threadListItem}>
        <div className={styles.listItem}>
          <Link to={`/threads/${thread.id}`} className={styles.link}>
            <h3 className={styles.title}>{thread?.subject}</h3>
            <p className={styles.secondaryText}>
              <span className={styles.creator}>{thread?.creator}</span>
              {' - updated '}
              <Moment fromNow>{thread?.updated}</Moment>
            </p>
          </Link>
          <button className={styles.removeButton} onClick={handleBookmark}>
            ✖
          </button>
        </div>
        <div className={styles.divider}></div>
      </div>
    )
  );
};

export default BookmarkThreadListItem;
