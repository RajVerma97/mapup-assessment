export enum TimeFrame {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface WeatherDataParams {
  page: number;
  limit: number;
  filter: string;
  sort: string;
  timeFrame: TimeFrame;
  dateFrom: string;
  dateTo: string;
}
