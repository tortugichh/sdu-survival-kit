import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import PostCardItem from '../components/PostCardItem';
import ReplyForm from '../components/ReplyForm';
import styles from '../styles/Thread.module.css';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const Thread = () => {
  const { user, authTokens, setAuthTokens, logoutUser } = useContext(AuthContext);
  const params = useParams();
  const threadID = params.id;

  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pin, setPin] = useState(false);
  const [loading, setLoading] = useState(true);

  const getCSRFToken = () => {
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      console.error('CSRF-token отсутствует.');
    }
    return csrfToken;
  };

  const refreshAccessToken = async () => {
    if (!authTokens?.refresh) {
      logoutUser();
      return null;
    }

    try {
      const response = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthTokens((prevTokens) => ({ ...prevTokens, access: data.access }));
        return data.access;
      } else {
        console.error('Не удалось обновить токен доступа:', await response.text());
        logoutUser();
      }
    } catch (error) {
      console.error('Ошибка при обновлении токена доступа:', error);
      logoutUser();
    }
    return null;
  };

  useEffect(() => {
    if (!authTokens) {
      console.error('Токены доступа отсутствуют. Перенаправляем пользователя на страницу входа.');
      window.location.href = '/login';
      return;
    }

    const fetchThread = async () => {
      try {
        const response = await fetch(`/api/threads/${threadID}/`);
        if (!response.ok) {
          console.error('Failed to fetch thread:', response.statusText);
          return;
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setThread(data);
        } else {
          console.error('Expected JSON but got HTML instead:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching thread:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        let accessToken = authTokens.access;

        if (isTokenExpired(accessToken)) {
          accessToken = await refreshAccessToken();
          if (!accessToken) {
            console.error('Не удалось обновить токен доступа.');
            return;
          }
        }

        const response = await fetch(`/api/threads/${threadID}/posts/?page=1`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch posts:', errorText);
          return;
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setPosts(data.results);
          setHasMore(data.next !== null);
        } else {
          console.error('Expected JSON but got HTML instead:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchPinStatus = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/pin/${threadID}&&${user.user_id}/`);
          if (!response.ok) return;
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            setPin(JSON.parse(data.pinned));
          } else {
            console.error('Expected JSON but got HTML instead:', await response.text());
          }
        } catch (error) {
          console.error('Error fetching pin status:', error);
        }
      }
    };

    setLoading(true);
    Promise.all([fetchThread(), fetchPosts(), fetchPinStatus()]).then(() =>
      setLoading(false)
    );
  }, [threadID, user, authTokens]);

  const handleLoadMore = async () => {
    if (!authTokens) {
      console.error('Токены доступа отсутствуют. Пользователь не авторизован.');
      return;
    }

    try {
      let accessToken = authTokens.access;

      if (isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken();
        if (!accessToken) {
          console.error('Не удалось обновить токен доступа.');
          return;
        }
      }

      const response = await fetch(`/api/threads/${threadID}/posts/?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch more posts:', errorText);
        return;
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setPosts((prevPosts) => [...prevPosts, ...data.results]);
        setHasMore(data.next !== null);
        setPage((prevPage) => prevPage + 1);
      } else {
        console.error('Expected JSON but got HTML instead:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
    }
  };

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
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Bearer ${authTokens.access}`,
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

  if (loading) {
    return <p>Loading thread and posts...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>{thread?.subject}</h2>
          {user && (
            <button
              className={`${styles.bookmarkButton} ${pin ? styles.pinned : ''}`}
              onClick={handlePinToggle}
            >
              {pin ? 'Unpin' : 'Pin'}
            </button>
          )}
        </div>
        <div className={styles.content}>
          <p className={styles.text}>{thread?.content}</p>
        </div>
        <div className={styles.meta}>
          <Link to={`/profile/${thread?.creator_id}`} className={styles.creator}>
            {thread?.creator}
          </Link>
          {' '}posted on {thread?.created}
        </div>
      </div>

      <div className={styles.posts}>
        {posts.map((post, index) => (
          <PostCardItem key={index} post={post} />
        ))}
        {hasMore && (
          <button className={styles.loadMoreButton} onClick={handleLoadMore}>
            Load More
          </button>
        )}
        {!hasMore && <p className={styles.endMessage}>You have seen all the posts.</p>}
      </div>

      {user && <ReplyForm thread={thread} />}
    </div>
  );
};

export default Thread;