import { Queue } from 'bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import redisConnection from './redis';

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
