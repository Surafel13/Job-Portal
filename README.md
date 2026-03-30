# 🚀 Job Portal Web Application

A modern **Full-Stack Job Portal** designed to seamlessly connect **job seekers**, **companies**, and **administrators**.
This platform enables efficient job posting, application management, and user interaction through a clean and intuitive interface.

---

## 🌐 Live Demo

🔗 **Live Demo:** *(Add your deployed link here)*

The system is already deployed.

---

## 👥 Demo Accounts

Use the following demo credentials to explore different roles:

### 👤 Job Seeker (User)

* **Email:** [abebe@gmail.com](mailto:user@example.com)
* **Password:** 111111

### 🏢 Company (Employer)

* **Email:** [dsa@gmail.com](mailto:company@example.com)
* **Password:** 111111

### 🛠️ Admin

* **Email:** [admin@gmail.com](mailto:admin@example.com)
* **Password:** 111111

---

## 🎯 Key Features

### 🔍 Job Management

* Browse, search, and filter job listings
* View detailed job descriptions

### 📄 Applications

* Apply to jobs directly through the platform
* Track submitted applications
* Allow users and campanies comminunication (currentlly I am working on this. It is not finished).

### 🏢 Company Dashboard

* Post and manage job listings
* View and evaluate applicants

### 🔐 Authentication & Authorization

* Secure login system
* Role-based access:

  * User
  * Company
  * Admin

---

## 🏗️ Project Structure

```
Job Portal/
│
├── FrontEnd/   → React client application
└── BackEnd/    → Node.js & Express API
```

* **FrontEnd:** Handles UI and user interaction
* **BackEnd:** Handles API, authentication, and database operations

---

## ⚙️ Tech Stack

* **Frontend:** React, HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (or any configured database)

---

## 🧑‍💻 Step-by-Step Setup Guide

Follow these steps to run the project locally:

### 1️⃣ Clone the Repository

```bash
git clone <repository_url>
cd "Job Portal"
```

---

### 2️⃣ Setup Backend

```bash
cd BackEnd
npm install
```

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd ../FrontEnd
npm install
```

Run frontend:

```bash
npm run dev
```

---

### 4️⃣ Open the Application

Go to:

```
http://localhost:5173
```

or

```
http://localhost:3000
```

---

## 🧭 How to Use the System

### 👤 As a Job Seeker

1. Sign up or log in
2. Browse available jobs
3. Apply to preferred positions
4. Track your applications

---

### 🏢 As a Company

1. Log in as a company
2. Create job postings
3. Manage job listings
4. Review applicants

---

### 🛠️ As an Admin

1. Log in as admin
2. Manage users and companies
3. Monitor system activities

---

## 🤝 Contributing

Contributions are welcome!

* Fork the repository
* Create a new branch
* Submit a pull request

---

## ⭐ Final Note

This project demonstrates a complete **real-world full-stack application**, including authentication, role management, and dynamic data handling.

---
