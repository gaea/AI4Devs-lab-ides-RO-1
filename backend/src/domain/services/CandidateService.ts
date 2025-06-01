import { Candidate } from '../entities/Candidate';
import { ICandidateRepository } from '../repositories/ICandidateRepository';
import { CreateCandidateUseCase, CreateCandidateDTO } from '../../application/candidates/CreateCandidate';
import { GetCandidatesUseCase } from '../../application/candidates/GetCandidates';

export class CandidateService {
  private createCandidateUseCase: CreateCandidateUseCase;
  private getCandidatesUseCase: GetCandidatesUseCase;

  constructor(private readonly candidateRepository: ICandidateRepository) {
    this.createCandidateUseCase = new CreateCandidateUseCase(candidateRepository);
    this.getCandidatesUseCase = new GetCandidatesUseCase(candidateRepository);
  }

  async createCandidate(candidateData: CreateCandidateDTO): Promise<Candidate> {
    return this.createCandidateUseCase.execute(candidateData);
  }

  async getAllCandidates(): Promise<Candidate[]> {
    return this.getCandidatesUseCase.execute();
  }

  async getCandidateById(id: number): Promise<Candidate> {
    return this.getCandidatesUseCase.getById(id);
}
