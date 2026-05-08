import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  email: string;
  role?: 'user' | 'admin';
}

export function generateToken(payload: TokenPayload): string {
  const secret = (process.env.JWT_SECRET || 'your-secret-key') as string;
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  
  return jwt.sign(payload, secret, { expiresIn } as any);
}

export function verifyToken(token: string): TokenPayload {
  const secret = (process.env.JWT_SECRET || 'your-secret-key') as string;
  
  return jwt.verify(token, secret) as TokenPayload;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}
