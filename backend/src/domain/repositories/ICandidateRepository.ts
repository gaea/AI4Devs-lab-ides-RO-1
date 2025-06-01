import { Candidate } from '../entities/Candidate';

export interface ICandidateRepository {
  create(candidate: Candidate): Promise<Candidate>;
  findAll(): Promise<Candidate[]>;
  findById(id: number): Promise<Candidate | null>;
  findByEmail(email: string): Promise<Candidate | null>;
  update(id: number, candidate: Candidate): Promise<Candidate>;
  delete(id: number): Promise<void>;
}
