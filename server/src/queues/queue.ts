import { Queue } from 'bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import redisConnection from './redis';

const csvQueue = new Queue('csv-processing', {
  connection: redisConnection,
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(csvQueue)],
  serverAdapter: serverAdapter,
});

export { csvQueue, serverAdapter };
