import { configDotenv } from 'dotenv';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisHost = process.env.REDISHOST;
const redisPort = process.env.REDISPORT
  ? parseInt(process.env.REDISPORT, 10)
  : 6379;

const redisPassword = process.env.REDISPASSWORD || undefined;
console.log(` holaa!Connecting to Redis at ${redisHost}:${redisPort}`);


const redisConnection = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  maxRetriesPerRequest: null,
});

export default redisConnection;
