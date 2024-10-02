import React from 'react';
import './Card.css';
import Icon from './iconn'; // Assuming you have an Icon component that renders icons

const getRandomColor = () => {
  const colors = ['#007bff', '#28a745', '#17a2b8', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const Card = ({ ticket, groupBy }) => {
  const profileIconColor = getRandomColor();

  // Map icons for status, priority, and user (example icon names)
  const statusIcon = ticket.status ? `status-${ticket.status.toLowerCase().replace(' ', '-')}` : 'status-unknown';
  const priorityIcon = ticket.priority !== undefined ? `priority-${ticket.priority}` : 'priority-unknown';
  const userIcon = ticket.userId ? `user-${ticket.userId}` : 'user-unknown';

  // Determine which icons to show based on the current grouping
  const showStatusIcon = groupBy !== 'status';
  const showPriorityIcon = groupBy !== 'priority';
  const showUserIcon = groupBy !== 'user';

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-id-left">
          <span>{ticket.id}</span> {/* Example: CAM-3 */}
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{ticket.title}</h3> {/* Example: Conduct Security Vulnerability Assessment */}
      </div>
      <div className="card-footer">
        <div className="card-details">
          {/* Icon before Feature Request tag */}
          <div className="tag feature-request">
            <Icon name="feature-request" altText="Feature Request Icon" width={20} height={20} />
            <span>Feature Request</span>
          </div>

          {/* Conditionally show status, priority, and user icons */}
          {showStatusIcon && (
            <Icon name={statusIcon} altText="Status Icon" width={20} height={20} />
          )}
          {showPriorityIcon && (
            <Icon name={priorityIcon} altText="Priority Icon" width={20} height={20} />
          )}
          {showUserIcon && (
            <Icon name={userIcon} altText="User Icon" width={20} height={20} />
          )}
        </div>

        {/* Profile icon for the assigned user */}
        <div className="profile-icon" style={{ backgroundColor: profileIconColor }}>
          <img src={ticket.assignedToImage} alt="Profile" />
        </div>
      </div>
    </div>
  );
};

export default Card;
