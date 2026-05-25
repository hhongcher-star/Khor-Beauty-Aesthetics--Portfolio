import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT',
  'CORS_ORIGINS',
  'NODE_ENV',
] as const;

type RequiredEnvVar = (typeof requiredEnvVars)[number];

const getRequiredEnv = (name: RequiredEnvVar) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const rawEnv = requiredEnvVars.reduce(
  (acc, name) => {
    acc[name] = getRequiredEnv(name);
    return acc;
  },
  {} as Record<RequiredEnvVar, string>
);

if (rawEnv.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

const corsOrigins = rawEnv.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (rawEnv.NODE_ENV === 'production') {
  if (corsOrigins.length === 0) {
    throw new Error('CORS_ORIGINS must not be empty in production');
  }

  if (corsOrigins.some((origin) => origin === '*' || origin.toLowerCase() === 'true')) {
    throw new Error('CORS_ORIGINS cannot allow wildcard origins in production');
  }
}

const port = Number(rawEnv.PORT);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error('PORT must be a valid TCP port number');
}

export const env = {
  databaseUrl: rawEnv.DATABASE_URL,
  jwtSecret: rawEnv.JWT_SECRET,
  port,
  nodeEnv: rawEnv.NODE_ENV,
  corsOrigins,
};
