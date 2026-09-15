require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set. Check your .env file.');
}

module.exports = { JWT_SECRET };