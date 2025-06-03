import { Education } from '../../domain/entities/Education';
import { WorkExperience } from '../../domain/entities/WorkExperience';
import { Resume } from '../../domain/entities/Resume';

export interface CreateCandidateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education: Omit<Education, 'id'>[];
  workExperience: Omit<WorkExperience, 'id'>[];
  resume?: Omit<Resume, 'id'>[];
}

export interface CandidateResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education: Education[];
  workExperience: WorkExperience[];
  resume: Resume[];
  createdAt: Date;
  updatedAt: Date;
}
