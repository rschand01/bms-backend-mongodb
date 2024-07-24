import { FILE_UPLOAD_DIRECTORY, MAX_FILE_SIZE } from "../constant/constant.mjs";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (_request, _file, callback) {
    callback(null, FILE_UPLOAD_DIRECTORY);
  },

  filename: function (_request, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

/**
 * @description Middleware to upload files of any type using multer.
 * @param {Express.Request} request
 * @param {Express.Response} response
 * @param {string} [fieldName='file'] Field name for a single file upload.
 * @param {string} [arrayFieldName='array'] Field name for array file uploads.
 * @param {number} [fileSize=6*1024*1024] Maximum file size. In bytes.
 * @param {boolean} [isArray=false] Whether to handle multiple files.
 * @param {number} [maxCount=1] Maximum number of files for array uploads.
 * @link Refer https://www.npmjs.com/package/multer for more documentation.
 */
export const fileUploadMiddleware = async (
  request,
  response,
  fieldName = "file",
  arrayFieldName = "array",
  fileSize = MAX_FILE_SIZE,
  isArray = false,
  maxCount = 1
) => {
  if (typeof fieldName !== "string") {
    throw new TypeError("Parameter 'fieldName' must be a string!");
  }

  if (typeof isArray !== "boolean") {
    throw new TypeError("Parameter 'isArray' must be a boolean!");
  }

  if (
    typeof maxCount !== "number" ||
    maxCount < 1 ||
    typeof fileSize !== "number" ||
    fileSize <= 0
  ) {
    throw new TypeError(
      "Parameter 'maxCount' must be a number greater than 0 and 'fileSize' must be a positive number!"
    );
  }

  if (isArray && typeof arrayFieldName !== "string") {
    throw new TypeError("Parameter 'arrayFieldName' must be a string!");
  }

  const multerFileUploader = multer({
    storage,
    limits: { fileSize: fileSize },
  });

  const multerFileUploadHandler = isArray
    ? multerFileUploader.array(arrayFieldName, maxCount)
    : multerFileUploader.single(fieldName);

  await new Promise((resolve, reject) => {
    multerFileUploadHandler(request, response, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
