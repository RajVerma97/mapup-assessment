import { configDotenv } from 'dotenv';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisHost = process.env.REDIS_HOST ;
const redisPort = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT, 10)
  : 6379;

const redisConnection = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
});

export default redisConnection;
