import WeatherData from '../api/models/weather.js';
import { Worker, Job } from 'bullmq';
import csvParser from 'csv-parser';
import fs from 'fs';
import redisConnection from '../queues/redis.js';
import { csvQueue } from '../queues/queue.js';

const skipRows = 4;

export function createWorker(io: any) {
  console.log('Creating worker instance...');

  redisConnection.on('error', (error) => {
    console.error('Redis connection error:', error);
  });

  const worker = new Worker(
    'csv-processing',
    async (job: Job) => {
      console.log('Job received:', {
        id: job.id,
        data: job.data,
        timestamp: new Date().toISOString(),
      });

      try {
        const { filePath } = job.data;

        if (!filePath) {
          throw new Error('No filePath provided in job data');
        }

        console.log(`Processing file: ${filePath}`);

        const fileStats = fs.statSync(filePath);
        console.log('File stats:', {
          size: fileStats.size,
          created: fileStats.birthtime,
          modified: fileStats.mtime,
        });

        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }

        const totalRows = await countCSVRows(filePath);
        console.log(`Total rows to process: ${totalRows}`);

        const results: any[] = [];
        let processedRows = 0;
        let savedRows = 0;

        const timeout = setTimeout(() => {
          console.error('Job processing timeout after 5 minutes');
          worker.close();
        }, 300000);

        return new Promise((resolve, reject) => {
          let streamEnded = false;
          console.log('Starting file stream...');

          const stream = fs
            .createReadStream(filePath, { highWaterMark: 64 * 1024 }) // Add buffer size
            .pipe(
              csvParser({
                skipLines: skipRows,
                headers: true,
              })
            );

          const processData = async (data: any) => {
            try {
              if (processedRows % 1000 === 0) {
                const memoryUsage = process.memoryUsage();
                console.log('Memory usage:', {
                  heapTotal:
                    Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
                  heapUsed:
                    Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
                  processedRows,
                });
              }

              const currentJob = await csvQueue.getJob(job.id!);
              if (!currentJob) {
                console.log('Job cancelled, cleaning up...');
                stream.destroy();
                clearTimeout(timeout);
                reject(new Error('Job was cancelled'));
                return;
              }

              results.push(data);
              processedRows++;

              if (processedRows % 100 === 0) {
                const parsingProgress = Math.min(
                  (processedRows / totalRows) * 100,
                  99
                );
                await job.updateProgress(parsingProgress);
                io.emit('progress', {
                  jobId: job.id,
                  progress: parsingProgress.toFixed(2),
                  processedRows,
                  totalRows,
                });
              }
            } catch (error) {
              console.error('Error in processData:', error);
              stream.destroy();
              clearTimeout(timeout);
              reject(error);
            }
          };

          const processEnd = async () => {
            try {
              streamEnded = true;
              console.log(
                `Stream ended, processing ${results.length} records...`
              );

              const batchSize = 100;
              for (let i = 0; i < results.length; i += batchSize) {
                console.log(
                  `Processing batch ${i / batchSize + 1} of ${Math.ceil(results.length / batchSize)}`
                );
                const batch = results.slice(i, i + batchSize);

                const batchStart = Date.now();

                const weatherDataBatch = batch.map((item) => ({
                  time: item._0,
                  temperature_2m: item._1,
                  dew_point_2m: item._2,
                  precipitation: item._3,
                  rain: item._4,
                  snowfall: item._5,
                  snow_depth: item._6,
                  weather_code: item._7,
                  pressure_msl: item._8,
                  surface_pressure: item._9,
                  cloud_cover_low: item._10,
                  cloud_cover_mid: item._11,
                  cloud_cover_high: item._12,
                  wind_speed_100m: item._13,
                  wind_direction_100m: item._14,
                  soil_temperature_7_to_28cm: item._15,
                  soil_moisture_7_to_28cm: item._16,
                }));

                await WeatherData.insertMany(weatherDataBatch, {
                  ordered: false,
                });
                savedRows += batch.length;

                const batchDuration = Date.now() - batchStart;
                console.log(
                  `Batch ${i / batchSize + 1} completed in ${batchDuration}ms`
                );

                const saveProgress = Math.min(
                  (savedRows / totalRows) * 100,
                  100
                );
                await job.updateProgress(saveProgress);
                io.emit('progress', {
                  jobId: job.id,
                  progress: saveProgress.toFixed(2),
                  savedRows,
                  totalRows,
                });
              }

              console.log('All records processed and saved');
              clearTimeout(timeout);
              await job.updateProgress(100);
              io.emit('progress', { jobId: job.id, progress: '100' });
              resolve(true);
            } catch (error) {
              console.error('Error in processEnd:', error);
              clearTimeout(timeout);
              reject(error);
            }
          };

          stream
            .on('data', processData)
            .on('end', processEnd)
            .on('error', (error) => {
              console.error(`Stream error: ${error.message}`);
              clearTimeout(timeout);
              reject(error);
            });

          stream.on('pause', () => {
            console.log('Stream paused');
          });

          stream.on('resume', () => {
            console.log('Stream resumed');
          });
        });
      } catch (error) {
        console.error(
          'Worker error:',
          error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 1,
      stalledInterval: 30000,
      maxStalledCount: 1,
      lockDuration: 300000,
    }
  );

  worker.on('active', (job) => {
    console.log(`Job ${job.id} has started processing`);
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`Job ${job?.id || 'unknown'} failed:`, err);
    io.emit('jobError', {
      jobId: job?.id,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  });

  worker.on('completed', (job: Job) => {
    console.log(`Job ${job.id} completed successfully`);
    io.emit('jobCompleted', {
      jobId: job.id,
      timestamp: new Date().toISOString(),
    });
  });

  worker.on('error', (err: Error) => {
    console.error('Worker error:', err);
  });

  console.log('Worker setup completed');
  return worker;
}
function countCSVRows(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let rowCount = -skipRows; 
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', () => rowCount++)
      .on('end', () => resolve(rowCount))
      .on('error', reject);
  });
}
