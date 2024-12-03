
import React from 'react';
import styles from '../styles/Card.module.css';

const Card = ({ title, content, subtitle, link }) => {
  return (
    <div className={styles.card}>
      {link ? (
        <a href={link} className={styles.cardLink}>
          <h3 className={styles.cardTitle}>{title}</h3>
        </a>
      ) : (
        <h3 className={styles.cardTitle}>{title}</h3>
      )}
      {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
    </div>
  );
};

export default Card;
