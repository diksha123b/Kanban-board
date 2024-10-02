import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import './Header.css'; // Ensure the CSS is linked
import Icon from './Icon';

const Header = ({ setGroupBy, setSortBy }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to handle dropdown visibility

  const handleGroupChange = (e) => {
    setGroupBy(e.target.value); // Update grouping based on selection
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value); // Update sorting based on selection
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen); // Toggle dropdown open/close
  };

  return (
    <div className="header">
      <div className="dropdown">
        {/* Button for the dropdown */}
        <button className="dropdown-button" onClick={toggleDropdown}>
          {/* Use the Icon component with the name of the icon (Display) */}
          <Icon name="Display" altText="Display Icon" width={30} height={30} />
          Display
          <Icon name="down" altText="Down" width={30} height={30} />
        </button>

        {/* Dropdown menu that shows when the button is clicked */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-section">
              <label htmlFor="grouping">Grouping</label>
              <select id="grouping" onChange={handleGroupChange}>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="dropdown-section">
              <label htmlFor="ordering">Ordering</label>
              <select id="ordering" onChange={handleSortChange}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
