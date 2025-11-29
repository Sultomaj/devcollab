import React from 'react';
import './ProjectCard.css'; // Make sure to import the CSS!

const ProjectCard = ({ project, user, onJoin }) => {
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
          skillsArray.slice(0, 3).map((skill, index) => ( // Show only first 3 skills
            <span key={index} className="skill-tag">{skill.trim()}</span>
          ))
        ) : (
          <span className="skill-tag">General</span>
        )}
      </div>

      <p className="card-description">
        {project.description.length > 80 
          ? project.description.substring(0, 80) + "..." 
          : project.description}
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