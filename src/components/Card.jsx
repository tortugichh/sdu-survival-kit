import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import styles from '../styles/Card.module.css';
import AuthContext from '../context/AuthContext';

const Card = ({ title, content, subtitle, link, buttonText, onButtonClick, buttonClassName, upvotes = 0, downvotes = 0, threadId }) => {
  const { authTokens } = useContext(AuthContext);

  const [voteCount, setVoteCount] = useState({
    upvotes: Number(upvotes) || 0,
    downvotes: Number(downvotes) || 0,
  });
  const [userVote, setUserVote] = useState(null); 

  const csrfToken = Cookies.get('csrftoken');

  const handleUpvote = async () => {
    if (!threadId) {
      console.error('Invalid thread ID');
      return;
    }
    try {
      const response = await fetch(`/api/threads/${threadId}/upvote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Bearer ${authTokens?.access}`,
        },
      });

      if (response.ok) {
        setVoteCount((prev) => ({
          ...prev,
          upvotes: userVote === 'upvote' ? prev.upvotes - 1 : prev.upvotes + 1,
          downvotes: userVote === 'downvote' ? prev.downvotes - 1 : prev.downvotes,
        }));
        setUserVote(userVote === 'upvote' ? null : 'upvote');
      } else {
        console.error('Failed to upvote');
      }
    } catch (error) {
      console.error('Error during upvote:', error);
    }
  };

  const handleDownvote = async () => {
    if (!threadId) {
      console.error('Invalid thread ID');
      return;
    }
    try {
      const response = await fetch(`/api/threads/${threadId}/downvote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Bearer ${authTokens?.access}`,
        },
      });

      if (response.ok) {
        setVoteCount((prev) => ({
          ...prev,
          upvotes: userVote === 'upvote' ? prev.upvotes - 1 : prev.upvotes,
          downvotes: userVote === 'downvote' ? prev.downvotes - 1 : prev.downvotes + 1,
        }));
        setUserVote(userVote === 'downvote' ? null : 'downvote');
      } else {
        console.error('Failed to downvote');
      }
    } catch (error) {
      console.error('Error during downvote:', error);
    }
  };

  return (
    <div className={styles.card}>
      {link ? (
        <a href={link} className={styles.cardLink}>
          <h3 className={styles.cardTitle}>{title}</h3>
        </a>
      ) : (
        <h3 className={styles.cardTitle}>{title}</h3>
      )}
      {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
      {content && <p className={styles.cardContent}>{content}</p>}
      {buttonText && (
        <button className={buttonClassName || styles.defaultButton} onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
      <div className={styles.voteContainer}>
        <button
          className={styles.voteButton}
          onClick={handleUpvote}
          disabled={userVote === 'upvote'} 
        >
          Upvote ({voteCount.upvotes})
        </button>
        <button
          className={styles.voteButton}
          onClick={handleDownvote}
          disabled={userVote === 'downvote'} 
        >
          Downvote ({voteCount.downvotes})
        </button>
      </div>
    </div>
  );
};

export default Card;
