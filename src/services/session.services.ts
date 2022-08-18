// External
import { FilterQuery, UpdateQuery } from "mongoose";
import { omit, get } from "lodash";
// Config
import { ISession, ISessionAccess } from "../interfaces/ISession";
import Session from "../models/session.model";
import { findUser } from "./user.services";
import { BadRequestError } from "../errors";
// Utilities
import { signJWT, decode } from "../utils/jwt.utils";
import log from "../logger";

/**
 * @function createSession
 * @param userId userId from the headers as stored by the access/refresh tokens
 * @param userAgent where the request has come from, comes from request headers
 * @returns the newly created session on the DB
 */
const createSession = async (userId: string, userAgent: string) => {
  return await Session.create({ user: userId, userAgent });
};

/**
 * @function createAccessToken
 * @param {object} user - IUser object minus the password
 * @param {object} session - ISession object
 * @returns an access token generated from jsonwebtoken
 */
const createAccessToken = async ({ user, session }: ISessionAccess) => {
  const accessToken = await signJWT(
    { user, session: session._id },
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );

  return accessToken;
};

/**
 * @function reIssueAccessToken
 * @param {object} refreshToken jwt of the refresh token
 * @returns a new access token if the old one is expired
 */
const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  // Decode the refresh token
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, "_id")) return false;

  // Get the session
  const session = await Session.findById(get(decoded, "_id"));

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
};

/**
 * @function updateSession
 * @param sessionId sessionId taken from the request headers
 * @param update {object} Partial ISession to update the record
 * @returns the current session object (from find, if require updated, will need to do a find after) or an error
 */
const updateSession = async (
  sessionId: Pick<ISession, "_id">,
  update: UpdateQuery<Partial<ISession>>
) => {
  try {
    return Session.findByIdAndUpdate(sessionId, update);
  } catch (error: any) {
    throw new BadRequestError(error.message);
  }
};

/**
 * @function findSessions
 * @param query FilterQuery of ISession to find all of the users sessions
 * @returns an array of ISession objects
 */
const findSessions = async (query: FilterQuery<ISession>) => {
  try {
    return Session.find(query);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error.message);
  }
};

export {
  createSession,
  createAccessToken,
  reIssueAccessToken,
  updateSession,
  findSessions,
};
