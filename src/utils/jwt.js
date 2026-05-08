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
      uid: String(user.id),
      username: user.username,
      email: user.email
    },
    tokenSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}
