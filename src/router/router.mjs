import { accountVerificationController } from "../controller/account.verification.controller.mjs";
import { csrfController } from "../controller/csrf.controller.mjs";
import express from "express";
import { signInController } from "../controller/signin.controller.mjs";
import { signUpController } from "../controller/signup.controller.mjs";
import { tokenMiddleware } from "../middleware/token.middleware.mjs";
import { userPasswordUpdateController } from "../controller/user.password.update.controller.mjs";
import { userProfileUpdateController } from "../controller/user.profile.update.controller.mjs";
import { userProfileViewController } from "../controller/user.profile.view.controller.mjs";
import { verifyJwtMiddleware } from "../middleware/verify.jwt.middleware.mjs";

export const router = express.Router();

router.get("/csrf", csrfController);

router.post("/auth/signup", signUpController);
router.post("/auth/signin", signInController);
router.put(
  "/auth/account-verification",
  tokenMiddleware,
  accountVerificationController
);
router.put(
  "/auth/password-update",
  verifyJwtMiddleware,
  userPasswordUpdateController
);

router.get("/user/profile", verifyJwtMiddleware, userProfileViewController);
router.put(
  "/user/profile-update",
  verifyJwtMiddleware,
  userProfileUpdateController
);
