const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token is required',
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode; 
        next(); 
    } catch (error) {
        console.error('Error in requireSignIn middleware:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

module.exports = { requireSignIn };
