const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateToken } = require("../services/authService");

const registerUser = async (user) => {
    try {
        const newUser = new User(user);
        const hashedPassword = await bcrypt.hash(newUser.password, 12);

        newUser.isLoggedIn = true;
        newUser.password = hashedPassword;

        await newUser.save();
        console.log('User successfully registered');

        return true;

    } catch (error) {
        console.log('Error in register user', error.message);

        return false;
    }
}

const loginUser = async ({ username, email, password }) => {
    try {
        const response = {
            userFound: false,
            passwordMatch: false,
            token: null
        };

        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        response.userFound = !!user;

        if (user) {
            response.passwordMatch = await bcrypt.compare(password, user.password);
        }

        if (response.userFound && response.passwordMatch) {
            response.token = generateToken({username, email});
        }

        return response;

    } catch (error) {
        console.error(error.message);
        return { error: 'Error in user login' };
    }
};

const findUser = async (findBy) => {
    const user = await User.findOne({
        $or: [{username: findBy}, {email: findBy}]
    });
    if (user) {
        return user;
    } else {
        console.log('User not found');
    }
}

module.exports = {
    registerUser,
    loginUser,
    findUser
};
