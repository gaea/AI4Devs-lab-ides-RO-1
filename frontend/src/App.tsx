import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AddCandidateForm from './components/candidates/AddCandidateForm';
import CandidateList from './components/candidates/CandidateList';
import Sidebar from './components/layout/Sidebar';

function App() {
  const [refreshList, setRefreshList] = useState(0);
  const [activeView, setActiveView] = useState<'candidates-list' | 'add-candidate'>('candidates-list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCandidateAdded = () => {
    setRefreshList(prev => prev + 1);
    setActiveView('candidates-list');
  };

  const handleNavigate = (view: 'candidates-list' | 'add-candidate') => {
    setActiveView(view);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App d-flex flex-column flex-md-row min-vh-100">
      <Sidebar 
        onNavigate={handleNavigate} 
        activeView={activeView} 
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <div className="flex-grow-1 main-content" style={{ minWidth: 0 }}>
        <nav className="navbar navbar-dark bg-primary px-3">
          <div className="container-fluid">
            <div className="d-flex align-items-center">
              <button
                className="d-md-none btn text-white p-0 me-3 mb-0"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
                style={{ fontSize: '24px', lineHeight: 1 }}
              >
                ☰
              </button>
              <span className="navbar-brand m-0">
                {activeView === 'candidates-list' ? 'Candidate List' : 'Add New Candidate'}
              </span>
            </div>
          </div>
        </nav>
        
        <main className="p-3 p-md-4">
          <div className="container-fluid p-0">
            {activeView === 'add-candidate' ? (
              <AddCandidateForm 
                onCandidateAdded={handleCandidateAdded}
              />
            ) : (
              <CandidateList 
                key={refreshList}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
