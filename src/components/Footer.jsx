import React from 'react';
import styles from '../styles_components/Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© {new Date().getFullYear()} SduSurvivalKit. All rights reserved.</p>
          <p>
      
            <img src="./logo.svg" className={styles.link}></img>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
