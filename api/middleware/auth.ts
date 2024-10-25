import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from '../models/user';

dotenv.config();

export const SECRET = process.env.JWT_SECRET!;

export async function getUserById(id: string) {
  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(SECRET);
    console.log('token', token);

    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, SECRET);
    (req as CustomRequest).token = decoded;
    console.log(decoded);

    //@ts-expect-error
    const user = await getUserById(decoded.id);

    if (!user) {
      res.status(404).send('User not found');
    }
    console.log('from the authorize middleware');

    console.log(user);

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send('Please authenticate');
  }
};
