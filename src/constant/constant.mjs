import path from "path";

export const WINDOWS_MS = 60 * 60 * 1000;
export const API_LIMIT = 100;
export const CURRENT_PAGE = 1;
export const BLOGS_PER_PAGE = 50;
export const SALT = 10;
export const ONE_HOUR_IN_SECONDS = 3600;
export const ONE_DAY_IN_SECONDS = 86400;
export const TEN_MINUTES_IN_SECONDS = 600;
export const TWENTY_MINUTES_IN_SECONDS = 1200;
export const MAX_FILE_SIZE = 6 * 1024 * 1024;
export const MAX_BLOG_IMAGE_FILE_SIZE = 6 * 1024 * 1024;
export const FILE_UPLOAD_DIRECTORY = path.resolve("temp/uploads");
export const ACCOUNT_VERIFICATION_EMAIL_TEMPLATE =
  "account.verification.email.template.pug";
export const USER_PASSWORD_RESET_EMAIL_TEMPLATE =
  "user.password.reset.email.template.pug";
