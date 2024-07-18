import { ONE_DAY_IN_SECONDS } from "../constant/constant.mjs";

export const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  secure: true,
  maxAge: ONE_DAY_IN_SECONDS,
  expires: ONE_DAY_IN_SECONDS,
};
