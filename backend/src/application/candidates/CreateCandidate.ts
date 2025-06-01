import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

export interface CreateCandidateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  workExperience?: string;
  cvUrl?: string;
}

export class CreateCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(data: CreateCandidateDTO): Promise<Candidate> {
    const existingCandidate = await this.candidateRepository.findByEmail(data.email);
    if (existingCandidate) {
      throw new Error('Candidate with this email already exists');
    }

    const candidate = new Candidate(
      null,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.address,
      data.education,
      data.workExperience,
      data.cvUrl
    );

    return this.candidateRepository.create(candidate);
  }
}
