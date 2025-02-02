import { accountDeletionController } from "../controller/account.deletion.controller.mjs";
import { accountVerificationController } from "../controller/account.verification.controller.mjs";
import { blogCreateController } from "../controller/blog.create.controller.mjs";
import { blogDeleteController } from "../controller/blog.delete.controller.mjs";
import { blogUpdateController } from "../controller/blog.update.controller.mjs";
import { blogViewController } from "../controller/blog.view.controller.mjs";
import { csrfController } from "../controller/csrf.controller.mjs";
import express from "express";
import { feedViewController } from "../controller/feed.view.controller.mjs";
import { redisBlogCacheController } from "../controller/redis.blog.cache.controller.mjs";
import { signInController } from "../controller/signin.controller.mjs";
import { signUpController } from "../controller/signup.controller.mjs";
import { tokenMiddleware } from "../middleware/token.middleware.mjs";
import { userLogoutController } from "../controller/user.logout.controller.mjs";
import { userNameParamMiddleware } from "../middleware/username.param.middleware.mjs";
import { userPasswordResetController } from "../controller/user.password.reset.controller.mjs";
import { userPasswordResetEmailController } from "../controller/user.password.reset.email.controller.mjs";
import { userPasswordUpdateController } from "../controller/user.password.update.controller.mjs";
import { userProfileUpdateController } from "../controller/user.profile.update.controller.mjs";
import { userProfileViewController } from "../controller/user.profile.view.controller.mjs";
import { userSocialController } from "../controller/user.social.controller.mjs";
import { verifyJwtMiddleware } from "../middleware/verify.jwt.middleware.mjs";

export const router = express.Router();

router.get("/csrf", csrfController);

router.post("/auth/signup", signUpController);
router.post("/auth/signin", signInController);
router.post("/auth/logout", verifyJwtMiddleware, userLogoutController);
router.delete(
  "/auth/account-deletion",
  verifyJwtMiddleware,
  accountDeletionController
);
router.post("/auth/password-reset-email", userPasswordResetEmailController);
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
router.put(
  "/auth/password-reset",
  tokenMiddleware,
  userPasswordResetController
);

router.get("/user/profile", verifyJwtMiddleware, userProfileViewController);
router.put(
  "/user/profile-update",
  verifyJwtMiddleware,
  userProfileUpdateController
);
router.put("/user/social/operation", verifyJwtMiddleware, userSocialController);

router.get("/blog/feeds", verifyJwtMiddleware, feedViewController);
router.get("/blog/:blogSlug", verifyJwtMiddleware, blogViewController);

router.post(
  "/:userName/blog/create",
  verifyJwtMiddleware,
  userNameParamMiddleware,
  blogCreateController
);
router.put(
  "/:userName/blog/:blogSlug/update",
  verifyJwtMiddleware,
  userNameParamMiddleware,
  blogUpdateController
);
router.delete(
  "/:userName/blog/:blogSlug/delete",
  verifyJwtMiddleware,
  userNameParamMiddleware,
  blogDeleteController
);

router.post(
  "/invalidate/redis/cache/blog/keys",
  verifyJwtMiddleware,
  redisBlogCacheController
);
