# SDU-SURVIVAL-KIT

A modern, fully functional forum web application that allows users to interact with threads and posts in a seamless, responsive environment. This project integrates robust authentication, user-friendly interfaces, and features designed to enhance user experience.

---

## **Functions**

### **User Features**
- **Registration**: Create an account to participate in the forum.
- **Login / Logout**: Secure authentication to access user-specific functionalities.
- **Browse All Threads**: View a list of all threads, sorted by the latest updates.
- **Browse Threads by Topic**: Filter threads based on topics of interest.
- **Add New Thread**: Start a discussion by creating a new thread.
- **Add New Post**: Reply to threads with posts.
- **Bookmark Page**: Save specific threads or pages for easy access later.
- **User Profile Page**:
  - Edit avatar.
  - Update biography.

### **Guest Features**
- Guests (unauthenticated users) can browse all threads and posts without creating an account.

---

## **Features**
- **Token-Based Authentication**: Ensures secure and scalable access for authenticated users.
- **Infinite Scrolling**: Smooth browsing experience with dynamically loaded content.
- **Mobile Responsive**: Fully functional on mobile devices with a responsive design.
- **Role-based Access**: Unauthenticated users can explore content, but actions like posting require authentication.

---

## **Tech Stack**

### **Backend**
- **Python Django**: Web framework for robust backend development.
- **Django REST Framework**: Handles API creation and authentication.

### **Frontend**
- **React.jsx**: Provides a responsive and dynamic user interface.

### **Database**
- **PostgreSQL**: Lightweight and efficient database for storage.

### **Other**
- **HTML5 / CSS**: Core technologies for structuring and styling web pages.

---

## **Setup Instructions**

1. **Clone the Repository**:
   ```bash
   git clone <https://github.com/tortugichh/SduSurvivalKit>
   cd SduSurvivalKit
   ```

2. **Setup**:
   - Create a virtual environment and install dependencies:
     ```bash
     python -m venv .venv
     source .venv/bin/activate   # On Windows: .venv\Scripts\activate
     pip install -r requirements.txt
     ```
   - Run migrations and start the development server:
     ```bash
     python manage.py migrate
     python manage.py runserver
     ```
---