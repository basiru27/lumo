const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabaseAdmin');

module.exports = async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Missing token' });
  
  const token = header.split(' ')[1];
  
  try {
    // Use Supabase to verify the token - this is the most reliable method
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Supabase auth error:', error?.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.userId = user.id;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
