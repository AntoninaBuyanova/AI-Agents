// Proxy server to override X-Robots-Tag headers
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Target URL (our original app)
const TARGET = 'http://localhost:5000';

// Create custom middleware to override headers
function overrideRobotsHeaders(proxyRes, req, res) {
  // Remove any X-Robots-Tag headers
  if (proxyRes.headers['x-robots-tag']) {
    console.log('Removing restrictive X-Robots-Tag:', proxyRes.headers['x-robots-tag']);
    delete proxyRes.headers['x-robots-tag'];
  }
  
  // Add our SEO-friendly header
  proxyRes.headers['x-robots-tag'] = 'index, follow';
  
  // Log all headers for debugging
  console.log('Final headers:', proxyRes.headers);
}

// Configure proxy middleware
const proxyOptions = {
  target: TARGET,
  changeOrigin: true,
  onProxyRes: overrideRobotsHeaders,
  logLevel: 'debug'
};

// Set up proxy for all requests
app.use('/', createProxyMiddleware(proxyOptions));

// Start the proxy server on port 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Forwarding requests to ${TARGET}`);
}); 