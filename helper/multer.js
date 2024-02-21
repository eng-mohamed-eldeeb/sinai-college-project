import multer from "multer";
import path from "path";
import fs from "fs";
var timeNow = Date.now();
var varTitle = "title";
// upload data
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    timeNow = Date.now();
    const { majore, subject_name, year, subject_group, file_type, title } =
      req.body;
    varTitle = title;
    const dir = `./uploads/${majore}/${year}/${subject_name}/${subject_group}/${file_type}/${varTitle}-${timeNow}.${file.originalname
      .split(".")
      .pop()}`;

    fs.promises
      .mkdir(dir, { recursive: true })
      .then((_) => {
        cb(null, dir);
      })
      .catch((error) => {
        cb(error, "");
      });
  },
  filename: (req, file, cb) => {
    cb(null, varTitle + "-" + timeNow + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });
