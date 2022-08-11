import { ISession, ISessionAccess } from "../interfaces/ISession";
import Session from "../models/session.model";
import { signJWT, decode } from "../utils/jwt.utils";
import { findUser } from "./user.services";
import { omit, get } from "lodash";
import User from "../models/user.model";
import { IUser } from "../interfaces/exports.interfaces";
import { FilterQuery, UpdateQuery } from "mongoose";
import { BadRequestError } from "../errors";
import log from "../logger";

export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });

  return session;
};

export const createAccessToken = async ({ user, session }: ISessionAccess) => {
  const accessToken = await signJWT(
    { user, session: session._id },
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );

  return accessToken;
};

export const validateUser = async (
  userProperties: Pick<IUser, "email" | "password">
) => {
  const { email, password } = userProperties;
  const user = await User.findOne({ email });

  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
};

export const reIssueAccessToken = async ({
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

export const updateSession = async (
  sessionId: Pick<ISession, "_id">,
  update: UpdateQuery<Partial<ISession>>
) => {
  try {
    return Session.findByIdAndUpdate(sessionId, update);
  } catch (error: any) {
    throw new BadRequestError(error.message);
  }
};

export const findSessions = async (query: FilterQuery<ISession>) => {
  try {
    return Session.find(query);
  } catch (error: any) {
    log.error(error);
    throw new BadRequestError(error.message);
  }
};
