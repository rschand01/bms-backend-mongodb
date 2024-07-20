import { ONE_DAY_IN_SECONDS } from "./src/constant/constant.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import { csrfMiddleware } from "./src/middleware/csrf.middleware.mjs";
import { config as dotenvConfig } from "dotenv";
import express from "express";
import { logger } from "./src/config/logger.config.mjs";
import lusca from "lusca";
import { mongoDataBase } from "./src/database/mongodb.database.mjs";
import { rateLimiter } from "./src/middleware/rate.limit.middleware.mjs";
import { router } from "./src/router/router.mjs";
import session from "express-session";

const app = express();

dotenvConfig();
mongoDataBase();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
};

const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  secure: true,
  maxAge: ONE_DAY_IN_SECONDS,
  expires: ONE_DAY_IN_SECONDS,
};

const sessionOptions = {
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: cookieOptions,
};

const luscaOptions = {
  csrf: true,
  csp: {
    policy: {
      "default-src": "'self'",
      "img-src": "*",
    },
  },
  xframe: "SAMEORIGIN",
  p3p: "ABCDEF",
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  xssProtection: true,
  nosniff: true,
  referrerPolicy: "same-origin",
};

if (process.env.NODE_ENV !== "production") {
  cookieOptions.secure = false;
}

try {
  app.use(express.json());

  app.use(cors(corsOptions));
  app.use(cookieParser(process.env.COOKIE_SESSION_SECRET, cookieOptions));
  app.use(session(sessionOptions));
  app.use(lusca(luscaOptions));

  app.use(csrfMiddleware);
  app.use(rateLimiter);
  app.use("/", router);

  app.listen(process.env.EXPRESS_PORT, () => {
    logger.log({
      level: "info",
      message: "Express Server is successfully listening!",
      additional: `port: ${process.env.EXPRESS_PORT}`,
    });
  });
} catch (error) {
  logger.log({
    level: "error",
    message: error.message,
    additional: error.stack,
  });
}
