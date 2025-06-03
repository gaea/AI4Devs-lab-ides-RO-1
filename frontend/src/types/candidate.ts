import { Education } from './education';
import { WorkExperience } from './workExperience';
import { Resume } from './resume';

export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education: Education[];
  workExperience: WorkExperience[];
  resume: Resume[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormState extends Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'> {
  education: Education[];
  workExperience: WorkExperience[];
}
