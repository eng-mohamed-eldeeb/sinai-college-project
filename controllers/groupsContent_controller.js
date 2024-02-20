import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {upload} from "../helper/multer.js"
  // Route to upload a file
export const uploadVideo = (req, res) => {
    try {
      res.json({ file: req.file });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while uploading the file.' });
    }
  }
  
  // Route to download a file
export const downloadVideos =  (req, res) => {
  try {
    const filename = req.params.filename;
    const {majore, subject_name, year, subject_group} = req.body;
    const filepath = path.join(__dirname, '../uploads', majore, year,subject_name ,   subject_group, filename);
    fs.access(filepath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(err);
        return res.status(404).json({ error: 'File not found' });
      }
  
      const src = fs.createReadStream(filepath);
  
      src.on('error', function(err) {
        res.status(500).json({ error: 'An error occurred while reading file.' });
      });
  
      src.pipe(res);
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while downloading the file.' });
  }
  };
  
export const getVidoesTitle = (req, res) => {
  try {
    const {majore, subject_name, year, subject_group} = req.body;
    const folderPath = path.join(__dirname, '../uploads', majore, year,subject_name, subject_group);
  
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while reading the folder.' });
      }
  
      res.json({ files });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while getting the files.' });
  }
  };
  