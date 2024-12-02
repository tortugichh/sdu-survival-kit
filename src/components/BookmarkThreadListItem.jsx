import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import AuthContext from '../context/AuthContext';
import styles from '../styles/BookmarkThreadListItem.module.css';

const BookmarkThreadListItem = ({ thread }) => {
  const { user } = useContext(AuthContext);
  const [hide, setHide] = useState(false);

  const handleBookmark = async () => {
    setHide(true);

    const response = await fetch(`/api/pin/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user['user_id'],
        thread: thread.id,
        pin: false,
      }),
    });

    const data = await response.json();
    console.log(data);
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
