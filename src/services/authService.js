const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_ACCESS_SECRET;

const generateToken = (payload, expiresIn = "5h") => {
    return jwt.sign(payload, secretKey, {expiresIn});
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
}

const decodeToken = (token) => {
    return jwt.decode(token, secretKey);
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken
}
