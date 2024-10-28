import { Server } from 'socket.io';
import { CronJob } from 'cron';
import http from 'http';
import { getRandomRevenueData } from './app';

export const setupSocketIO = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    const job = new CronJob('*/5 * * * * *', async () => {
      const data = await getRandomRevenueData();
      socket.emit('weather', data);
    });

    job.start();

    socket.on('disconnect', () => {
      job.stop();
    });
  });

  return io;
};
