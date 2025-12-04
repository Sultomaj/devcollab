import React, { useState } from 'react'; // 1. Added useState
import './ProjectCard.css';

const ProjectCard = ({ project, user, onJoin }) => {
  // 2. State to handle text expansion
  const [isExpanded, setIsExpanded] = useState(false);

  const currentMembers = project.current_members || 1;
  const maxMembers = project.max_members || 3;
  const isFull = currentMembers >= maxMembers;
  const skillsArray = project.skills ? project.skills.split(',') : [];

  return (
    <div className="project-card">
      <div className="card-header">
        <h3>{project.title}</h3>
        {/* Badge */}
        <span className="member-badge" style={{
           background: isFull ? '#fee2e2' : '#dcfce7',
           color: isFull ? '#991b1b' : '#166534'
        }}>
          {isFull ? 'CLOSED' : `OPEN: ${currentMembers}/${maxMembers}`}
        </span>
      </div>

      {/* Skills */}
      <div className="skills-container">
        {skillsArray.length > 0 ? (
          skillsArray.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">{skill.trim()}</span>
          ))
        ) : (
          <span className="skill-tag">General</span>
        )}
      </div>

      {/* 3. Modified description area to include Read More logic */}
      <p className="card-description">
        {/* If expanded, show full text; otherwise, truncate */}
        {isExpanded ? project.description : (
          project.description.length > 80 
            ? project.description.substring(0, 80) + "..." 
            : project.description
        )}

        {/* Show button only if text is longer than 80 characters */}
        {project.description.length > 80 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb', // Blue color
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              marginLeft: '5px',
              padding: 0
            }}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </p>

      <div className="card-footer">
        <div className="author-info">
          <span>👤 {project.author_name || "Dev"}</span>
        </div>

        <button
          onClick={() => onJoin(project)}
          disabled={user?.id === project.user_id || isFull}
          className={`join-btn ${user?.id === project.user_id || isFull ? 'disabled' : ''}`}
        >
          {user?.id === project.user_id ? 'Owner' : isFull ? 'Full' : 'Join Team'}
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
