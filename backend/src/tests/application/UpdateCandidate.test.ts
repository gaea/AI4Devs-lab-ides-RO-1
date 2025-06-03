import { UpdateCandidateUseCase } from '../../application/candidates/UpdateCandidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Candidate } from '../../domain/entities/Candidate';
import type { CreateCandidateDTO } from '../../interfaces/dtos/CandidateDTO';

describe('UpdateCandidateUseCase', () => {
  let mockRepository: jest.Mocked<ICandidateRepository>;
  let updateCandidateUseCase: UpdateCandidateUseCase;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    updateCandidateUseCase = new UpdateCandidateUseCase(mockRepository);
  });

  it('should update a candidate successfully', async () => {
    const existingCandidate = new Candidate(
      1,
      'John',
      'Doe',
      'john@example.com',
      '123456789',
      'Test Address',
      [],
      []
    );

    const education = {
      institution: 'New University',
      title: 'Computer Science',
      startDate: new Date('2020-01-01'),
    };

    const workExperience = {
      company: 'Tech Corp',
      position: 'Developer',
      description: 'Full stack development',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2023-01-01'),
    };

    const updateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '987654321',
      address: 'New Address',
      education: [education],
      workExperience: [workExperience],
    };

    const updatedCandidate = new Candidate(
      1,
      updateData.firstName,
      updateData.lastName,
      updateData.email,
      updateData.phone,
      updateData.address,
      updateData.education,
      updateData.workExperience
    );

    mockRepository.findById.mockResolvedValue(existingCandidate);
    mockRepository.update.mockResolvedValue(updatedCandidate);

    const result = await updateCandidateUseCase.execute(1, updateData);

    expect(result).toBeDefined();
    expect(result.lastName).toBe(updateData.lastName);
    expect(result.phone).toBe(updateData.phone);
    expect(result.address).toBe(updateData.address);
    expect(result.education).toHaveLength(1);
    expect(result.education[0]).toMatchObject(education);
    expect(result.workExperience).toHaveLength(1);
    expect(result.workExperience[0]).toMatchObject(workExperience);
  });

  it('should throw error when candidate not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const updateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      education: [],
      workExperience: [],
    };

    await expect(
      updateCandidateUseCase.execute(1, updateData)
    ).rejects.toThrow('Candidate not found');
  });

  it('should throw error when email is already in use by another candidate', async () => {
    const existingCandidate = new Candidate(
      1,
      'John',
      'Doe',
      'john@example.com',
      '123456789',
      'Test Address',
      [],
      []
    );

    const anotherCandidate = new Candidate(
      2,
      'Jane',
      'Smith',
      'jane@example.com',
      '987654321',
      'Another Address',
      [],
      []
    );

    mockRepository.findById.mockResolvedValue(existingCandidate);
    mockRepository.findByEmail.mockResolvedValue(anotherCandidate);

    const updateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'jane@example.com', // Try to use email that's already taken
      education: [],
      workExperience: [],
    };

    await expect(
      updateCandidateUseCase.execute(1, updateData)
    ).rejects.toThrow('Email is already in use by another candidate');
  });

  it('should validate date fields', async () => {
    const existingCandidate = new Candidate(
      1,
      'John',
      'Doe',
      'john@example.com',
      '123456789',
      'Test Address',
      [],
      []
    );

    mockRepository.findById.mockResolvedValue(existingCandidate);

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const updateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      education: [{
        institution: 'Test University',
        title: 'Test Degree',
        startDate: futureDate, // Future date
      }],
      workExperience: [],
    };

    await expect(
      updateCandidateUseCase.execute(1, updateData)
    ).rejects.toThrow('Education start date cannot be in the future');
  });

  it('should validate work experience date ranges', async () => {
    const existingCandidate = new Candidate(
      1,
      'John',
      'Doe',
      'john@example.com',
      '123456789',
      'Test Address',
      [],
      []
    );

    mockRepository.findById.mockResolvedValue(existingCandidate);

    const updateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      education: [],
      workExperience: [{
        company: 'Test Company',
        position: 'Test Position',
        description: 'Test Description',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2022-01-01'), // End date before start date
      }],
    };

    await expect(
      updateCandidateUseCase.execute(1, updateData)
    ).rejects.toThrow('Work experience start date must be before end date');
  });
});
