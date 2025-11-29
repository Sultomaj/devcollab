import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import './CreateProject.css'; // Reusing the dark theme CSS

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Safe destructuring to prevent crashes if context is loading
  const context = useProjects();
  const projects = context?.projects || [];
  const updateProject = context?.updateProject;
  const contextLoading = context?.loading;
  
  const [formData, setFormData] = useState({
    title: '', description: '', skills: '', contactEmail: '', maxMembers: 3
  });
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Wait for the Global Context to finish loading first
    if (!contextLoading) {
      if (projects.length > 0) {
        // Use loose equality (==) to match string ID "123" with number ID 123
        const projectToEdit = projects.find(p => p.id == id);
        
        if (projectToEdit) {
          setFormData({
            title: projectToEdit.title || '',
            description: projectToEdit.description || '',
            skills: projectToEdit.skills || '',
            contactEmail: projectToEdit.owner_email || '',
            maxMembers: projectToEdit.max_members || 3
          });
        }
      }
      // Stop loading whether we found it or not (so we don't get stuck)
      setLocalLoading(false);
    }
  }, [id, projects, contextLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateProject) {
      await updateProject(id, formData);
      navigate('/dashboard');
    } else {
      alert("Error: updateProject function is missing. Please check ProjectContext.");
    }
  };

  // 🛑 FIX: VISIBLE LOADING STATE
  // We wrap this in 'create-project-container' so it gets the DARK GREEN background.
  if (localLoading || contextLoading) {
    return (
      <div className="create-project-container">
        <div className="create-project-glass-box" style={{ 
          textAlign: 'center', 
          minHeight: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <h2 style={{color: 'white', fontSize: '2rem'}}>⏳</h2>
          <h3 style={{color: 'white', marginTop: '20px'}}>Loading Project...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="create-project-container"> 
      <div className="create-project-glass-box"> 
        
        <div className="create-nav">
          <Link to="/dashboard" className="back-link">← Cancel & Back</Link>
        </div>

        <div className="form-header">
          <h1>✏️ Edit Project</h1>
          <p>Update your project details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label>Project Title</label>
            <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Required Skills</label>
            <input type="text" name="skills" className="form-input" value={formData.skills} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Team Size</label>
            <input type="number" name="maxMembers" className="form-input" value={formData.maxMembers} onChange={handleChange} min="1" max="10" />
          </div>

          <div className="form-group">
             <label>Contact Email</label>
             <input type="email" name="contactEmail" className="form-input" value={formData.contactEmail} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-textarea" value={formData.description} onChange={handleChange} required rows="6" />
          </div>

          <button type="submit" className="submit-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditProject;