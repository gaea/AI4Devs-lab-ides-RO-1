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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCv(e.target.files[0]);
    }
  };

  const validate = () => {
    if (!form.firstName || !form.lastName || !form.email) {
      setError('Nombre, apellido y correo electrónico son obligatorios.');
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('El correo electrónico no es válido.');
      return false;
    }
    if (cv && !['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(cv.type)) {
      setError('El CV debe ser PDF o DOCX.');
      return false;
    }
    if (cv && cv.size > 5 * 1024 * 1024) {
      setError('El archivo CV no debe superar los 5MB.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!validate()) {
        setLoading(false);
        return;
      }

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      if (cv) {
        formData.append('cv', cv);
      }

      const response = await fetch('http://localhost:3010/candidates', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al guardar el candidato');
      }

      setSuccess('Candidato añadido exitosamente');
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
      onCandidateAdded(); // Llamar a la función después de guardar exitosamente
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <form onSubmit={handleSubmit} className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-primary text-white">
          <h2 className="m-0">Añadir Candidato</h2>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Nombre*</label>
            <input
              className="form-control"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Apellido*</label>
            <input
              className="form-control"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email*</label>
            <input
              className="form-control"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              className="form-control"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input
              className="form-control"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Educación</label>
            <input
              className="form-control"
              name="education"
              value={form.education}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Experiencia Laboral</label>
            <textarea
              className="form-control"
              name="workExperience"
              value={form.workExperience}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">CV (PDF o DOCX, máx. 5MB)</label>
            <input
              className="form-control"
              name="cv"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Enviando...
              </>
            ) : (
              'Añadir Candidato'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCandidateForm;
