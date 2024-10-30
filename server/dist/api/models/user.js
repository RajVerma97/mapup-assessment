import mongoose from 'mongoose';
export var UserRoles;
(function (UserRoles) {
    UserRoles["USER"] = "USER";
    UserRoles["ADMIN"] = "ADMIN";
    UserRoles["MANAGER"] = "MANAGER";
})(UserRoles || (UserRoles = {}));
const userSchema = new mongoose.Schema({
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
