import React from 'react';

interface SidebarProps {
  onNavigate: (view: 'candidates-list' | 'add-candidate') => void;
  activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView }) => {
  return (
    <div
      className="bg-dark text-white"
      style={{
        minHeight: '100vh',
        width: '280px',
        minWidth: '280px',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="p-3">
        <h5 className="text-white mb-3">ATS Dashboard</h5>
        <hr className="bg-light opacity-25" />
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button
              className={`nav-link btn btn-link text-white text-start w-100 px-3 py-2 ${
                activeView === 'candidates-list' ? 'active bg-primary rounded' : ''
              }`}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onClick={() => onNavigate('candidates-list')}
            >
              📋 Candidate List
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-white text-start w-100 px-3 py-2 ${
                activeView === 'add-candidate' ? 'active bg-primary rounded' : ''
              }`}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onClick={() => onNavigate('add-candidate')}
            >
              ➕ Add Candidate
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
