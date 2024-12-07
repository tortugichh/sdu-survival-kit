import React, { useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import styles from '../styles_components/Card.module.css';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Card = ({
  title,
  content,
  subtitle,
  link,
  buttonText,
  onButtonClick,
  buttonClassName,
  threadId,
  showVotes = true,
  upvoteCount = null, 
  downvoteCount = null 
}) => {
  const { authTokens } = useContext(AuthContext);
  const csrfToken = Cookies.get('csrftoken');

  const [voteCount, setVoteCount] = useState({
    upvotes: upvoteCount || 0,
    downvotes: downvoteCount || 0,
  });
  const [userVote, setUserVote] = useState(null);

  const fetchThreadData = () => {
    if (threadId && showVotes) {
      fetch(`https://api.sdu-survival-kit.site/api/threads/${threadId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens?.access}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setVoteCount({
            upvotes: data.upvotes,
            downvotes: data.downvotes,
          });
          if (data.user_vote) {
            setUserVote(data.user_vote);
          }
        })
        .catch((error) => {
          console.error('Error fetching thread data:', error);
        });
    }
  };

  useEffect(() => {
    fetchThreadData();
  }, [threadId, authTokens]);

  const handleUpvote = async () => {
    if (!threadId) {
      console.error('Invalid thread ID');
      return;
    }
    try {
      setVoteCount((prev) => ({
        ...prev,
        upvotes: userVote === 'upvote' ? prev.upvotes - 1 : prev.upvotes + 1,
        downvotes: userVote === 'downvote' ? prev.downvotes - 1 : prev.downvotes,
      }));
      setUserVote(userVote === 'upvote' ? null : 'upvote');

      const response = await fetch(`https://api.sdu-survival-kit.site/api/threads/${threadId}/upvote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Bearer ${authTokens?.access}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to upvote');
        
        setVoteCount((prev) => ({
          ...prev,
          upvotes: userVote === 'upvote' ? prev.upvotes + 1 : prev.upvotes - 1,
          downvotes: userVote === 'downvote' ? prev.downvotes + 1 : prev.downvotes,
        }));
        setUserVote(userVote);
      } else {

        fetchThreadData();
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
      setVoteCount((prev) => ({
        ...prev,
        upvotes: userVote === 'upvote' ? prev.upvotes - 1 : prev.upvotes,
        downvotes: userVote === 'downvote' ? prev.downvotes - 1 : prev.downvotes + 1,
      }));
      setUserVote(userVote === 'downvote' ? null : 'downvote');

      const response = await fetch(`https://api.sdu-survival-kit.site/api/threads/${threadId}/downvote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Bearer ${authTokens?.access}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to downvote');
        setVoteCount((prev) => ({
          ...prev,
          upvotes: userVote === 'upvote' ? prev.upvotes + 1 : prev.upvotes,
          downvotes: userVote === 'downvote' ? prev.downvotes - 1 : prev.downvotes + 1,
        }));
        setUserVote(userVote);
      } else {
        fetchThreadData();
      }
    } catch (error) {
      console.error('Error during downvote:', error);
    }
  };

  return (
    <Link to={link || '#'} className={styles.card}>
      
        <h3 className={styles.cardTitle}>{title}</h3>
        {content && <p className={styles.cardContent}>{content}</p>}
        {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
     
      {buttonText && (
        <button
          className={buttonClassName || styles.defaultButton}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onButtonClick && onButtonClick();
          }}
        >
          {buttonText}
        </button>
      )}
      {showVotes && (
        <div className={styles.voteContainer}>
          <button
            className={`${styles.voteButton} ${userVote === 'upvote' ? styles.activeVote : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleUpvote();
            }}
            disabled={userVote === 'upvote'}
          >
            Upvote: {voteCount.upvotes}
          </button>
          <button
            className={`${styles.voteButton} ${userVote === 'downvote' ? styles.activeVote : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDownvote();
            }}
            disabled={userVote === 'downvote'}
          >
            Downvote: {voteCount.downvotes}
          </button>
        </div>
      )}
    </Link>
  );
};

export default Card;
