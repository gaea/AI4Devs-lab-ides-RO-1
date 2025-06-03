import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import { Candidate } from '../../types/candidate';
import EditCandidateForm from './EditCandidateForm';

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCandidateId, setEditingCandidateId] = useState<number | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/candidates');
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

  const handleEdit = (candidateId: number) => {
    setEditingCandidateId(candidateId);
  };

  const handleCandidateUpdated = () => {
    setEditingCandidateId(null);
    fetchCandidates();
  };

  if (editingCandidateId !== null) {
    return (
      <EditCandidateForm
        candidateId={editingCandidateId}
        onCandidateUpdated={handleCandidateUpdated}
      />
    );
  }

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
      <Header title="Candidates" />

      <div className="card shadow-sm">
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Education</th>
                    <th>Work Experience</th>
                    <th>Resume</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td>{`${candidate.firstName} ${candidate.lastName}`}</td>
                      <td>{candidate.email}</td>
                      <td>{candidate.phone || '-'}</td>
                      <td>
                        {candidate.education.length > 0 ? (
                          <ul className="list-unstyled mb-0">
                            {candidate.education.map((edu, index) => (
                              <li key={index}>
                                {`${edu.institution} - ${edu.title}`}
                                <br />
                                <small className="text-muted">
                                  {new Date(edu.startDate).toLocaleDateString()}
                                  {edu.endDate ? ` - ${new Date(edu.endDate).toLocaleDateString()}` : ' - Ongoing'}
                                </small>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {candidate.workExperience.length > 0 ? (
                          <ul className="list-unstyled mb-0">
                            {candidate.workExperience.map((exp, index) => (
                              <li key={index}>
                                {`${exp.company} - ${exp.position}`}
                                <br />
                                <small className="text-muted">
                                  {`${new Date(exp.startDate).toLocaleDateString()} - ${
                                    new Date(exp.endDate).toLocaleDateString()
                                  }`}
                                </small>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {candidate.resume && candidate.resume.length > 0 ? (
                          <a
                            href={candidate.resume[0].filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Resume
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => handleEdit(candidate.id!)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            // Handle delete
                          }}
                        >
                          Delete
                        </button>
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
