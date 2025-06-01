import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

export class GetCandidatesUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(): Promise<Candidate[]> {
    return this.candidateRepository.findAll();
  }

  async getById(id: number): Promise<Candidate> {
    const candidate = await this.candidateRepository.findById(id);
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    return candidate;
  }
}
