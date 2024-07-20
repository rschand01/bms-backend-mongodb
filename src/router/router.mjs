import { accountVerificationController } from "../controller/account.verification.controller.mjs";
import { csrfController } from "../controller/csrf.controller.mjs";
import express from "express";
import { signInController } from "../controller/signin.controller.mjs";
import { signUpController } from "../controller/signup.controller.mjs";
import { tokenMiddleware } from "../middleware/token.middleware.mjs";

export const router = express.Router();

router.get("/csrf", csrfController);

router.post("/auth/signup", signUpController);
router.post("/auth/signin", signInController);
router.put(
  "/auth/account-verification",
  tokenMiddleware,
  accountVerificationController
);
