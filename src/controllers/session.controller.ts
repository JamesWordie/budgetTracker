import { Request, Response } from "express";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { validateUser } from "../services/user.services";
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
} from "../services/session.services";
import { signJWT } from "../utils/jwt.utils";
import StatusCodes from "http-status-codes";
import { get } from "lodash";

const createUserSession = async (req: Request, res: Response) => {
  // validate email and password
  const user = await validateUser(req.body);

  if (!user)
    throw new UnauthenticatedError("Invalid email address or password");

  // create session
  const session = await createSession(user._id, req.get("user-agent") || "");

  //   create access and refresh tokens
  const accessToken = await createAccessToken({
    user,
    session,
  });

  const refreshToken = await signJWT(session.toJSON(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });

  // send access and refresh tokens
  return res.status(StatusCodes.OK).json({ accessToken, refreshToken });
};

export const invalidateUserSession = async (req: Request, res: Response) => {
  const sessionId = get(req, "userData.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(StatusCodes.NO_CONTENT);
};

export { createUserSession };

export const getAllUserSessions = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.status(StatusCodes.OK).json({ sessions });
};
