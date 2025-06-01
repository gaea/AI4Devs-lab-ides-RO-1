import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AddCandidateForm from './components/candidates/AddCandidateForm';
import CandidateList from './components/candidates/CandidateList';
import Sidebar from './components/layout/Sidebar';

function App() {
  const [refreshList, setRefreshList] = useState(0);
  const [activeView, setActiveView] = useState<'candidates-list' | 'add-candidate'>('candidates-list');

  const handleCandidateAdded = () => {
    setRefreshList(prev => prev + 1);
    setActiveView('candidates-list'); // Cambiar a la vista de lista después de añadir
  };

  const handleNavigate = (view: 'candidates-list' | 'add-candidate') => {
    setActiveView(view);
  };

  return (
    <div className="App d-flex">
      <Sidebar onNavigate={handleNavigate} activeView={activeView} />
      <div className="flex-grow-1">
        <nav className="navbar navbar-dark bg-primary">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">Sistema de Seguimiento de Talento</span>
          </div>
        </nav>
        <main className="p-4">
          {activeView === 'add-candidate' ? (
            <AddCandidateForm onCandidateAdded={handleCandidateAdded} />
          ) : (
            <CandidateList key={refreshList} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
