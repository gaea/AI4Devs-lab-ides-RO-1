import { PrismaClient } from '@prisma/client';
import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { CandidateMapper } from '../mappers/CandidateMapper';

export class PrismaCandidateRepository implements ICandidateRepository {
  constructor(private prisma: PrismaClient) {}

  async create(candidate: Candidate): Promise<Candidate> {
    const created = await this.prisma.candidate.create({
      data: CandidateMapper.toCreateInput(candidate),
      include: {
        education: true,
        workExperience: true,
        resume: {
          take: 1,
          orderBy: {
            uploadDate: 'desc'
          }
        },
      },
    });

    return CandidateMapper.toDomain(created);
  }

  async findAll(): Promise<Candidate[]> {
    const candidates = await this.prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        education: true,
        workExperience: true,
        resume: {
          take: 1,
          orderBy: {
            uploadDate: 'desc'
          }
        },
      },
    });

    return candidates.map(CandidateMapper.toDomain);
  }

  async findById(id: number): Promise<Candidate | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: {
        education: true,
        workExperience: true,
        resume: {
          take: 1,
          orderBy: {
            uploadDate: 'desc'
          }
        },
      },
    });

    if (!candidate) return null;

    return CandidateMapper.toDomain(candidate);
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { email },
      include: {
        education: true,
        workExperience: true,
        resume: {
          take: 1,
          orderBy: {
            uploadDate: 'desc'
          }
        },
      },
    });

    if (!candidate) return null;

    return CandidateMapper.toDomain(candidate);
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
        education: {
          deleteMany: {},
          create: candidate.education.map(edu => ({
            institution: edu.institution,
            title: edu.title,
            startDate: edu.startDate,
            endDate: edu.endDate,
          }))
        },
        workExperience: {
          deleteMany: {},
          create: candidate.workExperience.map(exp => ({
            company: exp.company,
            position: exp.position,
            description: exp.description,
            startDate: exp.startDate,
            endDate: exp.endDate,
          }))
        },
        resume: {
          deleteMany: {},
          ...(candidate.resume && candidate.resume.length > 0 ? {
            create: candidate.resume.map(res => ({
              filePath: res.filePath,
              fileType: res.fileType,
              uploadDate: res.uploadDate,
            }))
          } : {})
        },
      },
      include: {
        education: true,
        workExperience: true,
        resume: {
          take: 1,
          orderBy: {
            uploadDate: 'desc'
          }
        },
      },
    });

    return CandidateMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.candidate.delete({
      where: { id },
    });
  }
}
