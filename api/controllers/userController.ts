import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
  const { email, username, password, role } = req.body;

  const dbUser = await User.findOne({ email });

  if (dbUser) {
    return res.status(400).send('User already exists');
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
    res.status(201).send(' Success register users');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }
    console.log('login');

    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h',
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send('Server error');
  }
};
