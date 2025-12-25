import { Role } from "@prisma/client";
import { createNewAccessTokenWithRefreshToken } from "../../helpers/userToken";
import prisma from "../../shared/prisma";

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return newAccessToken;
};

const getMe = async (user: any) => {
  const role = user.role;

  let includeOptions: any = {};

  if (role === Role.ADMIN) {
    includeOptions.admin = true;
  }

  if (role === Role.USER) {
    includeOptions.client = true;
  }

  includeOptions.auths = true;

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    include: includeOptions,
  });

  return userData;
};

export const AuthServices = {
  getNewAccessToken,
  getMe,
};
