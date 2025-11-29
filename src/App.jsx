import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';

// 👇 IMPORT ALL PAGES
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import Login from './pages/Login';
import EditProject from './pages/EditProject'; // 👈 THIS WAS MISSING OR NOT CONNECTED

/* --- PROTECTED ROUTE WRAPPER --- */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{color:'white', padding:'20px'}}>Loading Auth...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/* --- LAYOUT COMPONENT --- */
/* This hides the Global Navbar on pages that have their own internal headers */
const Layout = ({ children }) => {
  const location = useLocation();
  
  // Pages where we DO NOT want the global navbar to show
  // We hide it on "/" (Home), "/dashboard", and "/create" because they have their own designs now
  const hideNavbarRoutes = ["/", "/dashboard", "/create", "/login"];
  
  // We ALSO want to hide it on edit pages, which start with "/edit"
  const isEditPage = location.pathname.startsWith("/edit");
  
  const showNavbar = !hideNavbarRoutes.includes(location.pathname) && !isEditPage;

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <CreateProject />
                  </ProtectedRoute>
                } 
              />

              {/* 👇 THIS IS THE MISSING ROUTE 👇 */}
              <Route 
                path="/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditProject />
                  </ProtectedRoute>
                } 
              />

            </Routes>
          </Layout>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;