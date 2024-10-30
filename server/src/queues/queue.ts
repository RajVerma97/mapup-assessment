import { Queue } from 'bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import redisConnection from './redis.js';
const { BullMQAdapter } = require('bull-board/bullMQAdapter');

const csvQueue = new Queue('csv-processing', {
  connection: redisConnection,
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(csvQueue)],
  serverAdapter: serverAdapter,
});

export { csvQueue, serverAdapter };
