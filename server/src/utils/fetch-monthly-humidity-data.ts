import WeatherData from "../api/models/weather.js";

export default async function fetchMonthlyTemperatureData() {
  return await WeatherData.aggregate([
    {
      $group: {
        _id: {
          month: { $month: { $dateFromString: { dateString: '$time' } } },
          year: { $year: { $dateFromString: { dateString: '$time' } } },
        },
        avgHumidity: { $avg: { $toDouble: '$dew_point_2m' } },
      },
    },
    {
      $project: {
        month: '$_id.month',
        year: '$_id.year',
        avgHumidity: { $round: [{ $ifNull: ['$avgHumidity', 0] }, 1] },
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
              $arrayElemAt: [
                '$$monthsInYear',
                { $subtract: ['$_id.month', 1] },
              ],
            },
          },
        },
        formattedDate: {
          $concat: [
            {
              $arrayElemAt: [
                [
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
                { $subtract: ['$_id.month', 1] },
              ],
            },
            ' ',
            { $toString: '$_id.year' },
          ],
        },
      },
    },
    {
      $sort: {
        year: 1,
        month: 1,
      },
    },
  ]);
}
