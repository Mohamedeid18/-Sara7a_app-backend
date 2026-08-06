import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileTypeFromFile } from "file-type";
export const fileValidation = {
  images: ["image/png", "image/jpg", "image/jpeg", "image/gif"],
  videos: ["video/mp4", "video/mpeg", "video/jpeg", "video/mj2"],
  audios: ["audio/3gpp2", "audio/aac", "audio/mp3"],
  documents: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};
export const localFileUpload = ({
  customDestination = "general",
  validation = [],
}) => {
  const basePath = `uploads/${customDestination}`;

  const getFolderName = (mimetype) => {
    if (mimetype.startsWith("image/")) return "images";
    if (mimetype.startsWith("video/")) return "videos";
    if (mimetype.startsWith("audio/")) return "audios";
    if (
      mimetype.includes("pdf") ||
      mimetype.includes("word") ||
      mimetype.includes("text") ||
      mimetype.includes("application")
    ) {
      return "documents";
    }
    return "general";
  };

  const getUploadPath = (req, file) => {
    const userId = req.user?._id || "guest";
    const folderName = getFolderName(file.mimetype);
    const userBasePath = `${basePath}/${userId}/${folderName}`;
    return { userBasePath, folderName };
  };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const { userBasePath, folderName } = getUploadPath(req, file);
      const fullPath = path.resolve(`./src/${userBasePath}`);
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const uniqueFileName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);
      const { userBasePath } = getUploadPath(req, file);
      file.finalPath = `${userBasePath}/${uniqueFileName}`;
      cb(null, uniqueFileName);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"), false);
    }
  };

  const upload = multer({ storage, fileFilter });

  return {
    single: (fieldName) => [
      upload.single(fieldName),
      validateMagicNumbers(validation),
    ],
    array: (fieldName, maxCount) => [
      upload.array(fieldName, maxCount),
      validateMagicNumbers(validation),
    ],
  };
};

const EQUIVALENT_MIMES = {
  "image/jpg": ["image/jpeg"],
  "image/jpeg": ["image/jpg"],
  "audio/mpeg": ["audio/mp3"],
  "audio/mp3": ["audio/mpeg"],
};

function validateMagicNumbers(allowedMimes) {
  return async (req, res, next) => {
    try {
      const files = req.files || (req.file ? [req.file] : []);
      if (!files.length) return next();

      for (const file of files) {
        const detected = await fileTypeFromFile(file.path);
        const detectedMime = detected?.mime;

        const isDirectMatch =
          detectedMime && allowedMimes.includes(detectedMime);
        const isEquivalentMatch =
          detectedMime &&
          allowedMimes.some((allowed) =>
            EQUIVALENT_MIMES[allowed]?.includes(detectedMime),
          );

        if (!isDirectMatch && !isEquivalentMatch) {
          fs.unlinkSync(file.path);
          return res.status(400).json({
            message: "File content does not match its declared type",
            declaredMimetype: file.mimetype,
            detectedMimetype: detectedMime || "unknown",
            fileName: file.originalname,
          });
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
