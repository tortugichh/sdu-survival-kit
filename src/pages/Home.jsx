import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThreadForm from '../components/ThreadForm';
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../components/Header';
import Card from '../components/Card';
import styles from '../styles/Home.module.css';

const ThreadListPage = () => {
  const [threads, setThreads] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);
  const [topThreads, setTopThreads] = useState([]);

  const topics = {
    1: 'Social life',
    2: 'Professors',
    3: 'Schedule',
    4: 'Mental Health',
    5: 'Programming',
    6: 'Math',
    7: 'Languages',
    8: 'Other',
  };

  useEffect(() => {
    const getTopThreads = async () => {
      try {
        const response = await fetch('/api/topThreads');
        if (!response.ok) {
          throw new Error('Failed to fetch top threads');
        }
        const data = await response.json();
        if (data && Array.isArray(data.results)) {
          setTopThreads(data.results);
        } else {
          console.error('Unexpected data format for top threads:', data);
          setTopThreads([]);
        }
      } catch (error) {
        console.error('Error fetching top threads:', error);
        setTopThreads([]);
      }
    };
    getTopThreads();
  }, []);

  useEffect(() => {
    const getThreads = async () => {
      try {
        const response = await fetch('/api/threads/?page=1');
        if (!response.ok) {
          throw new Error('Failed to fetch threads');
        }
        const data = await response.json();
        if (Array.isArray(data.results)) {
          setThreads(data.results);
          if (data.next === null) {
            setHasMore(false);
          }
        } else {
          console.error('Unexpected data format for threads:', data);
          setThreads([]);
        }
      } catch (error) {
        console.error('Error fetching threads:', error);
        setThreads([]);
      }
    };
    getThreads();
  }, []);

  const getMoreThreads = async () => {
    try {
      const response = await fetch(`/api/threads/?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch more threads');
      }
      const data = await response.json();
      if (Array.isArray(data.results)) {
        return data.results;
      } else {
        console.error('Unexpected data format for more threads:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching more threads:', error);
      return [];
    }
  };

  const fetchData = async () => {
    const moreThreads = await getMoreThreads();
    setThreads((prevThreads) => [...prevThreads, ...moreThreads]);
    if (moreThreads.length === 0 || moreThreads.length < 15) {
      setHasMore(false);
    }
    setPage((prevPage) => prevPage + 1);
  };

  const handleThreadCreated = (newThread) => {
    setThreads((prevThreads) => [newThread, ...prevThreads]);
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.contentWrapper}>
        <aside className={styles.leftSidebar}>
          <div className={styles.leftHeader}></div>
          <div className={styles.topicList}>
            <h2>Topics</h2>
            {Object.keys(topics).map((key) => (
              <div key={key} className={styles.topics}>
                <Link to={`/topic/${key}`} className={styles.topicLink}>
                  {topics[key]}
                </Link>
              </div>
            ))}
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h2>Latest Threads</h2>
            <ThreadForm onThreadCreated={handleThreadCreated} />
          </div>
          <div className={styles.threadContainer}>
            <InfiniteScroll
              dataLength={threads.length}
              next={fetchData}
              hasMore={hasMore}
              loader={<p className={styles.loaderText}>Loading...</p>}
              endMessage={<p className={styles.endMessage}>You have seen all the threads.</p>}
            >
              {Array.isArray(threads) &&
                threads.map((thread, index) => (
                  <Card
                    key={index}
                    title={thread.subject}
                    subtitle={`${thread?.creator} - posted on ${thread.created}`}
                    content={thread.content}
                    link={`/threads/${thread.id}`}
                    upvotes={thread.upvotes?.length || 0}
                    downvotes={thread.downvotes?.length || 0}
                    threadId={thread.id}
                  />
                ))}
            </InfiniteScroll>
          </div>
        </main>

        <aside className={styles.rightSidebar}>
          <h2>Top Threads</h2>
          <div className={styles.threadContainer}>
            {Array.isArray(topThreads) &&
              topThreads.map((thread) => (
                <Card
                  key={thread.id}
                  title={thread.subject}
                  subtitle={thread.creator}
                  link={`/threads/${thread.id}`}
                  upvoteCount={thread.upvotes?.length || 0} // Display upvote count
                  downvoteCount={thread.downvotes?.length || 0} // Display downvote count
                  showVotes={false} // Hide upvote/downvote buttons
                />
              ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ThreadListPage;
