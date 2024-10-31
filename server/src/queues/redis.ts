import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const createRedisConnection = () => {
  const redisHost = process.env.REDISHOST;
  const redisPort = process.env.REDISPORT
    ? parseInt(process.env.REDISPORT, 10)
    : 6379;
  const redisPassword = process.env.REDISPASSWORD;

  if (!redisHost) {
    throw new Error('REDISHOST environment variable is not defined');
  }

  const redisOptions = {
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    connectTimeout: 30000, 
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    keepAlive: 30000,
    retryStrategy: (times: number) => {
      if (times > 3) {
        console.error(`Redis retry attempt ${times} failed`);
        return null; 
      }
      const delay = Math.min(times * 1000, 3000);
      return delay;
    },
    reconnectOnError: (err: Error) => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
  };

  try {
    const redisConnection = new Redis(redisOptions);

    
    redisConnection.on('connect', () => {
      console.log(
        `Redis: Establishing connection to ${redisHost}:${redisPort}`
      );
    });

    redisConnection.on('ready', () => {
      console.log('Redis: Connection established and ready');
    });

    redisConnection.on('error', (err) => {
      console.error('Redis Error:', err);
    });

    redisConnection.on('close', () => {
      console.log('Redis: Connection closed');
    });

    redisConnection.on('reconnecting', () => {
      console.log('Redis: Attempting to reconnect...');
    });

    setInterval(() => {
      redisConnection.ping().catch((err) => {
        console.error('Redis ping failed:', err);
      });
    }, 10000);

    return redisConnection;
  } catch (error) {
    console.error('Failed to create Redis connection:', error);
    throw error;
  }
};

export default createRedisConnection();
