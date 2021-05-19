import { Auth } from "@src/services/auth";

describe('Authentication service', () => {
  it('should return the password as an encrypted string', async () => {
    const password = '1234';
    
    await expect(Auth.hashPassword(password)).resolves.toEqual(expect.any(String));
  });

  it('should return true when the password for compatible with generated hash', async () => {
    const password = '1234';
    const hashedPassword = await Auth.hashPassword(password);

    await expect(Auth.comparePassword(password, hashedPassword)).resolves.toBeTruthy();
  });
});
