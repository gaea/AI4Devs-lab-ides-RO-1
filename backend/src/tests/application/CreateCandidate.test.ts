import { CreateCandidateUseCase, CreateCandidateDTO } from '../../application/candidates/CreateCandidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Candidate } from '../../domain/entities/Candidate';

describe('CreateCandidateUseCase', () => {
  let useCase: CreateCandidateUseCase;
  let mockRepository: jest.Mocked<ICandidateRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateCandidateUseCase(mockRepository);
  });

  it('should create a new candidate successfully', async () => {
    const candidateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const expectedCandidate = new Candidate(
      1,
      candidateData.firstName,
      candidateData.lastName,
      candidateData.email
    );

    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(expectedCandidate);

    const result = await useCase.execute(candidateData);

    expect(mockRepository.findByEmail).toHaveBeenCalledWith(candidateData.email);
    expect(mockRepository.create).toHaveBeenCalled();
    expect(result).toEqual(expectedCandidate);
  });

  it('should throw error if candidate with email already exists', async () => {
    const candidateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const existingCandidate = new Candidate(
      1,
      'John',
      'Doe',
      'john.doe@example.com'
    );

    mockRepository.findByEmail.mockResolvedValue(existingCandidate);

    await expect(useCase.execute(candidateData))
      .rejects
      .toThrow('Candidate with this email already exists');
  });
});
