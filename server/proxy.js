import express from 'express';
// import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
// import { supabase } from '../src/lib/supabase.js';

import router from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Authentication middleware
// const authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Unauthorized: No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     // Verify the token with Supabase
//     const { data, error } = await supabase.auth.getUser(token);

//     if (error || !data.user) {
//       return res.status(401).json({ error: 'Unauthorized: Invalid token' });
//     }

//     // Store user info in request for later use
//     req.user = data.user;
//     next();
//   } catch (error) {
//     console.error('Authentication error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// Authorization middleware to check if user has access to the requested server
// const authorizeServerAccess = async (req, res, next) => {
//   const { serverId } = req.params;
//   const userId = req.user.id;

//   if (!serverId) {
//     return res.status(400).json({ error: 'Server ID is required' });
//   }

//   try {
//     // Check if user has approved access to this server
//     const { data, error } = await supabase
//       .from('server_assignments')
//       .select('*')
//       .eq('server_id', serverId)
//       .eq('user_id', userId)
//       .eq('status', 'approved')
//       .single();

//     if (error || !data) {
//       return res.status(403).json({ error: 'Forbidden: You do not have access to this server' });
//     }

//     // Get the server details
//     const { data: serverData, error: serverError } = await supabase
//       .from('servers')
//       .select('*')
//       .eq('id', serverId)
//       .single();

//     if (serverError || !serverData) {
//       return res.status(404).json({ error: 'Server not found' });
//     }

//     // Store server info in request for the proxy
//     req.targetServer = serverData;
//     next();
//   } catch (error) {
//     console.error('Authorization error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// Proxy middleware setup
// app.use('/api/proxy/:serverId/*', authenticate, authorizeServerAccess, (req, res, next) => {
//   const targetUrl = req.targetServer.url;
//   const pathRewrite = {
//     [`^/api/proxy/${req.params.serverId}`]: '',
//   };

//   // Create a proxy for this specific request
//   const proxy = createProxyMiddleware({
//     target: targetUrl,
//     changeOrigin: true,
//     pathRewrite,
//     onProxyRes: (proxyRes, req, res) => {
//       // Add headers to prevent direct access
//       proxyRes.headers['X-Frame-Options'] = 'SAMEORIGIN';
//       proxyRes.headers['Content-Security-Policy'] = "frame-ancestors 'self'";
//     },
//     onError: (err, req, res) => {
//       console.error('Proxy error:', err);
//       res.status(500).json({ error: 'Proxy error', message: err.message });
//     },
//   });

//   // Execute the proxy
//   proxy(req, res, next);
// });

// Health check endpoint

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', router);

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});