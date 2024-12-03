import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from '../styles/ResAppBar.module.css';
import jwtDecode from 'jwt-decode';

const options = {
  1: 'Social life',
  2: 'Professors',
  3: 'Schedule',
  4: 'Mental Health',
  5: 'Programming',
  6: 'Math',
  7: 'Languages',
  8: 'Other',
};

const ResAppBar = () => {
  const [profile, setProfile] = useState();
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, logoutUser, getAuthHeaders, updateToken, authTokens } = useContext(AuthContext);

  useEffect(() => {
    const getProfile = async () => {
      if (user !== null) {
        let userID = user['user_id'];

        try {
          // Ensure token is updated if expired
          if (authTokens && isTokenExpired(authTokens.access)) {
            await updateToken();
          }

          const response = await fetch(`/api/profile/${userID}/`, {
            headers: getAuthHeaders(),
          });

          if (!response.ok) {
            console.error('Failed to load profile. Unauthorized request.');
            return;
          }

          const data = await response.json();
          setProfile(data);
        } catch (err) {
          console.error('The requested profile does not exist or unauthorized.');
        }
      }
    };

    getProfile();
  }, [user, authTokens, getAuthHeaders, updateToken]);

  const isTokenExpired = (token) => {
    try {
      if (!token) {
        console.error('Токен отсутствует или пуст.');
        return true;
      }

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Ошибка при декодировании токена:', error);
      return true;
    }
  };

  const toggleNavMenu = () => {
    setNavOpen(!navOpen);
  };

  return (
    <header className={styles.appBar}>
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <Link to="/" className={styles.logo}>
            <img src="/logo.svg" alt="Logo" />
          </Link>
          <button className={styles.menuButton} onClick={toggleNavMenu}>
            ☰
          </button>
          <nav className={`${styles.navMenu} ${navOpen ? styles.open : ''}`}>
            <div
              className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ''}`}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className={styles.dropbtn}>Topics <img src='/arrow.png'></img></button>
              <div className={styles.dropdownContent}>
                {Object.keys(options).map((key) => (
                  <Link
                    key={key}
                    to={`/topic/${key}`}
                    className={styles.navLink}
                    onClick={() => setNavOpen(false)}
                  >
                    {options[key]}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <div className={styles.userSection}>
            {user ? (
              <div
                className={styles.dropdown}
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <button className={styles.avatarButton}>
                  <img
                    src={profile?.avatar || '/default-avatar.png'}
                    alt="User Avatar"
                    className={styles.avatar}
                  />
                </button>
                <div
                  className={`${styles.dropdownContent} ${
                    userDropdownOpen ? styles.dropdownOpen : ''
                  }`}
                >
                  <Link to={`/profile/${user.user_id}`} className={styles.navLink}>
                    Profile
                  </Link>
                  <Link to="/bookmark" className={styles.navLink}>
                    Bookmark
                  </Link>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault(); // Чтобы ссылка не перезагружала страницу
                      logoutUser();
                    }}
                    className={styles.navLink}
                  >
                    Logout
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.authLinks}>
                <Link to="/signup" className={styles.authLink}>
                  Sign Up
                </Link>
                <Link to="/login" className={styles.authLink}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ResAppBar;
