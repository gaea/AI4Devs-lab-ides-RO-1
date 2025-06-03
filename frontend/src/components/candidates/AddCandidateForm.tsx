import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from '../layout/Header';
import { FormState } from '../../types/candidate';
import { Education } from '../../types/education';
import { WorkExperience } from '../../types/workExperience';

interface AddCandidateFormProps {
  onCandidateAdded: () => void;
}

// Date validation helper
const validateDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date <= new Date();
};

// Work experience date validation helper
const validateWorkExperienceDates = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end && !isNaN(start.getTime()) && !isNaN(end.getTime());
};

const AddCandidateForm: React.FC<AddCandidateFormProps> = ({ onCandidateAdded }) => {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: [],
    workExperience: [],
    resume: []
  });

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

  const [cv, setCv] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCv(e.target.files[0]);
      if (error) setError(null);
    }
  };

  const addEducation = () => {
    if (!currentEducation.institution || !currentEducation.title || !currentEducation.startDate) {
      setError('Institution, title, and start date are required for education.');
      return;
    }

    if (!validateDate(currentEducation.startDate)) {
      setError('Education start date must be valid and not in the future.');
      return;
    }

    // Validate end date if provided
    if (currentEducation.endDate) {
      if (!validateDate(currentEducation.endDate)) {
        setError('Education end date must be valid and not in the future.');
        return;
      }

      if (new Date(currentEducation.startDate) >= new Date(currentEducation.endDate)) {
        setError('Education start date must be before end date.');
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

  const removeEducation = (index: number) => {
    setForm(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addWorkExperience = () => {
    if (!currentWorkExperience.company || !currentWorkExperience.position || 
        !currentWorkExperience.description || !currentWorkExperience.startDate || 
        !currentWorkExperience.endDate) {
      setError('All work experience fields are required.');
      return;
    }

    if (!validateDate(currentWorkExperience.startDate)) {
      setError('Work experience start date must be valid and not in the future.');
      return;
    }

    if (!validateDate(currentWorkExperience.endDate)) {
      setError('Work experience end date must be valid and not in the future.');
      return;
    }

    if (!validateWorkExperienceDates(currentWorkExperience.startDate, currentWorkExperience.endDate)) {
      setError('Work experience start date must be before end date.');
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

    try {
      // Basic validations
      if (!form.firstName?.trim() || !form.lastName?.trim() || !form.email?.trim()) {
        setError('First name, last name and email are required.');
        return;
      }

      // Email validation
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        setError('Please enter a valid email address.');
        return;
      }

      // Phone validation (optional)
      if (form.phone && !/^\+?[\d\s-]{10,}$/.test(form.phone)) {
        setError('Please enter a valid phone number.');
        return;
      }

      // CV file validation
      if (cv) {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (!validTypes.includes(cv.type)) {
          setError('CV must be in PDF or DOCX format.');
          return;
        }
        if (cv.size > 5 * 1024 * 1024) {
          setError('CV file size must be less than 5MB.');
          return;
        }
      }

      // Education validation
      if (form.education.length === 0) {
        setError('At least one education entry is required.');
        return;
      }

      const formData = new FormData();
      
      // Add basic info
      formData.append('firstName', form.firstName.trim());
      formData.append('lastName', form.lastName.trim());
      formData.append('email', form.email.trim());
      if (form.phone) formData.append('phone', form.phone.trim());
      if (form.address) formData.append('address', form.address.trim());

      // Add education with ISO dates
      const educationWithISODates = form.education.map(edu => ({
        ...edu,
        startDate: new Date(edu.startDate).toISOString(),
        endDate: edu.endDate ? new Date(edu.endDate).toISOString() : undefined
      }));
      formData.append('education', JSON.stringify(educationWithISODates));

      // Add work experience with ISO dates
      const workExperienceWithISODates = form.workExperience.map(exp => ({
        ...exp,
        startDate: new Date(exp.startDate).toISOString(),
        endDate: new Date(exp.endDate).toISOString()
      }));
      formData.append('workExperience', JSON.stringify(workExperienceWithISODates));

      // Add CV if present
      if (cv) {
        formData.append('cv', cv);
      }

      setLoading(true);
      const response = await fetch('/api/candidates', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create candidate');
      }

      setSuccess('Candidate added successfully!');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        education: [],
        workExperience: [],
        resume: []
      });
      setCv(null);
      onCandidateAdded();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // All form state reset logic moved to success case in handleSubmit

  return (
    <div className="container mt-4">
      <Header title="Candidate Management" />
      <h2>Add New Candidate</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label">First Name *</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">Last Name *</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <hr className="my-4" />

        <h3>Education</h3>
        <div className="mb-3 p-3 border rounded">
          <div className="row mb-3">
            <div className="col-md-3">
              <label htmlFor="institution" className="form-label">Institution *</label>
              <input
                type="text"
                className="form-control"
                id="institution"
                name="institution"
                value={currentEducation.institution}
                onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="title" className="form-label">Title/Degree *</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={currentEducation.title}
                onChange={(e) => setCurrentEducation(prev => ({ ...prev, title: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="eduStartDate" className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-control"
                id="eduStartDate"
                name="startDate"
                value={currentEducation.startDate}
                onChange={(e) => setCurrentEducation(prev => ({ ...prev, startDate: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="eduEndDate" className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                id="eduEndDate"
                name="endDate"
                value={currentEducation.endDate}
                onChange={(e) => setCurrentEducation(prev => ({ ...prev, endDate: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
              <small className="form-text text-muted">Leave empty if ongoing</small>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={addEducation}
            disabled={loading}
          >
            Add Education
          </button>
        </div>

        {form.education.length > 0 && (
          <div className="mb-3">
            <h4>Added Education</h4>
            <div className="list-group">
              {form.education.map((edu, index) => (
                <div key={index} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{edu.institution}</strong> - {edu.title}<br />
                      <small>
                        {new Date(edu.startDate).toLocaleDateString()}
                        {edu.endDate ? ` - ${new Date(edu.endDate).toLocaleDateString()}` : ' - Ongoing'}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeEducation(index)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <hr className="my-4" />

        <h3>Work Experience</h3>
        <div className="mb-3 p-3 border rounded">
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="company" className="form-label">Company *</label>
              <input
                type="text"
                className="form-control"
                id="company"
                name="company"
                value={currentWorkExperience.company}
                onChange={(e) => setCurrentWorkExperience(prev => ({ ...prev, company: e.target.value }))}
                disabled={loading}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="position" className="form-label">Position *</label>
              <input
                type="text"
                className="form-control"
                id="position"
                name="position"
                value={currentWorkExperience.position}
                onChange={(e) => setCurrentWorkExperience(prev => ({ ...prev, position: e.target.value }))}
                disabled={loading}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={currentWorkExperience.description}
              onChange={(e) => setCurrentWorkExperience(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              disabled={loading}
            />
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="workStartDate" className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-control"
                id="workStartDate"
                name="startDate"
                value={currentWorkExperience.startDate}
                onChange={(e) => setCurrentWorkExperience(prev => ({ ...prev, startDate: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="workEndDate" className="form-label">End Date *</label>
              <input
                type="date"
                className="form-control"
                id="workEndDate"
                name="endDate"
                value={currentWorkExperience.endDate}
                onChange={(e) => setCurrentWorkExperience(prev => ({ ...prev, endDate: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={addWorkExperience}
            disabled={loading}
          >
            Add Work Experience
          </button>
        </div>

        {form.workExperience.length > 0 && (
          <div className="mb-3">
            <h4>Added Work Experience</h4>
            <div className="list-group">
              {form.workExperience.map((exp, index) => (
                <div key={index} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{exp.company}</strong> - {exp.position}<br />
                      <small>
                        {new Date(exp.startDate).toLocaleDateString()} - {new Date(exp.endDate).toLocaleDateString()}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeWorkExperience(index)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <hr className="my-4" />

        <div className="mb-3">
          <label htmlFor="cv" className="form-label">CV (PDF or DOCX, max 5MB)</label>
          <input
            type="file"
            className="form-control"
            id="cv"
            accept=".pdf,.docx,.doc"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Adding...' : 'Add Candidate'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCandidateForm;
