# SDU-SURVIVAL-KIT Backend

The backend of SDU-Survival-Kit serves as the foundation for this modern forum application, providing APIs, authentication, and database management. Built with Django and Django REST Framework, it ensures robust and scalable functionality for handling user interactions, content management, and security.

---

## **Backend Features**

### **Core Functionalities**

- **User Authentication**:
  - Registration and login/logout functionalities with secure password hashing.
  - Token-based authentication using Django REST Framework.
- **Password Reset**:
  - Allows users to reset their passwords by sending a reset link to their registered email.
- **Thread Management**:
  - Create, read, update, and delete (CRUD) operations for threads.
  - Browse threads by topic or latest updates.
- **Post Management**:
  - Add posts to threads.
  - CRUD operations for posts.
- **Bookmarking**:
  - API to bookmark specific threads for user convenience.
- **User Profiles**:
  - View and edit user profiles, including avatar uploads and biography updates.

### **Guest Access**

- Guests can browse threads and posts without authentication but cannot interact (post or create threads).

### **API Design**

- RESTful API endpoints for all core functionalities.
- Role-based access control to differentiate between authenticated and guest users.
- JSON-based responses for seamless integration with the frontend.

---

## **Tech Stack**

### **Core Frameworks**

- **Django**: Backend web framework for handling core application logic.
- **Django REST Framework**: API creation, token-based authentication, and serialization.

### **Database**

- **PostgreSQL**: Database for managing structured data, ensuring scalability and reliability.

### **Other Tools**

- **Gunicorn**: WSGI server for deploying Django applications.
- **Nginx**: Reverse proxy server for routing traffic and serving static files.

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone -b backend https://github.com/tortugichh/sdu-survival-kit
cd SduSurvivalKit
```

### **2. Setup Environment**

- Create a virtual environment and install dependencies:
  ```bash
  python -m venv .venv
  source .venv/bin/activate   # On Windows: .venv\Scripts\activate
  pip install -r requirements.txt
  ```

### **3. Configure Environment Variables**

- Create a `.env` file in the root directory and set the following variables:
  ```env
  DEBUG=True
  SECRET_KEY=<your_secret_key>
  ALLOWED_HOSTS=<allowed-hosts>
  DATABASE_NAME=<your_db_name>
  DATABASE_USER=<your_db_user>
  DATABASE_PASSWORD=<your_db_password>
  DATABASE_HOST=127.0.0.1
  DATABASE_PORT=5432
  EMAIL_HOST=<your_email_host>
  EMAIL_PORT=587
  EMAIL_USE_TLS=True
  EMAIL_HOST_USER=<your_email>
  EMAIL_HOST_PASSWORD=<your_email_password>
  ```

### **4. Run Migrations**

- Apply database migrations to set up the database schema:
  ```bash
  python manage.py migrate
  ```

### **5. Create a Superuser**

- Create an admin user for accessing the Django admin panel:
  ```bash
  python manage.py createsuperuser
  ```

### **6. Start the Development Server**

- Run the server locally:
  ```bash
  python manage.py runserver
  ```

---

## **Troubleshooting**

### Gunicorn Fails to Start
- Check the Gunicorn service logs:
  ```bash
  sudo journalctl -u gunicorn
  ```
- Ensure the Gunicorn socket has the correct permissions:
  ```bash
  sudo chown ubuntu:www-data /run/gunicorn.sock
  ```

### Nginx Fails to Serve API
- Check Nginx error logs:
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```
- Ensure the domain name in `/etc/nginx/sites-available/` matches your SSL certificate.

### Database Connection Issues
- Verify `.env` variables for database configuration:
  ```env
  DATABASE_NAME=<your_db_name>
  DATABASE_USER=<your_db_user>
  DATABASE_PASSWORD=<your_db_password>
  DATABASE_HOST=<your_database_host>
  DATABASE_PORT=<your_database_port>
  ```
- Test the connection with:
  ```bash
  psql -U <your_db_user> -d <your_db_name> -h 127.0.0.1 -p 5432
  ```

---

## **Code and Commit Naming Conventions**

### Code Style
- **Python**: Follow PEP 8 guidelines.
- **Variable Naming**: Use `snake_case` for variables and functions.

### Commit Messages
- Use the following format:
  ```
  [Feature/Fix/Refactor]: Brief Description
  ```
  Example:
  ```
  [Feature]: Added password reset functionality
  ```

### Branch Naming
- Use the format `<type>/<description>`:
  - `feature/<feature-name>`
  - `bugfix/<bug-description>`

---

## **Deployment Instructions**

### **1. Configure Gunicorn**

- Install Gunicorn:
  ```bash
  pip install gunicorn
  ```
- Run Gunicorn manually to test:
  ```bash
  gunicorn --bind 0.0.0.0:8000 myforum.wsgi:application
  ```

### **2. Configure Nginx**

- Set up an Nginx configuration file for the backend:
  ```nginx
  server {
      server_name api.sdu-survival-kit.site;

      location / {
          include proxy_params;
          proxy_pass http://unix:/run/gunicorn.sock;
      }

      location /static/ {
          root /home/ubuntu/sdu-survival-kit;
      }

      listen 443 ssl; # managed by Certbot
      ssl_certificate /etc/letsencrypt/live/api.sdu-survival-kit.site/fullchain.pem; # managed by Certbot
      ssl_certificate_key /etc/letsencrypt/live/api.sdu-survival-kit.site/privkey.pem; # managed by Certbot
  }
  ```

### **3. Set Up Systemd for Gunicorn**

- Create a Gunicorn service file at `/etc/systemd/system/gunicorn.service`:
  ```systemd
  [Unit]
  Description=gunicorn daemon
  Requires=gunicorn.socket
  After=network.target

  [Service]
  User=ubuntu
  Group=www-data
  WorkingDirectory=/home/ubuntu/sdu-survival-kit
  ExecStart=/home/ubuntu/sdu-survival-kit/env/bin/gunicorn \
            --access-logfile - \
            --workers 3 \
            --bind unix:/run/gunicorn.sock \
            myforum.wsgi:application

  [Install]
  WantedBy=multi-user.target
  ```
- Reload and start Gunicorn:
  ```bash
  sudo systemctl daemon-reload
  sudo systemctl start gunicorn
  sudo systemctl enable gunicorn
  ```

### **4. Check Status**

- Ensure Gunicorn and Nginx are running:
  ```bash
  sudo systemctl status gunicorn
  sudo systemctl status nginx
  ```

---

## **Deployment Details**

- The backend is deployed on **AWS EC2** using Nginx and Gunicorn.
- The live API is accessible at: [https://api.sdu-survival-kit.site](https://api.sdu-survival-kit.site)

---

## **Testing the Backend**

- Use tools like Postman or cURL to test API endpoints.
- Example cURL request:
  ```bash
  curl -X GET https://api.sdu-survival-kit.site/api/threads/ -H "Authorization: Token <your_token>"
  ```

---

## **Screenshots**

### Example API Response
![API Response in Postman](path/to/postman-screenshot.png)

### Django Admin Panel
![Admin Panel](path/to/admin-screenshot.png)

---

## **Contributing**

Feel free to fork the repository and submit pull requests. Ensure your changes are thoroughly tested before submitting.

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.

