import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  onNavigate: (view: 'candidates-list' | 'add-candidate') => void;
  activeView: string;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView, isOpen, onToggle }) => {
  const handleNavigateAndClose = (view: 'candidates-list' | 'add-candidate') => {
    onNavigate(view);
    onToggle();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none sidebar-overlay"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Content */}
        <div className="bg-dark text-white h-100 d-flex flex-column sidebar-content">
          <div className="p-3 d-flex flex-column h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white m-0">ATS Dashboard</h5>
              <button
                className="btn-close btn-close-white d-md-none"
                onClick={onToggle}
                aria-label="Close menu"
              />
            </div>
            <hr className="bg-light opacity-25 my-2" />
            <div className="sidebar-nav">
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <button
                    className={`nav-link btn btn-link text-white text-start w-100 px-3 py-2 sidebar-menu-item ${
                      activeView === 'candidates-list' ? 'active bg-primary rounded' : ''
                    }`}
                    onClick={() => handleNavigateAndClose('candidates-list')}
                  >
                    📋 Candidate List
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-white text-start w-100 px-3 py-2 sidebar-menu-item ${
                      activeView === 'add-candidate' ? 'active bg-primary rounded' : ''
                    }`}
                    onClick={() => handleNavigateAndClose('add-candidate')}
                  >
                    ➕ Add Candidate
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
