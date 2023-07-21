import { CookieOptions } from "express";

interface Config {
  origin: string;
  cookieOptions(options?: CookieOptions): CookieOptions;
}

const development: Config = {
  origin: "http://localhost:3000",
  cookieOptions(options?: CookieOptions) {
    return { httpOnly: true, sameSite: "strict", ...options };
  },
};

const production: Config = {
  origin: "https://askify.onrender.com",
  cookieOptions(options?: CookieOptions) {
    return { httpOnly: true, secure: true, sameSite: "none", ...options };
  },
};

const config: Config =
  process.env.NODE_ENV === "production" ? production : development;

export default config;
