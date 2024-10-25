const mongoose = require('mongoose');

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: UserRoles,
    default: UserRoles.USER,
    required: false,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
