import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles_pages/PasswordReset.module.css';
import Cookies from 'js-cookie';

const PasswordConfirm = () => {
  const { uid, token } = useParams(); 
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    

    try {
      
      const csrfToken = Cookies.get('csrftoken');
      const response = await fetch('https://api.sdu-survival-kit.site/api/password_reset_confirm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, 
        },
        body: JSON.stringify({ uid, token, new_password: newPassword }),
      });

      if (response.ok) {
        setMessage('Password reset successful. You will be redirected to login.');
        setTimeout(() => navigate('/login'), 5000); 
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.resetCard}>
        <h2 className={styles.title}>Reset Your Password</h2>
        <p className={styles.subTitle}>
          Enter your new password below.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Reset Password</button>
        </form>
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default PasswordConfirm;
