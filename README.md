# 🏨 Hotel Management System API

A backend RESTful API for managing a hotel system built using **Node.js, Express, Sequelize, and MySQL**.  
The system supports authentication, role-based access control, and full CRUD operations for hotel entities such as guests, rooms, bookings, services, and payments.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration & login
- JWT-based authentication
- Role-based access control (Admin / Receptionist)

### 👤 User Roles
- **Admin**
  - Full system access
- **Receptionist**
  - Manage guests and bookings

### 🏨 Core Modules
- Guests management (CRUD + search + pagination)
- Rooms management
- Room types management
- Bookings system with date validation
- Services management
- Booking services (many-to-many relation)
- Payments model (structure ready)

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT (Authentication)
- bcrypt (Password hashing)
- Joi (Validation)

---

## 📁 Project Structure

---

## 🔐 Authentication Flow

1. Register a user
2. Login to get JWT token
3. Use token in headers:

---

## 📌 API Modules

### 👤 Auth
- POST `/auth/register`
- POST `/auth/login`
- GET `/auth/me`

### 👥 Guests
- GET `/guests`
- GET `/guests/:id`
- POST `/guests`
- PUT `/guests/:id`
- DELETE `/guests/:id`

### 🏨 Rooms
- Full CRUD operations

### 🏷️ Room Types
- Full CRUD operations

### 🛎️ Services
- Full CRUD operations

### 📦 Bookings
- Create booking with validation
- Check room availability
- Add services to booking
- Auto price calculation

---

## 🔒 Role Permissions

| Module     | Admin | Receptionist |
|------------|------|-------------|
| Guests     | ✔    | ✔           |
| Rooms      | ✔    | ❌          |
| Room Types | ✔    | ❌          |
| Services   | ✔    | ❌          |
| Bookings   | ✔    | ✔           |
| Payments   | ✔    | ❌          |

---

## ⚙️ Setup Instructions

### 1. Clone repository
```bash
git clone https://github.com/your-username/hotel-management-api.git

npm install

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hotel_db
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d

npm run dev

📌 Key Features Implemented
JWT Authentication
Role-Based Access Control
Sequelize Associations (One-to-Many, Many-to-Many)
Booking conflict validation (date overlap check)
Service pricing calculation inside bookings
Pagination & filtering
Input validation using Joi

🧠 What I Learned From This Project
Building scalable backend architecture
Database relationships in Sequelize
Authentication & authorization flow
Real-world booking system logic
API design best practices

📷 Future Improvements
Payment gateway integration
Email notifications
Swagger API documentation
Unit testing (Jest)
Docker support

👨‍💻 Author
Abdelrahman Kamel
Computer Science Student | Backend Developer (Node.js)