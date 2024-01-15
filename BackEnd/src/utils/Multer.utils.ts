import multer, { StorageEngine } from 'multer';
import S3 from "../service/S3.service";
import multerS3 from "multer-s3"

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split('.')[0];
    cb(null, filename + '-' + uniqueSuffix + '.png');
  },
});


const storageS3: StorageEngine = multerS3({
  s3: S3,
  bucket: process.env.S3_BUCKET_NAME || "",
  metadata: function (req, file, cb) {
    cb(null, {fieldName : file.fieldname});
  },
  key: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split('.')[0];
    const key: string = filename + '-' + uniqueSuffix + '.png';
    cb(null, key);
  },
});

export const upload = multer({storage: storageS3})