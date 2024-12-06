import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles_components/PostCardItem.module.css';

const PostCardItem = ({ post }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.content}>{post?.content}</div>
        <div className={styles.meta}>
          <Link to={`/profile/${post?.creator_id}`} className={styles.creator}>
            {post?.creator}
          </Link>{' '}
          posted on {post?.created}
        </div>
      </div>
    </div>
  );
};

export default PostCardItem;
