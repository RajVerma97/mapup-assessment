import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
  const { email, username, password, role } = req.body;

  const dbUser = await User.findOne({ email });

  if (dbUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email: email,
    username: username,
    password: hashedPassword,
    role: role,
  });

  try {
    await newUser.save();
    res.status(200).json({ message: 'User Registered successfully' });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while registering the user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h',
      }
    );

    const { password: _, ...userData } = user.toObject();
    res
      .status(200)
      .json({ token, user: userData, message: 'User Logged In Successfully' });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while registering the user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
