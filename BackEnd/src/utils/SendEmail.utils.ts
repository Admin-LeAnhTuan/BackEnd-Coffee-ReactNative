import nodemailer, { TransportOptions } from "nodemailer";
import fs from "fs";
import path from "path";

interface attachment {
  filename: string;
  path?: string | undefined;
  content: any;
  contentType: string;
}

const sendMail = async (option: {
  email: string;
  subject: string;
  message: string;
  attachment?: attachment | undefined | string;
}) => {
  console.log("start send email");

  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: "gmail",
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  } as TransportOptions);

  // const imagePath = path.join(__dirname, "../assets/", "logo.png");
  // const imageContent = fs.readFileSync(imagePath, { encoding: "base64" });

//   const htmlImage = `<img src="https://travel-my-uploads.s3.ap-southeast-1.amazonaws.com/Travel_img/logo.png" 
//   alt="Image" style="display: block; margin-top: 20px;">`;
  const mailOption = {
    from: process.env.SMPT_MAIL,
    to: option.email,
    subject: option.subject,
    html: option.message,
    attachments: [option.attachment].filter(Boolean) as attachment[],
  };

  await transporter.sendMail(mailOption, (err: any, info: any) => { 
    // Specify the type of 'info' as 'any' for now
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info?.response); 
      // Access the response property using optional chaining
    }
  });
};

export default sendMail;