import { Candidate } from '../../../domain/entities/Candidate';

describe('Candidate', () => {
  const mockEducation = [
    {
      institution: 'Universidad Nacional',
      title: 'Computer Science',
      startDate: new Date('2018-09-01')
    },
    {
      institution: 'Tech Institute',
      title: 'Software Engineering',
      startDate: new Date('2022-01-15')
    }
  ];

  const mockWorkExperience = [
    {
      company: 'Tech Corp',
      position: 'Software Developer',
      description: 'Full-stack development with Node.js and React',
      startDate: new Date('2020-03-01'),
      endDate: new Date('2022-12-31')
    },
    {
      company: 'Digital Solutions',
      position: 'Senior Developer',
      description: 'Leading development team and architecture decisions',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2025-06-01')
    }
  ];

  const mockResume = {
    filePath: '/uploads/cvs/john-doe-cv.pdf',
    fileType: 'application/pdf',
    uploadDate: new Date('2025-06-01')
  };

  it('should create a valid candidate with all fields', () => {
    const candidate = new Candidate(
      1,
      'John',
      'Doe',
      'john.doe@example.com',
      '+1234567890',
      '123 Main St',
      mockEducation,
      mockWorkExperience,
      mockResume
    );

    expect(candidate.id).toBe(1);
    expect(candidate.firstName).toBe('John');
    expect(candidate.lastName).toBe('Doe');
    expect(candidate.email).toBe('john.doe@example.com');
    expect(candidate.phone).toBe('+1234567890');
    expect(candidate.address).toBe('123 Main St');
    expect(candidate.education).toEqual(mockEducation);
    expect(candidate.workExperience).toEqual(mockWorkExperience);
    expect(candidate.resume).toEqual(mockResume);
  });

  it('should create a valid candidate with only required fields', () => {
    const candidate = new Candidate(
      null,
      'Jane',
      'Smith',
      'jane.smith@example.com'
    );

    expect(candidate.id).toBeNull();
    expect(candidate.firstName).toBe('Jane');
    expect(candidate.lastName).toBe('Smith');
    expect(candidate.email).toBe('jane.smith@example.com');
    expect(candidate.phone).toBeUndefined();
    expect(candidate.address).toBeUndefined();
    expect(candidate.education).toEqual([]);
    expect(candidate.workExperience).toEqual([]);
    expect(candidate.resume).toBeUndefined();
  });

  it('should throw error for invalid email', () => {
    expect(() => {
      new Candidate(
        null,
        'John',
        'Doe',
        'invalid-email'
      );
    }).toThrow('Invalid email format');
  });

  it('should throw error for empty name', () => {
    expect(() => {
      new Candidate(
        null,
        '',
        'Doe',
        'john.doe@example.com'
      );
    }).toThrow('First name cannot be empty');
  });
});
