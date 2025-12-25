import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });


const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is missing!`);
  }
  return value;
};

export default {
  node_env: requireEnv("NODE_ENV"),
  port: requireEnv("PORT"),
  database_url: requireEnv("DATABASE_URL"),
  FRONTEND_URL: requireEnv("FRONTEND_URL"),
  GOOGLE_CLIENT_ID: requireEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: requireEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: requireEnv("GOOGLE_CALLBACK_URL"),
  EXPRESS_SESSION_SECRET: requireEnv("EXPRESS_SESSION_SECRET"),

  cloudinary: {
    api_secret: requireEnv("CLOUDINARY_API_SECRET"),
    cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: requireEnv("CLOUDINARY_API_KEY"),
  },


  jwt: {
    jwt_secret: requireEnv("JWT_SECRET"),
    expires_in: requireEnv("EXPIRES_IN"),
    refresh_token_secret: requireEnv("REFRESH_TOKEN_SECRET"),
    refresh_token_expires_in: requireEnv("REFRESH_TOKEN_EXPIRES_IN"),
    reset_pass_secret: requireEnv("RESET_PASS_TOKEN"),
    reset_pass_token_expires_in: requireEnv("RESET_PASS_TOKEN_EXPIRES_IN"),
  },
  salt_round: requireEnv("SALT_ROUND"),
  admin_email: requireEnv("ADMIN_EMAIL"),
  admin_password: requireEnv("ADMIN_PASSWORD"),
};
