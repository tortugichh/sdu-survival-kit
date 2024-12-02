import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import styles from '../styles/Signup.module.css';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const { registerUser } = useContext(AuthContext); // Get registerUser from context
  const [errors, setErrors] = useState([]); // State for errors

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const response = await registerUser(e); // Call registerUser from AuthContext

    // If there are errors, update the errors state
    if (response?.errors) {
      setErrors(response.errors);
    } else {
      setErrors([]); // Clear errors if registration is successful
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.signupCard}>
        <div className={styles.imageSection}>
          <img src="./image.jpg" alt="3D Torus" className={styles.image} />
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.title}>Create an account</h2>
          <p className={styles.subTitle}>
            Already have an account? <Link to="/login" className={styles.link}>Log in</Link>
          </p>

          {/* Display errors if they exist */}
          {errors.length > 0 && (
            <div className={styles.errorBox}>
              {errors.map((err, index) => (
                <p key={index} className={styles.errorText}>{err}</p>
              ))}
            </div>
          )}

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
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
            <input
              type="password"
              name="password2"
              placeholder="Confirm password"
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>Sign up</button>
          </form>

          <footer className={styles.footer}>
            <Link to="/" className={styles.footerLogo}>
              <img src="/logo.svg" alt="Logo" />
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
