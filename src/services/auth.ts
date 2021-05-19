import bcrypt from 'bcrypt';

export class Auth {
  public static async hashPassword(password: string, salt = 10): Promise<string> {    
    return await bcrypt.hash(password, salt);
  }
  
  public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
