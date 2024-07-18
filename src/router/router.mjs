import { csrfController } from "../controller/csrf.controller.mjs";
import express from "express";

export const router = express.Router();

router.get("/csrf", csrfController);
