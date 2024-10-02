import React, { useState, useEffect } from 'react';
import Header from './Header';
import Card from './Card';
import { fetchTickets } from '../utils/api';
import Icon from './Icon'; // Import the Icon component
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState('status'); // Default to 'status'
  const [sortBy, setSortBy] = useState('priority'); // Default to 'priority'
  const [users, setUsers] = useState([]); // Store user data for mapping

  // Predefined priority order (No priority → Urgent → High → Medium → Low)
  const priorityOrder = ['No priority', 'Urgent', 'High', 'Medium', 'Low'];

  // Fetch tickets and users data from the API
  useEffect(() => {
    fetchTickets().then((data) => {
      setTickets(data.tickets || []); // Ensure tickets array is set
      setUsers(data.users || []); // Ensure users array is set
    }).catch(error => {
      console.error('Error fetching tickets:', error); // Handle any fetch errors
    });
  }, []);

  // Function to map the status for better grouping
  const mapStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'todo':
      case 'to do':
        return { label: 'Todo', iconName: 'Todo' }; // Icon for Todo
      case 'in_progress':
      case 'in progress':
        return { label: 'In Progress', iconName: 'In Progress' }; // Icon for In Progress
      case 'done':
      case 'completed':
        return { label: 'Done', iconName: 'Done' }; // Icon for Done
      case 'cancelled':
      case 'canceled':
      case 'closed':
        return { label: 'Cancelled', iconName: 'Cancelled' }; // Icon for Cancelled
      case 'backlog':
        return { label: 'Backlog', iconName: 'Backlog' }; // Icon for Backlog
      default:
        return { label: 'Uncategorized', iconName: 'Uncategorized' }; // Fallback
    }
  };

  // Map the priority level to its label and icon
  const mapPriority = (priority) => {
    switch (priority) {
      case 0:
        return { label: 'No priority', iconName: 'No priority' };
      case 4:
        return { label: 'Urgent', iconName: 'Urgent' }; // Icon for Urgent
      case 3:
        return { label: 'High', iconName: 'High' }; // Icon for High
      case 2:
        return { label: 'Medium', iconName: 'Medium' }; // Icon for Medium
      case 1:
        return { label: 'Low', iconName: 'Low' }; // Icon for Low
      default:
        return { label: 'No priority', iconName: 'No priority' }; // Fallback
    }
  };

  // Map the userId from tickets to the corresponding user name
  const mapUser = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User'; // If no user found, return 'Unknown User'
  };

  // Grouping logic
  const groupData = () => {
    let grouped = {};

    switch (groupBy) {
      case 'status':
        grouped = groupByField('status', mapStatus); // Group by status with labels and icons
        break;
      case 'priority':
        grouped = groupByField('priority', mapPriority); // Group by priority with labels and icons
        break;
      case 'user':
        grouped = groupByField('userId', mapUser); // Group by userId and map it to user name
        break;
      default:
        grouped = { All: tickets }; // If no grouping, put all tickets under "All"
    }

    return grouped;
  };

  // Helper function to group tickets by any given field
  const groupByField = (field, mapFunction) => {
    return tickets.reduce((acc, ticket) => {
      let key, label, iconName;

      if (field === 'status') {
        const statusData = mapStatus(ticket.status); // Group by status
        label = statusData.label;
        iconName = statusData.iconName;
        key = label;
      } else if (field === 'userId') {
        key = mapUser(ticket.userId); // Group by userId and map it to user name
      } else if (field === 'priority') {
        const priorityData = mapPriority(ticket.priority); // Group by priority and map it to label and icon
        label = priorityData.label;
        iconName = priorityData.iconName;
        key = label;
      } else {
        key = ticket[field]; // For other fields
      }

      if (key) {
        acc[key] = [...(acc[key] || []), { ...ticket, iconName }]; // Store iconName along with ticket
      } else {
        acc['Unknown'] = [...(acc['Unknown'] || []), ticket]; // Group tickets with missing values under 'Unknown'
      }

      return acc;
    }, {});
  };

  // Sorting logic for each group
  const sortedData = (group) => {
    if (groupBy === 'priority') {
      // Sort by custom priority order
      return [...group].sort(
        (a, b) =>
          priorityOrder.indexOf(mapPriority(a.priority).label) -
          priorityOrder.indexOf(mapPriority(b.priority).label)
      );
    }
    // Default sorting for other cases
    switch (sortBy) {
      case 'priority':
        return [...group].sort((a, b) => b.priority - a.priority); // Sort by descending priority
      case 'title':
        return [...group].sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically by title
      default:
        return group;
    }
  };

  // Get grouped tickets based on the groupBy state
  const groupedTickets = groupData();

  // Ensure that we always display Backlog, Done, and Cancelled columns, even if empty
  const statusOrder = ['Backlog', 'Todo', 'In Progress', 'Done', 'Cancelled'];

  return (
    <div className="kanban-board">
      <Header setGroupBy={setGroupBy} setSortBy={setSortBy} /> {/* Control grouping/sorting */}
      
      <div className={`kanban-columns ${groupBy === 'user' ? 'horizontal-layout' : ''}`}>
        {groupBy === 'status'
          ? statusOrder.map((status) => (
            <div key={status} className="kanban-column">
              <h2 className="kanban-column-header">
                {/* Icon before the title */}
                <Icon name={mapStatus(status).iconName} altText={`${status} Icon`} width={24} height={24} />
                {mapStatus(status).label} {/* Display the group name */}
                <span>({groupedTickets[status]?.length || 0})</span> {/* Display the ticket count */}
                {/* Two icons after the title */}
                <Icon name="add" altText="Icon 1" width={24} height={24} />
                <Icon name="3 dot menu" altText="Icon 2" width={24} height={24} />
              </h2>
              {groupedTickets[status] && groupedTickets[status].length > 0 ? (
                sortedData(groupedTickets[status]).map((ticket) => (
                  <Card key={ticket.id} ticket={ticket} />
                ))
              ) : (
                <p>No tickets available</p>
              )}
            </div>
          ))
          : Object.keys(groupedTickets).sort((a, b) => {
              // Custom sorting for priority labels
              if (groupBy === 'priority') {
                return priorityOrder.indexOf(a) - priorityOrder.indexOf(b);
              }
              return 0; // No sorting for user/group
            }).map((group) => (
            <div key={group} className="kanban-column">
              <h2 className="kanban-column-header">
                {/* Icon before the title */}
                {groupBy === 'priority' && groupedTickets[group].length > 0 && (
                  <Icon name={groupedTickets[group][0].iconName} altText={`${group} Icon`} width={24} height={24} />
                )}
                {group} {/* Display the group name (either user name or priority) */}
                <span>({groupedTickets[group]?.length || 0})</span> {/* Display the ticket count */}
                {/* Two icons after the title */}
                <Icon name="add" altText="Icon 1" width={24} height={24} />
                <Icon name="3 dot menu" altText="Icon 2" width={24} height={24} />
              </h2>
              {groupedTickets[group].length > 0 ? (
                sortedData(groupedTickets[group]).map((ticket) => (
                  <Card key={ticket.id} ticket={ticket} />
                ))
              ) : (
                <p>No tickets available</p>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default KanbanBoard;
