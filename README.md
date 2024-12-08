# SDU-SURVIVAL-KIT Frontend

The frontend of SDU-Survival-Kit is a user-centric interface designed to provide a seamless forum experience for students. Built with React.js, it ensures an interactive and responsive UI for engaging with threads, posts, and other features.

---

## **Frontend Features**

### **Core Functionalities**

- **Authentication**:
  - Login and token-based session management.
  - Context-based authentication handling for secure user interactions.
- **Thread Management**:
  - Create, read, and interact with threads in various categories.
  - Infinite scrolling for browsing threads effortlessly.
- **Upvotes and Downvotes**:
  - Engage with threads using voting mechanisms.
  - Real-time updates on votes and user activity.
- **Top Threads**:
  - Display the most popular threads for quick access.
- **Topic Navigation**:
  - Filter threads by topics like programming, math, mental health, and more.
- **Responsive Design**:
  - Fully optimized for mobile and desktop experiences.

### **Guest Access**

- Guests can browse threads and view content but cannot vote or create threads.

---

## **Tech Stack**

### **Core Frameworks and Libraries**

- **React.js**: Core library for building the user interface.
- **React Router**: For navigation and routing.
- **AuthContext**: State management for authentication.
- **CSS Modules**: Scoped styling for components.

### **Other Tools**

- **Infinite Scroll**: For dynamic content loading.
- **JS-Cookie**: Handling cookies for CSRF tokens.
- **Fetch API**: For interacting with the backend API.

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone -b frontend https://github.com/tortugichh/sdu-survival-kit
cd sdu-survival-kit
```

### **2. Install Dependencies**

- Install the required Node.js packages:
  ```bash
  npm install
  ```
  
### **3. Run the Development Server**

- Start the React development server:
  ```bash
  npm start
  ```

- Open your browser at [http://localhost:3000](http://localhost:3000).

---

## **Directory Structure**

```plaintext
src/
├── components/        # Reusable React components (e.g., Header, Card, ThreadForm)
├── context/           # Authentication and other global context files
├── pages/             # Page components (e.g., ThreadListPage, LoginPage)
├── styles_components/ # CSS Modules for component-specific styles
├── styles_pages/      # CSS Modules for page-specific styles
├── App.js             # Main application file
├── index.js           # React entry point
└── utils/             # Helper functions and utilities
```

---

## **Code Conventions**

### Component Naming
- Use `PascalCase` for components (e.g., `ThreadForm`, `Card`).

### CSS Modules
- Use scoped styles to avoid conflicts.
- Use `BEM` naming convention inside CSS modules.

### Commit Messages
- Use the following format:
  ```
  [Feature/Fix/Refactor]: Brief Description
  ```
  Example:
  ```
  [Feature]: Added upvote and downvote functionality
  ```

### Branch Naming
- Use the format `<type>/<description>`:
  - `feature/<feature-name>`
  - `bugfix/<bug-description>`

---

## **Deployment**

The frontend is deployed using **Vercel**, providing a globally distributed platform for high performance.

### **Deployment Steps**

1. **Build the Project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   - Install the Vercel CLI:
     ```bash
     npm install -g vercel
     ```
   - Deploy the build:
     ```bash
     vercel
     ```

3. **Environment Variables**:
   - Set the `REACT_APP_API_URL` variable in the Vercel project settings.

4. **Access the Deployed Site**:
   - The site will be available at the Vercel-provided URL (e.g., `https://sdu-survival-kit.vercel.app`).

---

## **Testing the Frontend**

### Manual Testing
- Use the local server.
- Test thread creation, navigation, voting, and authentication workflows.

### API Testing
- Interact with the backend API directly using Postman or the browser console.

---

## **Screenshots**

### Home Page
![Home Page](https://i.imgur.com/xP3hoYO.png)

### Profile
![Profile Page](https://i.imgur.com/QUwe6Hv.png)

---

## **Contributing**

Feel free to fork the repository and submit pull requests. Make sure your changes are thoroughly tested and follow the code conventions.

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.
