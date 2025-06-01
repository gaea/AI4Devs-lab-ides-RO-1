export class Candidate {
  constructor(
    public readonly id: number | null,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone?: string,
    public address?: string,
    public education?: string,
    public workExperience?: string,
    public cvUrl?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validateName(firstName, 'First name');
    this.validateName(lastName, 'Last name');
    this.validateEmail(email);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
