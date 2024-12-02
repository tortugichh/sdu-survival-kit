import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ThreadListItem from '../components/ThreadListItem';
import ThreadForm from '../components/ThreadForm';
import styles from '../styles/Topic.module.css';

const Topic = () => {
  const params = useParams();
  const topicID = params.id;

  const topics = [
    'Social life',
    'Professors',
    'Schedule',
    'Mental Health',
    'Programming',
    'Math',
    'Languages',
    'Other',
  ];

  const [threads, setThreads] = useState([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const getThreads = async () => {
      const response = await fetch(`/api/threads/topic/${topicID}?page=1`);
      const data = await response.json();
      setThreads(data.results);
      if (data.next === null) {
        setHasMore(false);
      }
    };
    getThreads();
  }, [params, topicID]);

  const getMoreThreads = async () => {
    try {
      const response = await fetch(`/api/threads/topic/${topicID}?page=${page}`);
      const data = await response.json();
      return data.results;
    } catch (err) {
      console.log('No next page.');
      return [];
    }
  };

  const fetchData = async () => {
    const moreThreads = await getMoreThreads();
    setThreads((prevThreads) => [...prevThreads, ...moreThreads]);
    if (moreThreads.length === 0 || moreThreads.length < 10) {
      setHasMore(false);
    }
    setPage(page + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{topics[topicID - 1]} Threads</h1>
        <ThreadForm />
      </div>
      <div className={styles.content}>
        {threads.length > 0 ? (
          <div className={styles.threads}>
            {threads.map((thread, index) => (
              <ThreadListItem key={index} thread={thread} />
            ))}
            {hasMore && (
              <button className={styles.loadMoreButton} onClick={fetchData}>
                Load More
              </button>
            )}
            {!hasMore && (
              <p className={styles.endMessage}>You have seen all the threads.</p>
            )}
          </div>
        ) : (
          <h4 className={styles.loading}>Loading...</h4>
        )}
      </div>
    </div>
  );
};

export default Topic;
