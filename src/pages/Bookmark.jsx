import React, { useState, useEffect, useContext } from 'react';
import BookmarkThreadListItem from '../components/BookmarkThreadListItem';
import AuthContext from '../context/AuthContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../components/Header';
import styles from '../styles_pages/Bookmark.module.css';
import jwtDecode from 'jwt-decode';

const Bookmark = () => {
  const { user, getAuthHeaders, authTokens, updateToken } = useContext(AuthContext);

  const [threads, setThreads] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
    if (!user) return; 

    const getThreads = async () => {
      try {
     
        if (authTokens && isTokenExpired(authTokens.access)) {
          await updateToken();
        }

        const response = await fetch(`https://api.sdu-survival-kit.site/api/bookmark/${user['user_id']}?page=1`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          console.error('Failed to load bookmarked threads. Unauthorized request.');
          return;
        }

        const data = await response.json();
        setThreads(data.results);

        if (data.next === null) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching threads:', err);
      }
    };

    getThreads();
  }, [user, authTokens, getAuthHeaders, updateToken]);

  const fetchMoreThreads = async () => {
    try {
    
      if (authTokens && isTokenExpired(authTokens.access)) {
        await updateToken();
      }

      const response = await fetch(`https://api.sdu-survival-kit.site/api/bookmark/${user['user_id']}?page=${page}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.error('Failed to load more bookmarked threads. Unauthorized request.');
        return;
      }

      const data = await response.json();
      setThreads((prevThreads) => [...prevThreads, ...data.results]);

      if (data.results.length === 0 || data.next === null) {
        setHasMore(false);
      }

      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error('Error fetching more threads:', err);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header/>
      {user ? (
        <div className={styles.container}>
          <h2 className={styles.header}>Bookmarked Threads</h2>
          <div className={styles.threadsContainer}>
            <InfiniteScroll
              dataLength={threads.length}
              next={fetchMoreThreads}
              hasMore={hasMore}
              loader={<p className={styles.loader}>Loading...</p>}
              endMessage={
                <p className={styles.endMessage}>
                  You have seen all the bookmarked threads.
                </p>
              }
            >
              {threads.map((thread, index) => (
                <BookmarkThreadListItem key={index} thread={thread} />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      ) : (
        <p className={styles.unauthenticatedMessage}>
          Please log in to view your bookmarked threads.
        </p>
      )}
    </div>
  );
};

export default Bookmark;
