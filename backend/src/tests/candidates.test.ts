import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';
import { CreateCandidateDTO } from '../interfaces/dtos/CandidateDTO';

const prisma = new PrismaClient();

describe('Candidate API', () => {
  // Clean up the database after each test
  afterEach(async () => {
    await prisma.resume.deleteMany({});
    await prisma.education.deleteMany({});
    await prisma.workExperience.deleteMany({});
    await prisma.candidate.deleteMany({});
  });

  describe('POST /candidates', () => {
    it('should create a new candidate with all fields', async () => {
      const candidateData: CreateCandidateDTO = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        education: [
          {
            institution: 'University of Test',
            title: 'Computer Science',
            startDate: new Date('2018-09-01')
          }
        ],
        workExperience: [
          {
            company: 'Tech Corp',
            position: 'Software Engineer',
            description: 'Full stack development',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2023-01-01')
          }
        ]
      };

      const response = await request(app)
        .post('/candidates')
        .send(candidateData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
        phone: candidateData.phone,
        address: candidateData.address
      });

      // Check education data
      expect(response.body.education).toHaveLength(1);
      expect(response.body.education[0]).toMatchObject({
        institution: candidateData.education[0].institution,
        title: candidateData.education[0].title
      });

      // Check work experience data
      expect(response.body.workExperience).toHaveLength(1);
      expect(response.body.workExperience[0]).toMatchObject({
        company: candidateData.workExperience[0].company,
        position: candidateData.workExperience[0].position,
        description: candidateData.workExperience[0].description
      });
    });

    it('should validate required fields', async () => {
      const invalidData = {
        lastName: 'Doe',
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/candidates')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate email uniqueness', async () => {
      const candidateData: CreateCandidateDTO = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.unique@example.com',
        education: [],
        workExperience: []
      };

      // Create first candidate
      await request(app)
        .post('/candidates')
        .send(candidateData);

      // Try to create second candidate with same email
      const response = await request(app)
        .post('/candidates')
        .send(candidateData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email already exists');
    });

    it('should validate dates in education and work experience', async () => {
      const invalidDates: CreateCandidateDTO = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.dates@example.com',
        education: [
          {
            institution: 'Test University',
            title: 'Test Degree',
            startDate: new Date('invalid-date')
          }
        ],
        workExperience: [
          {
            company: 'Test Company',
            position: 'Test Position',
            description: 'Test Description',
            startDate: new Date('2023-01-01'),
            endDate: new Date('2022-01-01') // End date before start date
          }
        ]
      };

      const response = await request(app)
        .post('/candidates')
        .send(invalidDates);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /candidates', () => {
    it('should return empty array when no candidates exist', async () => {
      const response = await request(app).get('/candidates');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all candidates', async () => {
      // Create test candidates
      const candidate1: CreateCandidateDTO = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.test@example.com',
        education: [],
        workExperience: []
      };

      const candidate2: CreateCandidateDTO = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.test@example.com',
        education: [],
        workExperience: []
      };

      await request(app).post('/candidates').send(candidate1);
      await request(app).post('/candidates').send(candidate2);

      const response = await request(app).get('/candidates');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.map((c: any) => c.email)).toContain(candidate1.email);
      expect(response.body.map((c: any) => c.email)).toContain(candidate2.email);
    });
  });

  describe('GET /candidates/:id', () => {
    it('should return candidate by id', async () => {
      const candidateData: CreateCandidateDTO = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.get@example.com',
        education: [],
        workExperience: []
      };

      const createResponse = await request(app)
        .post('/candidates')
        .send(candidateData);

      const candidateId = createResponse.body.id;

      const response = await request(app).get(`/candidates/${candidateId}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: candidateId,
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email
      });
    });

    it('should return 404 for non-existing candidate', async () => {
      const response = await request(app).get('/candidates/999999');

      expect(response.status).toBe(404);
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
