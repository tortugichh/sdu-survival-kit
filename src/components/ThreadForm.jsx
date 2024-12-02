import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styles from '../styles/ThreadForm.module.css';

const ThreadForm = () => {
  const { user } = useContext(AuthContext);

  const [alertShow, setAlertShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState({
    subject: '',
    content: '',
    topic: '',
    creator: { user },
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const options = [
    { value: 1, label: 'Social life' },
    { value: 2, label: 'Professors' },
    { value: 3, label: 'Schedule' },
    { value: 4, label: 'Mental Health' },
    { value: 5, label: 'Programming' },
    { value: 6, label: 'Math' },
    { value: 7, label: 'Languages' },
    { value: 8, label: 'Other' },
  ];

  const handleThread = async (event) => {
    event.preventDefault();

    if (!user) {
      setAlertShow(true);
      return;
    }

    const response = await fetch(`/api/threads/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
  
      },
      body: JSON.stringify(thread),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <div className={styles.newThreadButtonContainer}>
        <button className={styles.newThreadButton} onClick={handleClickOpen}>
          New Thread
        </button>
      </div>

      {open && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            {alertShow && (
              <div className={styles.alert}>
                <p>
                  Please login to add new thread.{' '}
                  <Link to="/login">Click here to login.</Link>
                </p>
                <button
                  className={styles.alertClose}
                  onClick={() => setAlertShow(false)}
                >
                  ×
                </button>
              </div>
            )}
            <form onSubmit={handleThread}>
              <div className={styles.dialogHeader}>
                <h2>New Thread</h2>
                <button className={styles.dialogClose} onClick={handleClose}>
                  ×
                </button>
              </div>
              <div className={styles.dialogContent}>
                <label htmlFor="topic" className={styles.label}>
                  Choose the topic of your thread:
                </label>
                <select
                  id="topic"
                  className={styles.select}
                  required
                  value={thread.topic}
                  onChange={(e) =>
                    setThread({ ...thread, topic: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <label htmlFor="subject" className={styles.label}>
                  Title:
                </label>
                <input
                  id="subject"
                  type="text"
                  className={styles.input}
                  required
                  value={thread.subject}
                  onChange={(e) =>
                    setThread({ ...thread, subject: e.target.value })
                  }
                />

                <label htmlFor="content" className={styles.label}>
                  What's on your mind?
                </label>
                <textarea
                  id="content"
                  className={styles.textarea}
                  rows="10"
                  required
                  value={thread.content}
                  onChange={(e) =>
                    setThread({
                      ...thread,
                      content: e.target.value
                        .replace(/\\n/g, '\n')
                        .replace(/\\"/g, '"'),
                    })
                  }
                />
              </div>
              <div className={styles.dialogActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadForm;
