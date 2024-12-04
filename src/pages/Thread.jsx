import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import PostCardItem from '../components/PostCardItem';
import ReplyForm from '../components/ReplyForm';
import Header from '../components/Header';
import Card from '../components/Card'; // Importing Card component
import styles from '../styles/Thread.module.css';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const Thread = () => {
  const { user, getAuthHeaders, updateToken, authTokens } = useContext(AuthContext);
  const params = useParams();
  const threadID = params.id;

  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pin, setPin] = useState(false);
  const [loading, setLoading] = useState(true);

  const getCSRFToken = () => {
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      console.error('CSRF-token отсутствует.');
    }
    return csrfToken;
  };

  const isTokenExpired = (token) => {
    try {
      if (!token) {
        console.error('Токен отсутствует или пуст.');
        return true;
      }

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Ошибка при декодировании токена:', error);
      return true;
    }
  };

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await fetch(`/api/threads/${threadID}/`);
        if (!response.ok) {
          console.error('Failed to fetch thread:', response.statusText);
          return;
        }
        const data = await response.json();
        setThread(data);
      } catch (error) {
        console.error('Error fetching thread:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        let headers = {};
        if (user) {
          if (isTokenExpired(authTokens.access)) {
            await updateToken();
          }

          headers = getAuthHeaders();
        }

        const response = await fetch(`/api/threads/${threadID}/posts/`, {
          headers,
        });

        if (!response.ok) {
          console.error('Failed to fetch posts:', await response.text());
          return;
        }
        const data = await response.json();
        setPosts(data.results);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchPinStatus = async () => {
      if (user) {
        try {
          if (isTokenExpired(authTokens.access)) {
            await updateToken();
          }

          const response = await fetch(`/api/pin/${threadID}&&${user.user_id}/`, {
            headers: getAuthHeaders(),
          });
          if (!response.ok) return;

          const data = await response.json();
          setPin(JSON.parse(data.pinned));
        } catch (error) {
          console.error('Error fetching pin status:', error);
        }
      }
    };

    setLoading(true);
    Promise.all([fetchThread(), fetchPosts(), fetchPinStatus()]).then(() => setLoading(false));
  }, [threadID, user, authTokens, getAuthHeaders, updateToken]);

  const handlePinToggle = async () => {
    if (!authTokens) {
      console.error('Токены доступа отсутствуют. Пользователь не авторизован.');
      return;
    }

    try {
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        console.error('CSRF token not found.');
        return;
      }

      const response = await fetch(`/api/pin/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          thread: threadID,
        }),
      });

      if (response.ok) {
        setPin(!pin);
      } else {
        console.error('Failed to update pin status:', await response.text());
      }
    } catch (error) {
      console.error('Error updating pin status:', error);
    }
  };

  if (loading) {
    return <p>Loading thread and posts...</p>;
  }

  return (
    <div className={styles.container}>
      <Header />
      {!user && (
        <div className={styles.loginPrompt}>
          <p style={{ color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
            You need to log in to interact with this thread (e.g., make posts or bookmark).
          </p>
        </div>
      )}
      <Card
        
        title={thread?.subject}
        content={thread?.content}
        subtitle={
          <>Posted by <Link to={`/profile/${thread?.creator_id}`}>{thread?.creator}</Link> on {thread?.created}</>
        }
      >
       
      </Card>
      {user && (
          <button
            className={`${styles.bookmarkButton} ${pin ? styles.pinned : ''}`}
            onClick={handlePinToggle}
          >
            {pin ? 'Unpin' : 'Pin'}
          </button>
        )}
      <div className={styles.posts}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCardItem key={index} post={post} />
          ))
        ) : (
          <p className={styles.noPostsMessage}>There are no posts yet for this thread.</p>
        )}
      </div>

      {user && <ReplyForm thread={thread} />}
    </div>
  );
};

export default Thread;