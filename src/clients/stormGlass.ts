import { AxiosStatic } from "axios";

export class StormGlass {
  readonly stormGlassApiParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassApiSource = 'noaa';

  constructor(protected request: AxiosStatic) {}

  public async fecthPoints(latitude: number, longitude: number): Promise<{}> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}&lat=${latitude}&lng=${longitude}`
    );
  }
}