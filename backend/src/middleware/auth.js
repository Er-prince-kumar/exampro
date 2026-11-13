import { supabase } from '../utils/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In dev mode with mock tokens, we allow mock user if configured
      if (process.env.NODE_ENV === 'development' && req.headers['x-mock-user-id']) {
        req.user = {
          id: req.headers['x-mock-user-id'],
          email: 'mockstudent@exampro.edu'
        };
        return next();
      }
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      // Fallback for local testing if demo credentials are in use
      if (process.env.SUPABASE_URL?.includes('demo.supabase.co')) {
        req.user = {
          id: 'demo-user-1234-5678-9012',
          email: 'demo@exampro.edu',
          user_metadata: { full_name: 'Alex Rivera' }
        };
        req.token = token;
        return next();
      }
      return res.status(401).json({ error: 'Invalid or expired session token' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]', err);
    return res.status(500).json({ error: 'Failed to authenticate user token' });
  }
};

