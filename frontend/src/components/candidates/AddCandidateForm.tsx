import React, { useState } from 'react';

interface AddCandidateFormProps {
  onCandidateAdded: () => void;
}

const AddCandidateForm: React.FC<AddCandidateFormProps> = ({ onCandidateAdded }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    workExperience: '',
  });
  const [cv, setCv] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCv(e.target.files[0]);
      if (error) setError(null);
    }
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError('First name, last name and email are required.');
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (cv) {
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(cv.type)) {
        setError('CV must be in PDF or DOCX format.');
        return false;
      }
      if (cv.size > 5 * 1024 * 1024) {
        setError('CV file size must not exceed 5MB.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value.trim()) formData.append(key, value.trim());
      });
      
      if (cv) {
        formData.append('cv', cv);
      }

      const response = await fetch('http://localhost:3010/candidates', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add candidate');
      }

      setSuccess('Candidate added successfully!');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        education: '',
        workExperience: '',
      });
      setCv(null);
      if (onCandidateAdded) onCandidateAdded();
      
      // Clear file input
      const fileInput = document.getElementById('cv') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding the candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="card-title mb-4">Add New Candidate</h3>

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
            <label htmlFor="firstName" className="form-label">First Name *</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              disabled={loading}
              required
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
              disabled={loading}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
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
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-12">
            <label htmlFor="education" className="form-label">Education</label>
            <input
              type="text"
              className="form-control"
              id="education"
              name="education"
              value={form.education}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-12">
            <label htmlFor="workExperience" className="form-label">Work Experience</label>
            <textarea
              className="form-control"
              id="workExperience"
              name="workExperience"
              value={form.workExperience}
              onChange={handleChange}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="col-12">
            <label htmlFor="cv" className="form-label">CV (PDF or DOCX, max 5MB)</label>
            <input
              type="file"
              className="form-control"
              id="cv"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              disabled={loading}
            />
          </div>

          <div className="col-12">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                'Add Candidate'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateForm;
