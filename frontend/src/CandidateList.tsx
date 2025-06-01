import React, { useEffect, useState } from 'react';

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  education?: string;
  cvUrl?: string;
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:3010/candidates');
      if (!response.ok) {
        throw new Error('Error al cargar candidatos');
      }
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h3 className="m-0">Candidatos Registrados</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Educación</th>
                <th>CV</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{`${candidate.firstName} ${candidate.lastName}`}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone || '-'}</td>
                  <td>{candidate.education || '-'}</td>
                  <td>
                    {candidate.cvUrl ? (
                      <a
                        href={`http://localhost:3010${candidate.cvUrl}`}
                        className="btn btn-sm btn-outline-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver CV
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
