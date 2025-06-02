import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3010/candidates');
      if (!response.ok) {
        throw new Error('Error loading candidates');
      }
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while loading candidates'
      );
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      <Header
        title="Candidates"
        subtitle={`${candidates.length} ${
          candidates.length === 1 ? 'candidate' : 'candidates'
        } registered`}
      />

      <div className="card shadow-sm">
        <div className="card-body">
          {candidates.length === 0 ? (
            <div className="text-center p-5">
              <p className="text-muted mb-0">
                No candidates registered yet.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
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
                      <td>
                        <a
                          href={`mailto:${candidate.email}`}
                          className="text-decoration-none"
                        >
                          {candidate.email}
                        </a>
                      </td>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
