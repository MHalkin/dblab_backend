const jwt = require('jsonwebtoken');
const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'Relations')).User;

const isStudent = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization header' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.KEY);

        const user = await User.findByPk(decoded.id, {
            attributes: ['user_Id', 'role', 'verified'],
            raw: true
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = {
            id: user.user_Id,
            role: user.role,
            verified: user.verified
        };

        return next();
    } catch (error) {
        console.error("Auth Base Error:", error.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

const isAdmin = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization header' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
    } catch (error) {
        console.error("Auth Admin Error:", error.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

const isExpert = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: 'No authorization header' });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.KEY);

        const user = await User.findByPk(decoded.id, {
            attributes: ['user_Id', 'role', 'verified'],
            raw: true
        });

        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = {
            id: user.user_Id,
            role: user.role,
            verified: user.verified
        };

        if (req.user.role === "expert" || req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied: Experts or Admins only' });
        }
    } catch (error) {
        console.error("Auth Expert Error:", error.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

const getUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findByPk(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const isVerified = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.verified === 1) {
        return next();
    } else {
        return res.status(403).json({ message: 'Access denied: Account not verified' });
    }
};

module.exports = {
    isStudent,
    isAdmin,
    isExpert,
    getUser,
    isVerified
};