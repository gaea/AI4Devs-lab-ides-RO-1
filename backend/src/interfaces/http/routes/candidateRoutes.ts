import { Router } from 'express';
import { CandidateController } from '../controllers/CandidateController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const createCandidateRouter = (candidateController: CandidateController): Router => {
  const router = Router();

  // Configurar multer para subida de archivos
  const uploadDir = path.join(__dirname, '../../../../uploads/cvs');
  if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos PDF o DOCX.'));
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  });

  router.post('/', upload.single('cv'), (req, res) => candidateController.createCandidate(req, res));
  router.get('/', (req, res) => candidateController.getAllCandidates(req, res));
  router.get('/:id', (req, res) => candidateController.getCandidateById(req, res));

  return router;
};
