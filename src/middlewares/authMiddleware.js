import jwt from 'jsonwebtoken';

function getTokenSecret() {
    return process.env.JWT_SECRET || process.env.SECRET_KEY;
}

export function signAuthToken(user) {
    const tokenSecret = getTokenSecret();

    if (!tokenSecret) {
        throw new Error('JWT secret is not configured.');
    }

    return jwt.sign(
        {
            sub: String(user.id),
            username: user.username,
            email: user.email
        },
        tokenSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
}

export function validateUser(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing.' });
    }
    try {
        const decode = jwt.verify(token, getTokenSecret());
        req.user = decode;
        next();
    }
    catch(err)
    {
        console.error('Token validation error:', err);
        return res.status(401).json({ message: 'Invalid authentication token.' });
    }
};