import { Worker } from 'bullmq';
import csvParser from 'csv-parser';
import fs from 'fs';
import { Job } from 'bullmq';
import redisConnection from '../queues/redis';
import WeatherData from '../api/models/weather';
import { json } from 'body-parser';

let skipRows = 4;

const worker = new Worker(
  'csv-processing',
  async (job: Job) => {
    const { filePath } = job.data;

    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(
        csvParser({
          skipLines: skipRows,
          headers: true,
        })
      )
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try {
          for (const item of results) {
            const weatherData = {
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
            };

            const mongoDocument = new WeatherData(weatherData);
            await mongoDocument.save();

            console.log('Weather data saved:', mongoDocument);
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
