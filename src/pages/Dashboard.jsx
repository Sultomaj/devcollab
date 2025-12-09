import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { Link } from 'react-router-dom';
import './Dashboard.css'; 

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { projects, deleteProject, fetchApplications, handleApplication, fetchMyApplications } = useProjects();
  
  const [viewingApps, setViewingApps] = useState(null);
  const [appsList, setAppsList] = useState([]);
  const [mySentApps, setMySentApps] = useState([]);

  const myProjects = projects.filter(project => project.user_id === user.id);
  const displayName = user?.user_metadata?.full_name || user?.email || "Developer";

  useEffect(() => {
    const loadMyApps = async () => {
      const data = await fetchMyApplications();
      setMySentApps(data || []);
    };
    if (user) loadMyApps();
  }, [user]); 

  const loadApps = async (projectId) => {
    if (viewingApps === projectId) {
      setViewingApps(null);
      setAppsList([]);
      return;
    }
    const apps = await fetchApplications(projectId);
    setAppsList(apps);
    setViewingApps(projectId);
  };

  return (
    <div className="dashboard-container">
      
      
      <div className="dashboard-glass-box">
        
        
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          
          
          <div className="header-left">
             <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
                <img src="/logo.png" alt="DevCollab" style={{ height: '20px', objectFit: 'contain' }} />
             </Link>
          </div>

          
          <div className="header-right" style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.95rem' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>Browse Projects</Link>
            <Link to="/dashboard" style={{ color: '#d1fae5', textDecoration: 'none', fontWeight: '600' }}>My Dashboard</Link>

            <Link to="/create" className="new-project-btn" style={{
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
                   cursor: 'pointer',
                   fontWeight: 'bold'
                 }}>
                   Logout
            </button>
          </div>
        </div>

        {/* --- WELCOME TITLE --- */}
        <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: 'white' }}>My Dashboard 🚀</h1>
            <p style={{ color: '#d1fae5', margin: 0 }}>Welcome back, <strong>{displayName}</strong></p>
        </div>

        {/* --- SECTION 1: MY SENT APPLICATIONS --- */}
        <div className="dashboard-section">
          <h2 className="section-title">📂 My Sent Applications</h2>
          
          {mySentApps.length === 0 ? (
            <div className="empty-state">You haven't applied to any teams yet. Go find one!</div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {mySentApps.map((app) => (
                <div key={app.id} className="dashboard-card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <h3 className="card-title">{app.projects?.title || "Unknown Project"}</h3>
                    <p style={{margin:'5px 0 0', color:'#64748b', fontSize:'0.9rem'}}>Message: "{app.message}"</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <span style={{
                      padding:'5px 12px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'bold', textTransform:'uppercase',
                      background: app.status === 'accepted' ? '#dcfce7' : '#fef3c7',
                      color: app.status === 'accepted' ? '#166534' : '#92400e'
                    }}>
                      {app.status}
                    </span>
                    {app.status === 'accepted' && (
                      <div style={{marginTop:'8px'}}>
                        <a href={`mailto:${app.projects?.owner_email}`} style={{textDecoration:'none', color:'#2563eb', fontWeight:'bold', fontSize:'0.9rem'}}>
                          📧 Email Team
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- SECTION 2: PROJECTS I MANAGE --- */}
        <div className="dashboard-section">
          <h2 className="section-title">🛠 Projects I Manage</h2>
          
          {myProjects.length === 0 ? (
             <div className="empty-state">You haven't posted any projects yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {myProjects.map((project) => (
                <div key={project.id} className="dashboard-card">
                  <div className="card-top">
                    <div>
                      <h3 className="card-title">{project.title}</h3>
                      <span className="card-meta">Team: {project.current_members || 1} / {project.max_members || 3}</span>
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
  <button onClick={() => loadApps(project.id)} className="action-btn btn-apps">
    {viewingApps === project.id ? 'Close' : '📩 Applications'}
  </button>
  
  {/* ✨ NEW EDIT BUTTON MERGED HERE ✨ */}
  <Link to={`/edit/${project.id}`} className="action-btn" style={{ textDecoration:'none', background:'#e2e8f0', color:'#475569', display:'flex', alignItems:'center' }}>
    Edit
  </Link>

  <button onClick={() => deleteProject(project.id)} className="action-btn btn-delete">
    Delete
  </button>
</div>
                  </div>

                  <p style={{color:'#475569', lineHeight:'1.5', fontSize:'0.95rem'}}>{project.description}</p>

                  {/* APPLICANT DROPDOWN */}
                  {viewingApps === project.id && (
                    <div className="apps-area">
                      <h4 style={{margin:'0 0 10px', color:'#334155', fontSize:'0.9rem'}}>Pending Requests:</h4>
                      {appsList.length === 0 ? (
                        <p style={{color:'#94a3b8', fontStyle:'italic', fontSize:'0.9rem'}}>No pending applications.</p>
                      ) : (
                        appsList.map(app => (
                          <div key={app.id} className="app-item">
                            <div>
                              <strong style={{color:'#0f172a'}}>{app.applicant_name}</strong>
                              {app.applicant_github && (
                                <a href={app.applicant_github} target="_blank" rel="noreferrer" style={{marginLeft:'10px', fontSize:'0.8rem', textDecoration:'none'}}>🐱 Profile</a>
                              )}
                              <p style={{margin:'2px 0 0', color:'#64748b', fontSize:'0.85rem'}}>"{app.message}"</p>
                            </div>
                            <div style={{display:'flex', gap:'5px'}}>
                              <button onClick={() => { handleApplication(app.id, project.id, 'accepted'); setAppsList(appsList.filter(a => a.id !== app.id)); }} 
                                style={{background:'#22c55e', color:'white', border:'none', padding:'5px 10px', borderRadius:'6px', cursor:'pointer'}}>Accept</button>
                              <button onClick={() => { handleApplication(app.id, project.id, 'rejected'); setAppsList(appsList.filter(a => a.id !== app.id)); }} 
                                style={{background:'#ef4444', color:'white', border:'none', padding:'5px 10px', borderRadius:'6px', cursor:'pointer'}}>Reject</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
