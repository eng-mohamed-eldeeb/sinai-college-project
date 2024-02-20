import multer from 'multer';
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// upload data
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const {majore, subject_name, year, subject_group} = req.body;
      const dir = `./uploads/${majore}/${year}/${subject_name}/${subject_group}`;

      fs.promises.mkdir(dir, { recursive: true }).then(_ => {
        cb(null, dir);
      }).catch(error => {
        cb(error, '');
      });
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
export const upload = multer({ storage: storage });
  