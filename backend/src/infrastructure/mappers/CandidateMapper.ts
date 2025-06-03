import { Prisma } from '@prisma/client';
import { Candidate } from '../../domain/entities/Candidate';
import { Education } from '../../domain/entities/Education';
import { WorkExperience } from '../../domain/entities/WorkExperience';
import { Resume } from '../../domain/entities/Resume';

type PrismaCandidateWithRelations = Prisma.CandidateGetPayload<{
  include: {
    education: true;
    workExperience: true;
    resume: true;
  };
}>;

type PrismaEducation = Prisma.EducationGetPayload<{}>;

export class CandidateMapper {
  static toDomain(prismaCandidate: PrismaCandidateWithRelations): Candidate {
    return new Candidate(
      prismaCandidate.id,
      prismaCandidate.firstName,
      prismaCandidate.lastName,
      prismaCandidate.email,
      prismaCandidate.phone || undefined,
      prismaCandidate.address || undefined,
      prismaCandidate.education.map((edu: any) => ({
        id: edu.id,
        institution: edu.institution,
        title: edu.title,
        startDate: edu.startDate,
        endDate: edu.endDate ?? undefined
      })),
      prismaCandidate.workExperience.map((exp) => ({
        id: exp.id,
        company: exp.company,
        position: exp.position,
        description: exp.description,
        startDate: exp.startDate,
        endDate: exp.endDate
      })),
      prismaCandidate.resume.map((res) => ({
        id: res.id,
        filePath: res.filePath,
        fileType: res.fileType,
        uploadDate: res.uploadDate
      })),
      prismaCandidate.createdAt,
      prismaCandidate.updatedAt
    );
  }

  static toCreateInput(candidate: Candidate): Prisma.CandidateCreateInput {
    return {
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      education: {
        create: candidate.education.map((edu: Education) => ({
          institution: edu.institution,
          title: edu.title,
          startDate: edu.startDate,
          endDate: edu.endDate ?? null
        }))
      },
      workExperience: {
        create: candidate.workExperience.map((exp: WorkExperience) => ({
          company: exp.company,
          position: exp.position,
          description: exp.description,
          startDate: exp.startDate,
          endDate: exp.endDate
        }))
      },
      resume: candidate.resume && candidate.resume.length > 0 ? {
        create: candidate.resume.map((res: Resume) => ({
          filePath: res.filePath,
          fileType: res.fileType,
          uploadDate: res.uploadDate
        }))
      } : undefined
    };
  }
}
