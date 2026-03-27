# Court Diary Frontend (React + Redux Toolkit)

## Overview

This project is a frontend application built using React.js.
It implements authentication (Register, Login, Dashboard) using Redux Toolkit for efficient and scalable state management.

---

## Features

* User Registration
* User Login with JWT Authentication
* Global State Management using Redux Toolkit
* Protected Dashboard Route
* Logout Functionality
* Clean and Scalable Project Structure

---

## Tech Stack

* React.js
* Redux Toolkit
* React Router DOM
* JavaScript (ES6+)
* Spring Boot (Backend API)

---

## Migration Update

Replaced Context API with Redux Toolkit to improve:

* State management
* Scalability
* Maintainability

---

## Project Structure

```
src/
 ├── app/
 │     └── store.js
 ├── features/
 │     └── auth/
 │           └── authSlice.js
 ├── services/
 │     └── authService.js
 ├── pages/
 │     ├── Login.jsx
 │     ├── Register.jsx
 │     └── Dashboard.jsx
 ├── components/
 │     └── ProtectedRoute.jsx
 ├── App.js
 └── index.js
```

---

## Setup Instructions

### Clone Repository

```
git clone <your-repo-url>
cd court-diary-frontend
```

### Install Dependencies

```
npm install
```

### Run Application

```
npm start
```

---

## Authentication Flow

Register → Login → Dashboard

1. User registers
2. User logs in with credentials
3. Backend returns JWT token
4. Token stored in Redux store and localStorage
5. Dashboard is accessed via protected route

---

## Redux Toolkit Implementation

### Slice (authSlice.js)

Handles login and logout actions and stores JWT token.

### Store (store.js)

Central store configuration using configureStore.

### Usage

Dispatch action:

```
dispatch(login(token));
```

Access state:

```
const token = useSelector((state) => state.auth.token);
```

---

## Protected Routes

* Dashboard is accessible only when user is authenticated
* Redirects to login if token is not available

---

## API Integration

* POST /api/auth/register
* POST /api/auth/login

---

## Important Notes

* Backend should run on http://localhost:8080
* CORS must be enabled in backend
* Token is stored in localStorage for session persistence

---

## Future Improvements

* Axios interceptor for API calls
* Role-based authorization
* UI enhancements
* Token expiration handling
* Refresh token mechanism

---

## Author

Rishav Kumar
Full Stack Developer (Spring Boot + React)

---

## Conclusion

This project demonstrates a scalable authentication system using Redux Toolkit, replacing Context API for better performance and maintainability.
