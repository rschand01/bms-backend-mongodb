import { createTransport } from "nodemailer";
import { config as dotenvConfig } from "dotenv";
import { logger } from "../config/logger.config.mjs";
import path from "path";
import pug from "pug";

dotenvConfig();

const transporter = createTransport({
  host: "smtp.outlook.com",
  port: 587,

  // Use "true" for port 465, "false" for all other ports.
  secure: false,
  auth: {
    user: process.env.COMPANY_EMAIL,
    pass: process.env.COMPANY_EMAIL_PASSWORD,
  },
});

/**
 * @description Function to send email to the user given their email address.
 * @param {string} emailTemplateName The name of the email template to be used.
 * @param {string} firstName First name of the user.
 * @param {string} lastName Last name of the user.
 * @param {string} link The link that the user needs to click.
 * @param {string} userEmail Email address of the user.
 * @param {string} emailSubject Email subject.
 * @returns boolean given the info.accepted.length > 0
 */
export const emailSenderUtility = async (
  emailTemplateName,
  firstName,
  lastName,
  link,
  userEmail,
  emailSubject
) => {
  try {
    const __dirname = path.resolve("src");
    const emailTemplatePath = path.join(
      __dirname,
      "template",
      emailTemplateName
    );

    const html = pug.renderFile(emailTemplatePath, {
      firstName,
      lastName,
      link,
    });

    const info = await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME}" <${process.env.COMPANY_EMAIL}>`,
      to: userEmail,
      subject: emailSubject,
      html: html,
    });

    return info.accepted.length > 0;
  } catch (error) {
    logger.log({
      level: "error",
      message: error.message,
      additional: error.stack,
    });

    return false;
  }
};
