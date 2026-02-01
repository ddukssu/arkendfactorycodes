const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// New: Allows request to proceed even without a token
exports.optionalAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        req.userId = null; // Mark as anonymous
        return next();
    }

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        // If token is invalid (e.g. expired), we treat them as guest rather than blocking
        if (err) req.userId = null;
        else {
            req.userId = decoded.id;
            req.userRole = decoded.role;
        }
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Require Admin Role' });
    }
    next();
};