import { Request, Response } from 'express';
import { CreateCandidateUseCase, CreateCandidateDTO } from '../../../application/candidates/CreateCandidate';
import { GetCandidatesUseCase } from '../../../application/candidates/GetCandidates';
import { ICandidateRepository } from '../../../domain/repositories/ICandidateRepository';
import path from 'path';

export class CandidateController {
  private createCandidateUseCase: CreateCandidateUseCase;
  private getCandidatesUseCase: GetCandidatesUseCase;

  constructor(repository: ICandidateRepository) {
    this.createCandidateUseCase = new CreateCandidateUseCase(repository);
    this.getCandidatesUseCase = new GetCandidatesUseCase(repository);
  }

  public async createCandidate(req: Request & { file?: Express.Multer.File }, res: Response): Promise<Response> {
    try {
      const candidateData: CreateCandidateDTO = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        education: req.body.education,
        workExperience: req.body.workExperience,
        cvUrl: req.file ? `/uploads/cvs/${req.file.filename}` : undefined,
      };

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
      return res.json(candidate);
    } catch (error) {
      return res.status(404).json({ 
        error: error instanceof Error ? error.message : 'Candidate not found' 
      });
    }
  }
}
