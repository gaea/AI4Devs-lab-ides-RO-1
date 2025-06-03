import { Request, Response } from 'express';
import { CreateCandidateUseCase } from '../../../application/candidates/CreateCandidate';
import { GetCandidatesUseCase } from '../../../application/candidates/GetCandidates';
import { UpdateCandidateUseCase } from '../../../application/candidates/UpdateCandidate';
import { ICandidateRepository } from '../../../domain/repositories/ICandidateRepository';
import { CreateCandidateDTO } from '../../dtos/CandidateDTO';
import path from 'path';

export class CandidateController {
  private createCandidateUseCase: CreateCandidateUseCase;
  private getCandidatesUseCase: GetCandidatesUseCase;
  private updateCandidateUseCase: UpdateCandidateUseCase;

  constructor(repository: ICandidateRepository) {
    this.createCandidateUseCase = new CreateCandidateUseCase(repository);
    this.getCandidatesUseCase = new GetCandidatesUseCase(repository);
    this.updateCandidateUseCase = new UpdateCandidateUseCase(repository);
  }

  public async createCandidate(req: Request & { file?: Express.Multer.File }, res: Response): Promise<Response> {
    try {
      let candidateData: CreateCandidateDTO;

      // Check if this is a multipart form data request (file upload) or JSON
      const isMultipart = req.headers['content-type']?.includes('multipart/form-data');

      if (isMultipart) {
        // Handle multipart form data (with file upload)
        const education = JSON.parse(req.body.education || '[]').map((edu: any) => ({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : undefined
        }));

        const workExperience = JSON.parse(req.body.workExperience || '[]').map((exp: any) => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: new Date(exp.endDate)
        }));

        candidateData = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          education,
          workExperience,
          resume: req.file ? {
            filePath: `/uploads/cvs/${req.file.filename}`,
            fileType: req.file.mimetype,
            uploadDate: new Date()
          } : undefined,
        };
      } else {
        // Handle JSON request
        const education = (req.body.education || []).map((edu: any) => ({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : undefined
        }));

        const workExperience = (req.body.workExperience || []).map((exp: any) => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: new Date(exp.endDate)
        }));

        candidateData = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          education,
          workExperience,
          resume: req.body.resume ? {
            filePath: req.body.resume.filePath,
            fileType: req.body.resume.fileType,
            uploadDate: new Date(req.body.resume.uploadDate)
          } : undefined,
        };
      }

      const candidate = await this.createCandidateUseCase.execute(candidateData);
      return res.status(201).json(candidate);
    } catch (error) {
      return res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Error creating candidate' 
      });
    }
  }

  public async getAllCandidates(req: Request, res: Response): Promise<Response> {
    try {
      const candidates = await this.getCandidatesUseCase.execute();
      return res.json(candidates);
    } catch (error) {
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error fetching candidates' 
      });
    }
  }

  public async getCandidateById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const candidate = await this.getCandidatesUseCase.getById(id);
      
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      
      return res.json(candidate);
    } catch (error) {
      return res.status(404).json({ 
        error: error instanceof Error ? error.message : 'Candidate not found' 
      });
    }
  }

  public async updateCandidate(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const candidateData: CreateCandidateDTO = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        education: req.body.education,
        workExperience: req.body.workExperience,
        resume: req.body.resume
      };

      const candidate = await this.updateCandidateUseCase.execute(id, candidateData);
      return res.json(candidate);
    } catch (error) {
      return res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Error updating candidate' 
      });
    }
  }
}
