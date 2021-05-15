describe('Users functional tests', () => {
  describe('When creating a new user', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'João da Silva',
        email: 'joao@mail.com',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });
  });
});
