import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThreadListItem from '../components/ThreadListItem';
import ThreadForm from '../components/ThreadForm';
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../components/Header';
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
          const response = await fetch('api/topThreads');
          const data = await response.json();
          setTopThreads(data);
        };
        getTopThreads();
      }, []);

      useEffect(() => {
        const getThreads = async () => {
          const response = await fetch('/api/threads/?page=1');
          const data = await response.json();
          setThreads(data.results);
          if (data.next === null) {
            setHasMore(false);
          }
        };
        getThreads();
      }, []);

      const getMoreThreads = async () => {
        const response = await fetch(`/api/threads/?page=${page}`);
        const data = await response.json();
        return data.results;
      };

      const fetchData = async () => {
        const moreThreads = await getMoreThreads();
        setThreads((prevThreads) => [...prevThreads, ...moreThreads]);
        if (moreThreads.length === 0 || moreThreads.length < 15) {
          setHasMore(false);
        }
        setPage((prevPage) => prevPage + 1);
      };

      return (
      <div className={styles.pageContainer}>
        <Header/>
      <div className={styles.contentWrapper}>
        
        <aside className={styles.leftSidebar}>
          
          <div className={styles.topicList}>
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
            <ThreadForm />
          </div>
          <div className={styles.threadContainer}>
            <InfiniteScroll
              dataLength={threads.length}
              next={fetchData}
              hasMore={hasMore}
              loader={<p className={styles.loaderText}>Loading...</p>}
              endMessage={<p className={styles.endMessage}>You have seen all the threads.</p>}
            >
              {threads.map((thread, index) => (
                <ThreadListItem key={index} thread={thread} />
              ))}
            </InfiniteScroll>
          </div>
        </main>

        <aside className={styles.rightSidebar}>
          <h2>Top Threads</h2>
          {topThreads.map((thread) => (
            <div key={thread.id} className={styles.topThread}>
              <Link to={`/threads/${thread.id}`} className={styles.threadLink}>
                <div className={styles.threadCard}>
                  <h3>{thread.subject}</h3>
                  <p className={styles.threadCreator}>{thread.creator}</p>
                  <p className={styles.threadReplyCount}>Replies: {thread.replyCount}</p>
                </div>
              </Link>
            </div>
          ))}
        </aside>
      </div>
    </div>

  );
};

export default ThreadListPage;
