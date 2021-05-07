import { StormGlass } from '@src/clients/stormGlass';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import * as HTTPUtil from '@src/util/request';

jest.mock('@src/util/request');

describe('StormGlass client', () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<typeof HTTPUtil.Request>;
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;
  
  it('should return the normalized forecast from the forecast service', async () => {
    const latitude = -27.3340574;
    const longitude = -48.5356659;

    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
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

    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(latitude, longitude);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fails before reaching the service', async () => {
    const latitude = -27.3340574;
    const longitude = -48.5356659;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedRequest);

    // This request is used without the "await" because the test validates the error before reaching the service
    // The "await" is used in the "expect" just to simulate the test
    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get a StormGlassResponseError when the StormGlass service responds with error', async () => {
    const latitude = -27.3340574;
    const longitude = -48.5356659;

    MockedRequestClass.isRequestError.mockReturnValue(true);
    
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: {
          errors: ['Rate Limit reached'],
        },
      }
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
