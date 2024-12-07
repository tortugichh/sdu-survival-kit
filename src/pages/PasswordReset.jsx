import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles_pages/PasswordReset.module.css';
import Cookies from 'js-cookie';
import Header from '../components/Header';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();


    const csrfToken = Cookies.get('csrftoken');

    try {
      const response = await fetch('https://api.sdu-survival-kit.site/api/password_reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Вставляем CSRF токен
        },
        body: JSON.stringify({ email }), // Передаем email в теле запроса
      });

      if (response.ok) {
        setMessage('Password reset link has been sent to your email.');
        setTimeout(() => navigate('/'), 1000); 
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send password reset link.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header/>
      <div className={styles.resetCard}>
        <h2 className={styles.title}>Reset Your Password</h2>
        <p className={styles.subTitle}>
          Enter your email address below and we'll send you a link to reset your password.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Send Reset Link</button>
        </form>
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default PasswordReset;
