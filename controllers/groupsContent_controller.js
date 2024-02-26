import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Route to delete a file
export const deleteData = (req, res) => {
  try {
    console.log(req.body);
    const { majore, subject_name, year, subject_group, file_type } = req.body;
    const filename = req.params.filename;
    const filepath = path.join(
      __dirname,
      "../uploads",
      majore,
      year,
      subject_name,
      subject_group,
      file_type,
      filename
    );
    fs.rmdir(filepath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while deleting the folder.", err });
      }
      res.json({ message: "Folder deleted successfully." });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the file.", error });
  }
};

// Route to upload a file
export const uploadData = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "failed to save file" });
    }
    if (req.body.file_type === "video") {
      const filename = req.file.filename;
      const { majore, subject_name, year, subject_group, file_type } = req.body;
      const filepath = path.join(
        __dirname,
        "../uploads",
        majore,
        year,
        subject_name,
        subject_group,
        file_type,
        filename,
        filename
      );
      const dir = path.join(
        __dirname,
        "../uploads",
        majore,
        year,
        subject_name,
        subject_group,
        file_type,
        filename
      );
      const thumbnailDir = path.join(dir, "thumbnail");

      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      ffmpeg(filepath)
        .on("filenames", function (filenames) {
          console.log("Will generate " + filenames.join(", "));
        })
        .on("end", function () {
          console.log("Screenshots taken");
        })
        .on("error", function (err) {
          console.error(err);
          return res.status(500).json({
            error: "An error occurred while getting the thumbnail.",
            err,
          });
        })
        .screenshot({
          count: 1,
          folder: dir,
          filename: "thumbnail/thumbnail.png",
          size: "320x240",
        });
    }
    res.json({ file: req.file });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while uploading the file.", error });
  }
};

// Route to download a file
export const downloadData = (req, res) => {
  try {
    const filename = req.params.filename;
    const { majore, subject_name, year, subject_group, file_type } = req.body;
    const filepath = path.join(
      __dirname,
      "../uploads",
      majore,
      year,
      subject_name,
      subject_group,
      file_type,
      filename,
      filename
    );
    fs.access(filepath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: "File not found" });
      }

      const src = fs.createReadStream(filepath);

      src.on("error", function (err) {
        res
          .status(500)
          .json({ error: "An error occurred while reading file.", err });
      });

      src.pipe(res);
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while downloading the file." });
  }
};

export const getDataTitle = (req, res) => {
  try {
    const { majore, subject_name, year, subject_group, file_type } = req.body;
    const folderPath = path.join(
      __dirname,
      "../uploads",
      majore,
      year,
      subject_name,
      subject_group,
      file_type
    );

    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while reading the folder.", err });
      }

      res.json({ files });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while getting the files.", error });
  }
};

export const getTumbnail = (req, res) => {
  const { majore, subject_name, year, subject_group, file_type } = req.body;
  const filepath = path.join(
    __dirname,
    "../uploads",
    majore,
    year,
    subject_name,
    subject_group,
    file_type
  );

  let thumbnails = [];
  const directories = fs.readdirSync(filepath);

  for (let dir of directories) {
    let thumbnailPath = path.join(filepath, dir, "thumbnail", "thumbnail.png");
    if (fs.existsSync(thumbnailPath)) {
      let thumbnail = fs.readFileSync(thumbnailPath);
      let base64Image = new Buffer.from(thumbnail).toString("base64");
      thumbnails.push(base64Image);
    }
  }

  res.send(thumbnails);
};
