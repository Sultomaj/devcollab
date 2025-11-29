import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext'; 
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard'; 
import { Link } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
  const { projects, loading, applyToProject } = useProjects();
  const { user, logout } = useAuth(); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleJoin = (project) => {
    if (!user) { alert("Please login to join a team!"); return; }
    const current = project.current_members || 1;
    const max = project.max_members || 3;
    if (current >= max) { alert("Sorry, this team is already full! 🔒"); return; }
    const message = prompt(`Write a short message to ${project.author_name} explaining why you want to join:`);
    if (message) applyToProject(project.id, message);
  };

  const filteredProjects = projects.filter((project) => {
    const searchLower = searchTerm.toLowerCase();
    return project.title?.toLowerCase().includes(searchLower) || 
           project.skills?.toLowerCase().includes(searchLower);
  });

  if (loading) return <div className="loading-text">Loading projects...</div>;

  return (
    <div className="home-container">
      
      {/* THE GLASS BOX CONTAINER */}
      <div className="main-content-box">
        
        {/* --- 1. INTERNAL HEADER (Logo + Links) --- */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '4rem', 
          width: '100%'
        }}>
          
          {/* ✨ LOGO SECTION (Updated) ✨ */}
          <div className="internal-logo">
            {/* Replace text with Image */}
            <img 
              src="/logo.png" 
              alt="DevCollab Logo" 
              style={{ 
                height: '20px', // Adjust size as needed
                objectFit: 'contain' 
              }} 
            />
          </div>
          
          {/* Navigation Links Section */}
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center', fontSize: '0.95rem' }}>
             <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>Browse Projects</Link>
             
             {user ? (
               <>
                 <Link to="/dashboard" style={{ color: '#d1fae5', textDecoration: 'none' }}>My Dashboard</Link>
                 
                 <Link to="/create" style={{ 
                    background: '#22c55e', 
                    color: 'white', 
                    padding: '10px 20px', 
                    borderRadius: '30px', 
                    textDecoration: 'none', 
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                 }}>
                   + Post Idea
                 </Link>

                 <button onClick={logout} style={{ 
                   background: 'transparent', 
                   border: '1px solid rgba(255,255,255,0.3)', 
                   color: 'white', 
                   padding: '8px 15px', 
                   borderRadius: '20px', 
                   cursor: 'pointer' 
                 }}>
                   Logout
                 </button>
               </>
             ) : (
               <Link to="/login" style={{ color: '#a7f3d0', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
             )}
          </div>
        </div>

        {/* --- 2. HERO TEXT --- */}
        <div className="header-section">
          <h1>Find Your Squad 🚀</h1>
          <p className="subtitle">Browse open projects and find a team to code with.</p>
          
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by title or Skill (e.g. React)..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- 3. PROJECTS GRID --- */}
        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                user={user} 
                onJoin={handleJoin} 
              />
            ))
          ) : (
            <div className="no-results">
              <p>No projects match "{searchTerm}"</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;