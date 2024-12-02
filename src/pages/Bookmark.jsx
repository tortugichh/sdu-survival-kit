import React, { useState, useEffect, useContext } from 'react';
import BookmarkThreadListItem from '../components/BookmarkThreadListItem';
import AuthContext from '../context/AuthContext';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from '../styles/Bookmark.module.css';

const Bookmark = () => {
  const { user } = useContext(AuthContext);

  const [threads, setThreads] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!user) return; // Ensure user is defined before making API call

    const getThreads = async () => {
      try {
        const response = await fetch(`/api/bookmark/${user['user_id']}?page=1`); // Start from page 1
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
  }, [user]);

  const fetchMoreThreads = async () => {
    try {
      const response = await fetch(`/api/bookmark/${user['user_id']}?page=${page}`);
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
