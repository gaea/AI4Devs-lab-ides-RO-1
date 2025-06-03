import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { CreateCandidateDTO } from '../../interfaces/dtos/CandidateDTO';

export class UpdateCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(id: number, data: CreateCandidateDTO): Promise<Candidate> {
    const existingCandidate = await this.candidateRepository.findById(id);
    if (!existingCandidate) {
      throw new Error('Candidate not found');
    }

    // Check email uniqueness only if it's changed
    if (data.email !== existingCandidate.email) {
      const candidateWithEmail = await this.candidateRepository.findByEmail(data.email);
      if (candidateWithEmail && candidateWithEmail.id !== id) {
        throw new Error('Email is already in use by another candidate');
      }
    }

    const candidate = new Candidate(
      id,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.address,
      data.education,
      data.workExperience,
      data.resume || existingCandidate.resume
    );

    return this.candidateRepository.update(id, candidate);
  }
}
