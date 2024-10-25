import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Unknown Error',
      message: 'Invalid token',
    });
    return;
  }
}

export default verifyToken;
