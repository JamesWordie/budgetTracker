// External
import jwt from "jsonwebtoken";

/**
 * @function signJWT
 * @returns a new JWT for the user to use as access or refresh
 */
export const signJWT = async (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, process.env.JWT_SECRET!, options);
};

/**
 * @function decode
 * @param token the token to validate
 * @returns a verified/validated response or an error
 */
export const decode = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    return { valid: true, expired: false, decoded };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};
