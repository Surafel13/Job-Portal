import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import JobDetailPage from "./components/JobDetailPage";
import EditJobPage from "./components/EditJobPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import CompaniesPage from "./pages/CompaniesPage";
import ContactUsPage from "./pages/ContactUsPage";
import ProfilePage from "./pages/ProfilePage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import RegisteredUsersPage from "./pages/RegisteredUsersPage";
import SystemStatisticsPage from "./pages/SystemStatisticsPage";
import CompanyApplicationsPage from "./pages/CompanyApplicationsPage";
import CompanyDashboard from "./pages/CompanyDashboard";
import LandingPage from "./pages/LandingPage";
import MessagesPage from "./pages/MessagesPage";
import { Toaster } from 'react-hot-toast';
import { ChatProvider } from "./context/ChatContext";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/landing" replace />;
  return children;
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <ChatProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/job/:id" element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />
          <Route path="/job/:id/edit" element={<ProtectedRoute><EditJobPage /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
          <Route path="/company-applications" element={<ProtectedRoute><CompanyApplicationsPage /></ProtectedRoute>} />
          <Route path="/company-dashboard" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/companies" element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
          <Route path="/company/:id" element={<ProtectedRoute><CompanyProfilePage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><RegisteredUsersPage /></ProtectedRoute>} />
          <Route path="/admin/stats" element={<ProtectedRoute><SystemStatisticsPage /></ProtectedRoute>} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          {/* 404 */}
          <Route path="*" element={<div>404 - Page not found</div>} />
        </Routes>
      </BrowserRouter>
      </ChatProvider>
    </>
  );
}

export default App;
