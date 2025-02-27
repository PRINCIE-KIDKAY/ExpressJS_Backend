import jwt, { JwtPayload } from 'jsonwebtoken';

export default class CommonUtils {

  static GenerateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    result = result.slice(0, 5) + '-' + result.slice(5, 10) + '-' + result.slice(10, 20);
    return result;
  };

  static GenerateTempPassword = () => {
    const numbers = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    return numbers.join('');
  }


  public static verifyToken(token: string): JwtPayload | string {
    const secret: any = process.env.JWT_SECRET;
    if (!secret) {
      console.log('JWT_SECRET environment variable is not set');
      throw new Error('JWT_SECRET environment variable is not set');
    }

    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw new Error('Invalid token');
    }
  }



  public static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }
    return authHeader.split(' ')[1];
  }

  public static handleAuthHeader(req: any): any {
    try {
      const authHeader = req.headers.authorization; // Adjust based on environment
      const token = this.extractTokenFromHeader(authHeader);

      if (!token) {
        throw new Error('Unauthorized');
      }

      const decodedToken = this.verifyToken(token);
      return decodedToken;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const status = error.message === 'Unauthorized' ? 401 : 403;
        return new Response(JSON.stringify({ error: error.message }), {
          status: status,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  static generateOTP() {
    const digits = '123456789';
    let OTP = '';
    for (let i = 0; i < 5; i++) {
      OTP += digits[Math.floor(Math.random() * 9)];
    }
    return parseInt(OTP);
  }
}
