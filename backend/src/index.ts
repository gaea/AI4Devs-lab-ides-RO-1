import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import path from 'path';
import { PrismaCandidateRepository } from './infrastructure/repositories/PrismaCandidateRepository';
import { CandidateController } from './interfaces/http/controllers/CandidateController';
import { createCandidateRouter } from './interfaces/http/routes/candidateRoutes';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Dependency Injection
const candidateRepository = new PrismaCandidateRepository(prisma);
const candidateController = new CandidateController(candidateRepository);

// Routes
app.use('/candidates', createCandidateRouter(candidateController));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const port = process.env.PORT || 3010;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

export { app, prisma };
