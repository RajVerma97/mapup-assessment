import WeatherData from "api/models/weather.js";
export default async function fetchWeatherSeasonChart() {
    return await WeatherData.aggregate([
        {
            $addFields: {
                parsedDate: { $dateFromString: { dateString: '$time' } },
            },
        },
        {
            $addFields: {
                month: { $month: '$parsedDate' },
                year: { $year: '$parsedDate' },
                season: {
                    $switch: {
                        branches: [
                            {
                                // Spring (March, April, May)
                                case: { $in: [{ $month: '$parsedDate' }, [3, 4, 5]] },
                                then: 'Spring',
                            },
                            {
                                // Summer (June, July, August)
                                case: { $in: [{ $month: '$parsedDate' }, [6, 7, 8]] },
                                then: 'Summer',
                            },
                            {
                                // Fall/Autumn (September, October, November)
                                case: { $in: [{ $month: '$parsedDate' }, [9, 10, 11]] },
                                then: 'Autumn',
                            },
                            {
                                // Winter (December, January, February)
                                case: { $in: [{ $month: '$parsedDate' }, [12, 1, 2]] },
                                then: 'Winter',
                            },
                        ],
                        default: 'Unknown',
                    },
                },
            },
        },
        {
            $group: {
                _id: {
                    season: '$season',
                    year: '$year',
                },
                avgTemp: { $avg: { $toDouble: '$temperature_2m' } },
                avgDewPoint: { $avg: { $toDouble: '$dew_point_2m' } },
                avgPrecipitation: { $avg: { $toDouble: '$precipitation' } },
                avgRain: { $avg: { $toDouble: '$rain' } },
                avgSnowfall: { $avg: { $toDouble: '$snowfall' } },
                avgWindSpeed: { $avg: { $toDouble: '$wind_speed_100m' } },
                avgCloudCoverLow: { $avg: { $toDouble: '$cloud_cover_low' } },
                avgCloudCoverMid: { $avg: { $toDouble: '$cloud_cover_mid' } },
                avgCloudCoverHigh: { $avg: { $toDouble: '$cloud_cover_high' } },
                avgSoilTemp: { $avg: { $toDouble: '$soil_temperature_7_to_28cm' } },
                avgSoilMoisture: { $avg: { $toDouble: '$soil_moisture_7_to_28cm' } },
            },
        },
        {
            $project: {
                _id: 0,
                season: '$_id.season',
                year: '$_id.year',
                avgTemp: { $round: ['$avgTemp', 1] },
                avgDewPoint: { $round: ['$avgDewPoint', 1] },
                avgPrecipitation: { $round: ['$avgPrecipitation', 1] },
                avgRain: { $round: ['$avgRain', 1] },
                avgSnowfall: { $round: ['$avgSnowfall', 1] },
                avgWindSpeed: { $round: ['$avgWindSpeed', 1] },
                avgCloudCoverLow: { $round: ['$avgCloudCoverLow', 1] },
                avgCloudCoverMid: { $round: ['$avgCloudCoverMid', 1] },
                avgCloudCoverHigh: { $round: ['$avgCloudCoverHigh', 1] },
                avgSoilTemp: { $round: ['$avgSoilTemp', 1] },
                avgSoilMoisture: { $round: ['$avgSoilMoisture', 1] },
                formattedPeriod: {
                    $concat: ['$_id.season', ' ', { $toString: '$_id.year' }],
                },
            },
        },
        {
            $sort: {
                year: 1,
                season: 1,
            },
        },
    ]);
}
