import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from '../styles/ResAppBar.module.css';

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    const getProfile = async () => {
      if (user !== null) {
        let userID = user['user_id'];
        const response = await fetch(`./api/profile/${userID}`);
        let data = await response.json();
        setProfile(data);
      }
    };
    getProfile();
  }, [user]);

  const toggleNavMenu = () => {
    setNavOpen(!navOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
            <Link to="/" className={styles.navLink} onClick={toggleNavMenu}>
             
            </Link>
            <div
              className={`${styles.dropdown} ${
                dropdownOpen ? styles.dropdownOpen : ''
              }`}
              onMouseEnter={toggleDropdown}
              onMouseLeave={toggleDropdown}
            >
              <button className={styles.dropbtn}>Topics <img src='/arrow.png'></img></button>
              <div className={styles.dropdownContent}>
                {Object.keys(options).map((key) => (
                  <Link
                    key={key}
                    to={`/topic/${key}`}
                    className={styles.navLink}
                    onClick={toggleNavMenu}
                  >
                    {options[key]}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <div className={styles.userSection}>
            {user ? (
              <div className={styles.loggedInSection}>
                <Link
                  to={`/profile/${user.user_id}`}
                  className={styles.userName}
                >
                  {user.username}
                </Link>
                <button
                  className={styles.avatarButton}
                  onClick={toggleUserMenu}
                >
                  <img
                    src={profile?.avatar || '/default-avatar.png'}
                    alt="User Avatar"
                    className={styles.avatar}
                  />
                </button>
                {userMenuOpen && (
                  <div className={styles.userMenu}>
                    <Link
                      to={`/profile/${user['user_id']}`}
                      className={styles.menuItem}
                    >
                      Profile
                    </Link>
                    <Link to="/bookmark" className={styles.menuItem}>
                      Bookmark
                    </Link>
                    <button onClick={logoutUser} className={styles.menuItem}>
                      Logout
                    </button>
                  </div>
                )}
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
