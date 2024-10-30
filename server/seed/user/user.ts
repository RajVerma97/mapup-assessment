import User from '../../src/api/models/user';
import connectDb from '../../src/db';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

import userData from './user.json';

const seedUsers = async () => {
  try {
    await connectDb();
    for (const user of userData) {
      const userExists = await User.findOne({ email: user.email });

      if (userExists) {
        console.log(`User ${user.username} already exists.`);
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUser = new User({
        ...user,
        password: hashedPassword,
      });
      await newUser.save();
      console.log(`User with username ${user.username} created successfully`);
    }
  } catch (error) {
    console.log(error);
  }
};

seedUsers();
