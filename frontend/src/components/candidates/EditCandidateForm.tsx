import React, { useState, useEffect, FormEvent, ChangeEvent, useCallback } from 'react';
import { Candidate } from '../../types/candidate';
import { Education } from '../../types/education';
import { WorkExperience } from '../../types/workExperience';
import Header from '../layout/Header';

interface EditCandidateFormProps {
  candidateId: number;
  onCandidateUpdated: () => void;
}

const EditCandidateForm: React.FC<EditCandidateFormProps> = ({ candidateId, onCandidateUpdated }) => {
  const [form, setForm] = useState<Candidate>({
    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: [],
    workExperience: [],
    resume: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentEducation, setCurrentEducation] = useState<Education>({
    institution: '',
    title: '',
    startDate: '',
    endDate: '',
  });
  const [currentWorkExperience, setCurrentWorkExperience] = useState<WorkExperience>({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const fetchCandidate = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/candidates/${candidateId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidate');
      }
      const data = await response.json();
      setForm(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error fetching candidate');
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleEducationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEducation((prev: Education) => ({ ...prev, [name]: value }));
  };

  const handleWorkExperienceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentWorkExperience((prev: WorkExperience) => ({ ...prev, [name]: value }));
  };

  const addEducation = () => {
    if (!currentEducation.institution || !currentEducation.title || !currentEducation.startDate) {
      setError('Institution, title, and start date are required for education');
      return;
    }

    // Validate end date if provided
    if (currentEducation.endDate) {
      if (new Date(currentEducation.startDate) >= new Date(currentEducation.endDate)) {
        setError('Education start date must be before end date');
        return;
      }
    }

    setForm(prev => ({
      ...prev,
      education: [...prev.education, currentEducation]
    }));

    setCurrentEducation({
      institution: '',
      title: '',
      startDate: '',
      endDate: '',
    });
  };

  const addWorkExperience = () => {
    if (!currentWorkExperience.company || !currentWorkExperience.position || 
        !currentWorkExperience.startDate || !currentWorkExperience.endDate) {
      setError('All work experience fields are required');
      return;
    }

    setForm(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, currentWorkExperience]
    }));

    setCurrentWorkExperience({
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
    });
  };

  const removeEducation = (index: number) => {
    setForm(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const removeWorkExperience = (index: number) => {
    setForm(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.firstName || !form.lastName || !form.email) {
      setError('First name, last name and email are required.');
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate');
      }

      setSuccess('Candidate updated successfully!');
      onCandidateUpdated();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error updating candidate');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container-fluid px-4">
      <Header title="Edit Candidate" />

      <div className="card shadow-sm">
        <div className="card-body">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess(null)} aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={form.phone || ''}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label htmlFor="address" className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={form.address || ''}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <hr />
              <h5>Education</h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <label htmlFor="institution" className="form-label">Institution</label>
                  <input
                    type="text"
                    className="form-control"
                    id="institution"
                    name="institution"
                    value={currentEducation.institution}
                    onChange={handleEducationChange}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="title" className="form-label">Title/Degree</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={currentEducation.title}
                    onChange={handleEducationChange}
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="startDate" className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={currentEducation.startDate}
                    onChange={handleEducationChange}
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="endDate" className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    name="endDate"
                    value={currentEducation.endDate}
                    onChange={handleEducationChange}
                  />
                  <small className="form-text text-muted">Leave empty if ongoing</small>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addEducation}
                  >
                    Add
                  </button>
                </div>
              </div>

              {form.education.length > 0 && (
                <div className="mt-3">
                  <ul className="list-group">
                    {form.education.map((edu, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {`${edu.institution} - ${edu.title} (${edu.startDate}${edu.endDate ? ` to ${edu.endDate}` : ' - Ongoing'})`}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeEducation(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="col-12">
              <hr />
              <h5>Work Experience</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="company" className="form-label">Company</label>
                  <input
                    type="text"
                    className="form-control"
                    id="company"
                    name="company"
                    value={currentWorkExperience.company}
                    onChange={handleWorkExperienceChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="position" className="form-label">Position</label>
                  <input
                    type="text"
                    className="form-control"
                    id="position"
                    name="position"
                    value={currentWorkExperience.position}
                    onChange={handleWorkExperienceChange}
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={currentWorkExperience.description}
                    onChange={handleWorkExperienceChange}
                    rows={3}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="startDate" className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={currentWorkExperience.startDate}
                    onChange={handleWorkExperienceChange}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="endDate" className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    name="endDate"
                    value={currentWorkExperience.endDate}
                    onChange={handleWorkExperienceChange}
                  />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addWorkExperience}
                  >
                    Add
                  </button>
                </div>
              </div>

              {form.workExperience.length > 0 && (
                <div className="mt-3">
                  <ul className="list-group">
                    {form.workExperience.map((work, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {`${work.company} - ${work.position} (${work.startDate} to ${work.endDate})`}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeWorkExperience(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">Update Candidate</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCandidateForm;
