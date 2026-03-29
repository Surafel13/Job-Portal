# Job Portal

A full-stack Job Portal web application. This platform connects employers with job seekers, empowering employers to post job listings seamlessly and allowing job seekers to seamlessly apply to those listings.

## Project Structure

This project adopts a modern full-stack web architecture, categorized into two main folders:
- `FrontEnd/`: Contains the client-side application (React, utilizing modern Hooks context or state management).
- `BackEnd/`: Contains the server-side API (Node.js/Express.js handling HTTP requests, auth, and DB connections).

## Features

- **Job Listings:** Display, search, and filter available jobs. Detailed views for individual roles.
- **Job Applications:** Job seekers can review and natively apply to preferred job postings.
- **Company Dashboard:** Employers can comprehensively manage job assets, review candidate applications, and evaluate submissions.
- **Authentication & Authorization:** Secure login and role-based mechanisms. Both job seekers and employers possess varying levels of platform access depending on their roles.

## Getting Started

Follow these instructions to set up your local development environment.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB / Relevant Database service

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd "Job Portal"
   ```

2. **Backend Setup:**
   ```bash
   cd BackEnd
   npm install
   # IMPORTANT: Create a .env file and populate it with required database URIs and SECRETS
   npm run dev # or npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../FrontEnd
   npm install
   # Configure your frontend API environment variables (if any)
   npm run dev
   ```

4. Open your browser and navigate to the indicated local development server (e.g., `http://localhost:5173` or `http://localhost:3000`).

## Tech Stack Overview

- **Frontend:** React, HTML, CSS, JavaScript (often Vite or Create React App)
- **Backend:** Node.js, Express.js (REST API architecture)
- **Database:** Standard NoSQL or SQL implementations based on system requirements

## Contributing

Contributions, issues, and feature requests are very welcome! Feel free to refer to the project's issues page to participate in making this platform more robust.
