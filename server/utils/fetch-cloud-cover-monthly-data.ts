import WeatherData from '../api/models/weather';

export default async function fetchCloudCoverMonthlyData() {
  return await WeatherData.aggregate([
    {
      $group: {
        _id: { $month: { $dateFromString: { dateString: '$time' } } },
        avgLow: { $avg: { $toDouble: '$cloud_cover_low' } },
        avgMid: { $avg: { $toDouble: '$cloud_cover_mid' } },
        avgHigh: { $avg: { $toDouble: '$cloud_cover_high' } },
      },
    },
    {
      $project: {
        month: '$_id',
        monthName: {
          $let: {
            vars: {
              monthsInYear: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ],
            },
            in: {
              $arrayElemAt: ['$$monthsInYear', { $subtract: ['$_id', 1] }],
            },
          },
        },
        avgLow: { $round: [{ $ifNull: ['$avgLow', 0] }, 1] },
        avgMid: { $round: [{ $ifNull: ['$avgMid', 0] }, 1] },
        avgHigh: { $round: [{ $ifNull: ['$avgHigh', 0] }, 1] },
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);
}
