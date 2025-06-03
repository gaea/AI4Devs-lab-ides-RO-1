import { Candidate } from '../../domain/entities/Candidate';
import { CandidateService } from '../../domain/services/CandidateService';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

describe('CandidateService', () => {
  let candidateService: CandidateService;
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
    candidateService = new CandidateService(mockRepository);
  });

  describe('createCandidate', () => {
    it('should create a new candidate successfully', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        education: [],
        workExperience: [],
      };

      const expectedCandidate = new Candidate(
        1,
        candidateData.firstName,
        candidateData.lastName,
        candidateData.email,
        undefined,
        undefined,
        candidateData.education,
        candidateData.workExperience
      );

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(expectedCandidate);

      const result = await candidateService.createCandidate(candidateData);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(candidateData.email);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result).toEqual(expectedCandidate);
    });

    it('should throw error if candidate with email already exists', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        education: [],
        workExperience: [],
      };

      const existingCandidate = new Candidate(
        1,
        'John',
        'Doe',
        'john.doe@example.com'
      );

      mockRepository.findByEmail.mockResolvedValue(existingCandidate);

      await expect(candidateService.createCandidate(candidateData))
        .rejects
        .toThrow('Candidate with this email already exists');
    });
  });

  describe('getAllCandidates', () => {
    it('should return all candidates', async () => {
      const expectedCandidates = [
        new Candidate(1, 'John', 'Doe', 'john@example.com'),
        new Candidate(2, 'Jane', 'Doe', 'jane@example.com'),
      ];

      mockRepository.findAll.mockResolvedValue(expectedCandidates);

      const result = await candidateService.getAllCandidates();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedCandidates);
    });
  });
});
