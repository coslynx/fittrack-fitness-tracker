const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');


    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err);
         if (err instanceof jwt.TokenExpiredError) {
             return res.status(401).json({ message: 'Token expired' });
         } else if (err instanceof jwt.JsonWebTokenError) {
             return res.status(401).json({ message: 'Token is invalid' });
        }
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;