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
import EditProject from './pages/EditProject'; // 

/* --- PROTECTED ROUTE WRAPPER --- */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{color:'white', padding:'20px'}}>Loading Auth...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/* --- LAYOUT COMPONENT --- */
const Layout = ({ children }) => {
  const location = useLocation();
  
  
  const hideNavbarRoutes = ["/", "/dashboard", "/create", "/login"];
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
              
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              
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
