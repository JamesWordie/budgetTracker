import jwt from "jsonwebtoken";

export const signJWT = async (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, process.env.JWT_SECRET!, options);
};

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
