import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import PostCardItem from '../components/PostCardItem';
import ReplyForm from '../components/ReplyForm';
import styles from '../styles/Thread.module.css';

const Thread = () => {
  let { user } = useContext(AuthContext);

  const params = useParams();
  const threadID = params.id;

  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pin, setPin] = useState(false);

  useEffect(() => {
    const getBookmark = async () => {
      if (user) {
        const response = await fetch(`/api/pin/${threadID}&&${user['user_id']}`);
        const data = await response.json();
        setPin(JSON.parse(data.pinned));
      }
    };
    getBookmark();
  }, [threadID, user]);

  useEffect(() => {
    const getThread = async () => {
      const response = await fetch(`/api/threads/${threadID}`);
      const data = await response.json();
      setThread(data);
    };
    getThread();
  }, [threadID]);

  useEffect(() => {
    const getPosts = async () => {
      const response = await fetch(`/api/threads/${threadID}/posts?page=${page}`);
      const data = await response.json();
      setPosts(data.results);
      if (data.next === null) {
        setHasMore(false);
      }
      setPage(page + 1);
    };
    getPosts();
  }, [threadID]);

  const getMorePosts = async () => {
    try {
      const response = await fetch(`/api/threads/${threadID}/posts?page=${page}`);
      const data = await response.json();
      return data.results;
    } catch {
      console.log('No next page.');
      return [];
    }
  };

  const fetchData = async () => {
    const morePosts = await getMorePosts();
    setPosts((prevPosts) => [...prevPosts, ...morePosts]);
    if (morePosts.length === 0 || morePosts.length < 10) {
      setHasMore(false);
    }
    setPage(page + 1);
  };

  const handleBookmark = async () => {
    setPin(!pin);
    const response = await fetch(`/api/pin/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user['user_id'],
        thread: threadID,
        pin: pin ? false : true,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>{thread?.subject}</h2>
          <button className={styles.moreButton}>⋮</button>
        </div>
        <div className={styles.content}>
          <p className={styles.text}>{thread?.content}</p>
        </div>
        <div className={styles.meta}>
          <Link to={`/profile/${thread?.creator_id}`} className={styles.creator}>
            {thread?.creator}
          </Link>{' '}
          posted on {thread?.created}
        </div>
        <div className={styles.actions}>
          {user && (
            <button
              className={`${styles.bookmarkButton} ${pin ? styles.pinned : ''}`}
              onClick={handleBookmark}
            >
              {pin ? 'Unpin' : 'Pin'}
            </button>
          )}
          <button className={styles.shareButton}>Share</button>
        </div>
      </div>

      <div className={styles.posts}>
        {posts.map((post, index) => (
          <PostCardItem key={index} post={post} />
        ))}
        {hasMore && (
          <button className={styles.loadMoreButton} onClick={fetchData}>
            Load More
          </button>
        )}
        {!hasMore && <p className={styles.endMessage}>You have seen all the posts.</p>}
      </div>

      <ReplyForm thread={thread} />
    </div>
  );
};

export default Thread;
