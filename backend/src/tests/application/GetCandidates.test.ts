import { GetCandidatesUseCase } from '../../application/candidates/GetCandidates';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Candidate } from '../../domain/entities/Candidate';

describe('GetCandidatesUseCase', () => {
  let useCase: GetCandidatesUseCase;
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
    useCase = new GetCandidatesUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return all candidates', async () => {
      const expectedCandidates = [
        new Candidate(1, 'John', 'Doe', 'john@example.com'),
        new Candidate(2, 'Jane', 'Doe', 'jane@example.com'),
      ];

      mockRepository.findAll.mockResolvedValue(expectedCandidates);

      const result = await useCase.execute();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedCandidates);
    });
  });

  describe('getById', () => {
    it('should return a candidate by id', async () => {
      const expectedCandidate = new Candidate(1, 'John', 'Doe', 'john@example.com');

      mockRepository.findById.mockResolvedValue(expectedCandidate);

      const result = await useCase.getById(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedCandidate);
    });

    it('should throw error if candidate not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.getById(1))
        .rejects
        .toThrow('Candidate not found');
    });
  });
});
