import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Thread from './pages/Thread';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PasswordReset from './pages/PasswordReset';
import PasswordConfirm from './pages/PasswordConfirm';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Bookmark from './pages/Bookmark';
import Topic from './pages/Topic';
import Profile from './pages/Profile';
import styles from './App.module.css';

const App = () => {
  return (
    <body>
      <Router>
        <AuthProvider>
          <div className={styles.App}>
            
          
              <Routes>
                <Route path="/" element={<Home />} />
               
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/passwordreset" element={<PasswordReset/>}/>
                <Route path="/passwordconfirm/:uid/:token" element={<PasswordConfirm />} />
                <Route path="/threads/:id" element={<Thread />} />
                <Route path="/topic/:id" element={<Topic />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/bookmark" element={<Bookmark />} />
                </Route>
              </Routes>
            {/* <Footer /> */}
          </div>
        </AuthProvider>
      </Router>
    </body>
  );
};

export default App;
