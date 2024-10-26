import { Worker } from 'bullmq';
import csvParser from 'csv-parser';
import fs from 'fs';
import { Job } from 'bullmq';
import redisConnection from '../queues/redis';
import WeatherData from '../api/models/weather';
import { json } from 'body-parser';

const worker = new Worker(
  'csv-processing',
  async (job: Job) => {
    const { filePath } = job.data;

    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try {
          for (const item of results) {
            console.log(item.hourly);

            //the json string is stringified twice, so we need to parse it twice
            const hourlyDataString = JSON.parse(item.hourly);
            const hourly = JSON.parse(hourlyDataString);

            const weatherData = new WeatherData({
              latitude: item.latitude,
              longitude: item.longitude,
              elevation: item.elevation,
              utc_offset_seconds: item.utc_offset_seconds,
              timezone: item.timezone,
              timezone_abbreviation: item.timezone_abbreviation,
              generationtime_ms: item.generationtime_ms,
              hourly_units: {
                time: item.hourly_units?.time || 'iso8601',
                temperature_2m: item.hourly_units?.temperature_2m || '°C',
              },
              hourly,
            });
            await weatherData.save();
            console.log('CSV processed and data stored in MongoDB.');
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(`Error saving data to MongoDB: ${error.message}`);
          } else {
            console.error('Error saving data to MongoDB: Unknown error');
          }
        }
      })
      .on('error', (error) => {
        console.error(`Error reading CSV file: ${error.message}`);
      });
  },
  { connection: redisConnection }
);

worker.on('failed', (job: Job | undefined, err: Error) => {
  if (job) {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
  } else {
    console.error(`Job failed with error: ${err.message}`);
  }
});

const shutdown = async () => {
  console.log('Shutting down worker...');
  await worker.close();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
