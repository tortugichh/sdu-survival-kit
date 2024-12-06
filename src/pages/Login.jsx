import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import styles from '../styles_pages/Login.module.css';
import { Link } from 'react-router-dom';
import login_image from '../assets/login.jpg';
import logo from '../assets/logo.svg';

const SignIn = () => {
  const { loginUser } = useContext(AuthContext);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.signupCard}>
        <div className={styles.imageSection}>
          <img src={login_image} alt="image" className={styles.image} />
        </div>
        <div className={styles.formSection}>
          <h2 className={styles.title}>Log in</h2>
          <p className={styles.subTitle}>
            Don't have an account? <a href="/signup" className={styles.link}>Sign up</a>
          </p>
          <form className={styles.form} onSubmit={loginUser}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className={styles.input}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className={styles.input}
            />
            <div className={styles.forgotPasswordContainer}>
              <Link to="/passwordreset" className={styles.forgotPasswordLink}>
                Forgot password?
              </Link>
            </div>
            <button type="submit" className={styles.button}>Log in</button>
          </form>
          <footer className={styles.footer}>
            <Link to="/" className={styles.footerLogo}>
              <img src={logo} alt="Logo" />
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
