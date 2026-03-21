const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Missing token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    req.userId = payload.sub; // Supabase user UUID
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
