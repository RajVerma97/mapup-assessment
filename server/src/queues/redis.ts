import { configDotenv } from 'dotenv';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.prod' });
} else {
  dotenv.config({ path: '.env.local' });
}

const redisHost = process.env.REDISHOST;
const redisPort = process.env.REDISPORT
  ? parseInt(process.env.REDISPORT, 10)
  : 6379;

const redisPassword =
  process.env.NODE_ENV === 'production' ? process.env.REDISPASSWORD : undefined;

if (!redisHost) {
  throw new Error('REDISHOST VARIABLE IS NOT DEFINED');
}

if (!redisPort) {
  throw new Error('REDISPORT VARIABLE IS NOT DEFINED');
}

const redisConnection = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  maxRetriesPerRequest: null,
});

console.log(
  `Connecting to Redis at ${redisHost}:${redisPort}` +
    (redisPassword ? ' with password' : ' without password')
);

export default redisConnection;
