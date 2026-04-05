const jwt = require('jsonwebtoken');
const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'Relations')).User;

const isStudent = async (req, res, next) => {
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
        
        // Зберігаємо user_Id в запиті для подальшого використання
        req.user = decoded; 

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        console.error("Auth Error:", error.message);
        return res.status(401).json({message: "Invalid token"});
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
        
        if (decoded.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
    } catch (error) {
        console.error("Auth Admin Error:", error.message);
        return res.status(401).json({message: "Invalid token"});
    }
};

module.exports = {
    isStudent,
    isAdmin
};