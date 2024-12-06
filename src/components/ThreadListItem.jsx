import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import styles from '../styles_components/ThreadListItem.module.css';

const ThreadListItem = ({ thread }) => {
  return (
    <div className={styles.threadListItem}>
      <div className={styles.listItem}>
        <Link to={`/threads/${thread.id}`} className={styles.link}>
          <h3 className={styles.subject}>{thread?.subject}</h3>
          <p className={styles.secondaryText}>
            <span className={styles.creator}>{thread?.creator}</span>
            <span className={styles.updated}>
              {' - updated '}
              <Moment fromNow>{thread?.updated}</Moment>
            </span>
          </p>
        </Link>
      </div>
      <div className={styles.divider}></div>
    </div>
  );
};

export default ThreadListItem;
