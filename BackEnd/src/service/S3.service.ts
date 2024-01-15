import {S3Client, S3ClientConfig} from "@aws-sdk/client-s3";

const bucketRegion: string = process.env.S3_BUCKET_REGION || "";
const accessKey: string = process.env.S3_ACCESS_KEY || "";
const secretAccessKey: string = process.env.S3_SECRET_ACCESS_KEY || "";

console.log(process.env.PORT)

const s3Config: S3ClientConfig = {
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey,
    },
    region: bucketRegion,
  };

const S3 = new S3Client(s3Config);

export default S3;