import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  
  it('should return the normalized forecast from the forecast service', async () => {
    const latitude = -27.3340574;
    const longitude = -48.5356659;

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(latitude, longitude);
    
    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });

  it('should exclude incomplete data points', async () => {
    const latitude = -27.3340574;
    const longitude = -48.5356659;
    const incompleteResponse = {
      hours: [
        {
          swellDirection: {
            noaa: 64.26
          },
          time: "2020-04-26T00:00:00+00:00",
          waveDirection: {
            noaa: 231.38
          },
        }
      ]
    };

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(latitude, longitude);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fails before reaching the service', async () => {
    const latitude = -27.3340574;
    const longitude = -48.5356659;

    mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedAxios);

    // This request is used without the "await" because the test validates the error before reaching the service
    // The "await" is used in the "expect" just to simulate the test
    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get a StormGlassResponseError when the StormGlass service responds with error', async () => {
    const latitude = -27.3340574;
    const longitude = -48.5356659;

    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: {
          errors: ['Rate Limit reached'],
        },
      }
    });

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
