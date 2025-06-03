import { Education } from './Education';
import { WorkExperience } from './WorkExperience';
import { Resume } from './Resume';

export class Candidate {
  constructor(
    public readonly id: number | null,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone?: string,
    public address?: string,
    public education: Education[] = [],
    public workExperience: WorkExperience[] = [],
    public resume?: Resume,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validateName(firstName, 'First name');
    this.validateName(lastName, 'Last name');
    this.validateEmail(email);
    this.validateDates();
  }

  private validateName(name: string, field: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error(`${field} cannot be empty`);
    }
    if (name.length > 100) {
      throw new Error(`${field} cannot be longer than 100 characters`);
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validateDates(): void {
    // Validate education dates
    this.education.forEach(edu => {
      if (!(edu.startDate instanceof Date) || isNaN(edu.startDate.getTime())) {
        throw new Error('Invalid education start date');
      }
      
      // Education start date cannot be in the future
      if (edu.startDate > new Date()) {
        throw new Error('Education start date cannot be in the future');
      }

      // Validate end date if provided
      if (edu.endDate) {
        if (!(edu.endDate instanceof Date) || isNaN(edu.endDate.getTime())) {
          throw new Error('Invalid education end date');
        }

        // End date cannot be in the future
        if (edu.endDate > new Date()) {
          throw new Error('Education end date cannot be in the future');
        }

        // Start date must be before end date
        if (edu.startDate >= edu.endDate) {
          throw new Error('Education start date must be before end date');
        }
      }
    });

    // Validate work experience dates
    this.workExperience.forEach(exp => {
      if (!(exp.startDate instanceof Date) || isNaN(exp.startDate.getTime())) {
        throw new Error('Invalid work experience start date');
      }
      if (!(exp.endDate instanceof Date) || isNaN(exp.endDate.getTime())) {
        throw new Error('Invalid work experience end date');
      }

      // Start date must be before end date
      if (exp.startDate > exp.endDate) {
        throw new Error('Work experience start date must be before end date');
      }

      // Dates cannot be in the future
      if (exp.startDate > new Date() || exp.endDate > new Date()) {
        throw new Error('Work experience dates cannot be in the future');
      }
    });

    // Validate resume upload date
    if (this.resume) {
      if (!(this.resume.uploadDate instanceof Date) || isNaN(this.resume.uploadDate.getTime())) {
        throw new Error('Invalid resume upload date');
      }

      // Upload date cannot be in the future
      if (this.resume.uploadDate > new Date()) {
        throw new Error('Resume upload date cannot be in the future');
      }
    }
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
