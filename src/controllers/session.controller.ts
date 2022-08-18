// External
import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { get } from "lodash";
// Config
import { UnauthenticatedError } from "../errors";
import { validateUser } from "../services/user.services";
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
} from "../services/session.services";
import { signJWT } from "../utils/jwt.utils";

/**
 * @function createUserSession - login the user
 * @returns the access token and refresh token for the user to store/interact with
 */
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

/**
 * @function invalidateUserSession - logout the user
 * @returns a successful status code
 */
const invalidateUserSession = async (req: Request, res: Response) => {
  const sessionId = get(req, "userData.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(StatusCodes.NO_CONTENT);
};

/**
 * @function getAllUserSessions - get all sessions, see history, delete unknowns, etc.
 * @returns all sessions for a specific user
 */
const getAllUserSessions = async (req: Request, res: Response) => {
  const userId = get(req, "userData.user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.status(StatusCodes.OK).json({ sessions });
};

export { createUserSession, invalidateUserSession, getAllUserSessions };
