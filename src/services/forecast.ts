import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';

export enum BeachPosition {
  N = 'N',
  S = 'S',
  E = 'E',
  W = 'W',
}

export interface Beach {
  name: string;
  user: string;
  latitude: number;
  longitude: number;
  position: BeachPosition;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error during forecast processing';
    super(`${internalMessage}: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];

    try {
      for(const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.latitude, beach.longitude);
        const enrichedBeachData = this.enrichedBeachData(points, beach);
        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch(error) {
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private enrichedBeachData(points: ForecastPoint[], beach: Beach): BeachForecast[] {
    return points.map((point) => ({
      ...{
        latitude: beach.latitude,
        longitude: beach.longitude,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for(const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);

      if(timePoint){
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }
}
