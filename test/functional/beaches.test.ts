import { Beach } from "@src/models/beach";

describe('Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany({}));

  describe('When creating a new beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        latitude: -33.792726,
        longitude: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return 422 when there is a validation error', async () => {
      const newBeach = {
        latitude: 'string_is_invalid',
        longitude: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: 'Beach validation failed: latitude: Cast to Number failed for value "string_is_invalid" at path "latitude"',
      });
    });

    it.skip('should return 500 when there is any error other than validation error', async () => {
      //TODO: think in a way to throw a 500
    });
  });
});