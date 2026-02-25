const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for geodnatechsub API
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://geodnatechsub.com',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔵 Proxying:', req.method, req.url);
        console.log('   Target:', 'https://geodnatechsub.com' + req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('✅ Response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('❌ Proxy Error:', err.message);
      }
    })
  );
};