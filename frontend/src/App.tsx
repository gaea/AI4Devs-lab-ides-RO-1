import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AddCandidateForm from './AddCandidateForm';
import CandidateList from './CandidateList';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Sistema de Seguimiento de Talento</span>
        </div>
      </nav>
      <main className="container py-4">
        <div className="row">
          <div className="col-md-12 mb-4">
            <AddCandidateForm />
          </div>
          <div className="col-md-12">
            <CandidateList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
