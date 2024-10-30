import { Queue } from 'bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import redisConnection from './redis.js';

// Create the queue
const csvQueue = new Queue('csv-processing', {
  connection: redisConnection,
});

// Set up Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(csvQueue)],
  serverAdapter,
});

export {
  csvQueue,
  serverAdapter,
  addQueue,
  removeQueue,
  setQueues,
  replaceQueues,
};
