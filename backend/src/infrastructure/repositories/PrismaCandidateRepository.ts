import { PrismaClient } from '@prisma/client';
import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

export class PrismaCandidateRepository implements ICandidateRepository {
  constructor(private prisma: PrismaClient) {}

  async create(candidate: Candidate): Promise<Candidate> {
    const created = await this.prisma.candidate.create({
      data: {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        address: candidate.address,
        education: candidate.education,
        workExperience: candidate.workExperience,
        cvUrl: candidate.cvUrl,
      },
    });

    return new Candidate(
      created.id,
      created.firstName,
      created.lastName,
      created.email,
      created.phone || undefined,
      created.address || undefined,
      created.education || undefined,
      created.workExperience || undefined,
      created.cvUrl || undefined,
      created.createdAt,
      created.updatedAt
    );
  }

  async findAll(): Promise<Candidate[]> {
    const candidates = await this.prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return candidates.map(
      (c) =>
        new Candidate(
          c.id,
          c.firstName,
          c.lastName,
          c.email,
          c.phone || undefined,
          c.address || undefined,
          c.education || undefined,
          c.workExperience || undefined,
          c.cvUrl || undefined,
          c.createdAt,
          c.updatedAt
        )
    );
  }

  async findById(id: number): Promise<Candidate | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate) return null;

    return new Candidate(
      candidate.id,
      candidate.firstName,
      candidate.lastName,
      candidate.email,
      candidate.phone || undefined,
      candidate.address || undefined,
      candidate.education || undefined,
      candidate.workExperience || undefined,
      candidate.cvUrl || undefined,
      candidate.createdAt,
      candidate.updatedAt
    );
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { email },
    });

    if (!candidate) return null;

    return new Candidate(
      candidate.id,
      candidate.firstName,
      candidate.lastName,
      candidate.email,
      candidate.phone || undefined,
      candidate.address || undefined,
      candidate.education || undefined,
      candidate.workExperience || undefined,
      candidate.cvUrl || undefined,
      candidate.createdAt,
      candidate.updatedAt
    );
  }

  async update(id: number, candidate: Candidate): Promise<Candidate> {
    const updated = await this.prisma.candidate.update({
      where: { id },
      data: {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        address: candidate.address,
        education: candidate.education,
        workExperience: candidate.workExperience,
        cvUrl: candidate.cvUrl,
      },
    });

    return new Candidate(
      updated.id,
      updated.firstName,
      updated.lastName,
      updated.email,
      updated.phone || undefined,
      updated.address || undefined,
      updated.education || undefined,
      updated.workExperience || undefined,
      updated.cvUrl || undefined,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(id: number): Promise<void> {
    await this.prisma.candidate.delete({
      where: { id },
    });
  }
}
