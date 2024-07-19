import { csrfController } from "../controller/csrf.controller.mjs";
import express from "express";
import { signUpController } from "../controller/signup.controller.mjs";

export const router = express.Router();

router.get("/csrf", csrfController);

router.post("/auth/signup", signUpController);
