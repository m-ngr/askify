import jwt from "jsonwebtoken";
import { JwtAuth } from "../types";

export function jwtSign(obj: JwtAuth): String {
  return jwt.sign(obj, getJwtKey(), { expiresIn: "15d" });
}

/** Throws on bad tokens */
export function jwtVerify(token: string): JwtAuth {
  return jwt.verify(token, getJwtKey()) as JwtAuth;
}

function getJwtKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT Secret key not found");
    process.exit(1);
  }
  return secret;
}
