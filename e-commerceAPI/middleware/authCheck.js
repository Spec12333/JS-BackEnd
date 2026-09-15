const jwt = require('jsonwebtoken');
const { JWT_SECRET }  = require('../config/env');

function authentication(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res
        .status(401)
        .json({error : "Json Token is required"});
    }
    const token = header.split(' ')[1];

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next()
    } catch {
        return res
        .status(401)
        .json({error : "Invalid Token"})
    }
}

function authorization(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res
            .status(403)
            .json({error : "Forbidden"});
        }
        next();
    }
}

module.exports = {authentication, authorization};