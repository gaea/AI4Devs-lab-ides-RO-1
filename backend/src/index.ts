import { Response, NextFunction } from 'express';
import { Request } from 'express-serve-static-core';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

// Habilitar CORS
app.use(cors());
app.use(express.json());

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, '../uploads/cvs');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const port = 3010;

// Configuración de almacenamiento para archivos CV
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/cvs'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF o DOCX.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

app.get('/', (req, res) => {
  res.send('Backend API is running!');
});

// Servir archivos estáticos desde el directorio uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.post('/candidates', upload.single('cv'), async (req: MulterRequest, res: Response) => {
  try {
    const { firstName, lastName, email, phone, address, education, workExperience } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Nombre, apellido y correo electrónico son obligatorios.' });
    }
    let cvUrl = undefined;
    if (req.file) {
      cvUrl = `/uploads/cvs/${req.file.filename}`;
    }
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        workExperience,
        cvUrl
      }
    });
    res.status(201).json(candidate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/candidates', async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(candidates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
