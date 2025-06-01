import React from 'react';

interface SidebarProps {
  onNavigate: (view: 'candidates-list' | 'add-candidate') => void;
  activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView }) => {
  return (
    <div className="bg-dark text-white" style={{ minHeight: '100vh', width: '250px' }}>
      <div className="p-3">
        <h5 className="text-white">ATS Dashboard</h5>
        <hr className="bg-light" />
        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-white text-start w-100 ${
                activeView === 'candidates-list' ? 'active bg-primary' : ''
              }`}
              onClick={() => onNavigate('candidates-list')}
            >
              📋 Lista de Candidatos
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-white text-start w-100 ${
                activeView === 'add-candidate' ? 'active bg-primary' : ''
              }`}
              onClick={() => onNavigate('add-candidate')}
            >
              ➕ Añadir Candidato
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
