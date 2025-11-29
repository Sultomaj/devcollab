import { useState, useEffect } from "react";
import { useProjects } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import './CreateProject.css'; // Import the new styles

const CreateProject = () => {
  const { addProject } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    contactEmail: "",
    maxMembers: 3
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactEmail: user.email || ""
      }));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject(formData);
    navigate("/dashboard");
  };

  return (
    <div className="create-project-container">
      <div className="create-project-glass-box">
        
        {/* Back Link */}
        <div className="create-nav">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        </div>

        <div className="form-header">
          <h1>🚀 Post a New Project</h1>
          <p>Share your idea and find the perfect team.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="project-form">
          
          <div className="form-group">
            <label>Project Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. AI Study Assistant"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Skills Required</label>
            <input 
              type="text" 
              required
              placeholder="e.g. React, Python, Figma"
              className="form-input"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Team Size Needed</label>
            <input 
              type="number" 
              min="2" 
              max="10"
              required
              className="form-input"
              value={formData.maxMembers}
              onChange={(e) => setFormData({...formData, maxMembers: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Contact Email</label>
            <input 
              type="email" 
              required
              placeholder="name@example.com"
              className="form-input"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              required
              placeholder="Describe your idea..."
              className="form-textarea"
              rows="6"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button type="submit" className="submit-btn">
            🚀 Launch Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;