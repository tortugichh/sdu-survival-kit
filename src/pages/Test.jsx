import React, { useEffect, useState, useCallback } from 'react';
import ThreadListItem from '../components/ThreadListItem';
import styles from './Test.module.css';
const Test = () => {
  const [threads, setThreads] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // Initial fetch
    const getThreads = async () => {
      try {
        const response = await fetch(`/api/threads/?page=${page}`);
        const data = await response.json();
        setThreads(data.results);
        if (data.results.length === 0 || data.results.length < 15) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching threads:', err);
      }
    };
    getThreads();
  }, []); // Run only once on mount

  const fetchMoreThreads = useCallback(async () => {
    if (!hasMore || isFetching) return;

    setIsFetching(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/threads/?page=${nextPage}`);
      const data = await response.json();

      setThreads((prevThreads) => [...prevThreads, ...data.results]);
      if (data.results.length === 0 || data.results.length < 15) {
        setHasMore(false);
      }
      setPage(nextPage);
    } catch (err) {
      console.error('Error fetching more threads:', err);
    } finally {
      setIsFetching(false);
    }
  }, [page, hasMore, isFetching]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 10 &&
      hasMore
    ) {
      fetchMoreThreads();
    }
  }, [fetchMoreThreads, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div>
      {threads.map((thread, index) => (
        <ThreadListItem key={index} thread={thread} />
      ))}
      {isFetching && <h4 style={{ textAlign: 'center' }}>Loading...</h4>}
      {!hasMore && (
        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <span>You have seen all the threads.</span>
        </p>
      )}
    </div>
  );
};

export default Test;
