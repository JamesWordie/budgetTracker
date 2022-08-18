// External
import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
// Config
import { decode } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../services/session.services";
import log from "../logger";

/**
 * @function deserializeUser middleware - adds user data to request headers
 * @returns next function - middleware
 */
const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh");

  if (!accessToken) return next();

  const { decoded, expired } = decode(accessToken);

  if (decoded) {
    // @ts-ignore
    req.userData = decoded;

    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      // Add the new access token to the response header
      res.setHeader("x-access-token", newAccessToken);

      const { decoded } = decode(newAccessToken);

      // @ts-ignore
      req.userData = decoded;
    }

    return next();
  }

  return next();
};

export default deserializeUser;
