import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import compression from 'compression';
import { OutgoingHttpHeaders } from 'http';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Diagnostic route to check headers - add this before any other middleware
app.get('/check-headers', (req, res) => {
  // Set our desired header
  res.setHeader('X-Robots-Tag', 'index, follow');
  
  // Return all request headers for diagnosis
  const requestHeaders = req.headers;
  
  // Force the response header to the correct value
  res.set({
    'X-Robots-Tag': 'index, follow',
    'Content-Type': 'application/json'
  });
  
  // Send the response with original headers and outgoing headers
  res.json({
    message: 'Headers diagnostic check',
    requestHeaders,
    responseHeaders: res.getHeaders(),
    // Info about the environment
    environment: {
      nodeEnv: process.env.NODE_ENV,
      host: req.get('host'),
      forwarded: req.get('x-forwarded-for'),
      forwardedHost: req.get('x-forwarded-host'),
      forwardedProto: req.get('x-forwarded-proto'),
      replitId: process.env.REPL_ID
    }
  });
});

// Add SEO-friendly headers and intercept any X-Robots-Tag headers from upstream
// This needs to be the FIRST middleware to intercept response headers
app.use((req, res, next) => {
  // Debug log to see what's happening
  console.log(`[DEBUG] Processing request for ${req.url}`);
  
  // Capture the original setHeader method
  const originalSetHeader = res.setHeader;
  const originalWriteHead = res.writeHead;
  
  // Override the setHeader method
  res.setHeader = function(name, value) {
    // Log the header being set
    if (name.toLowerCase() === 'x-robots-tag') {
      console.log(`[DEBUG] Attempt to set X-Robots-Tag: ${value}`);
    }
    
    // Block any X-Robots-Tag that would prevent indexing
    if (name.toLowerCase() === 'x-robots-tag' && 
        (typeof value === 'string' && 
         (value.includes('noindex') || value.includes('none')))) {
      console.log(`[DEBUG] Blocking restrictive X-Robots-Tag: ${value}`);
      // Replace with our SEO-friendly version
      return originalSetHeader.call(this, 'X-Robots-Tag', 'index, follow');
    }
    
    // Allow all other headers to pass through normally
    return originalSetHeader.call(this, name, value);
  };
  
  // Override writeHead to catch headers at the last moment
  // @ts-ignore - Using any type for flexibility with headers
  res.writeHead = function(statusCode: number, statusMessage?: any, headers?: any) {
    // Handle different method signatures
    let finalHeaders: any = headers;
    
    if (typeof statusMessage === 'object' && !headers) {
      finalHeaders = statusMessage;
      statusMessage = undefined;
    }
    
    // Check if we have headers object
    if (finalHeaders) {
      // Look for X-Robots-Tag in a case-insensitive way
      Object.keys(finalHeaders).forEach(key => {
        if (key.toLowerCase() === 'x-robots-tag') {
          const value = finalHeaders[key];
          console.log(`[DEBUG] Found X-Robots-Tag in writeHead: ${value}`);
          if (typeof value === 'string' && (value.includes('noindex') || value.includes('none'))) {
            console.log(`[DEBUG] Overriding restrictive X-Robots-Tag in writeHead`);
            finalHeaders[key] = 'index, follow';
          }
        }
      });
    }
    
    // Call original method with the right arguments
    if (statusMessage && typeof statusMessage !== 'object') {
      return originalWriteHead.call(this, statusCode, statusMessage, finalHeaders);
    } else {
      return originalWriteHead.call(this, statusCode, finalHeaders);
    }
  };
  
  // Explicitly set our SEO-friendly header early
  res.setHeader('X-Robots-Tag', 'index, follow');
  
  // Register a listener to check headers before they're sent
  res.on('finish', () => {
    // Get the final headers
    const finalHeaders = res.getHeaders();
    console.log(`[DEBUG] Response headers for ${req.url}:`, finalHeaders);
    
    // Check if X-Robots-Tag is still problematic
    const robotsTag = finalHeaders['x-robots-tag'];
    if (robotsTag && typeof robotsTag === 'string' && 
        (robotsTag.includes('noindex') || robotsTag.includes('none'))) {
      console.log(`[WARNING] X-Robots-Tag is still restrictive after all middleware: ${robotsTag}`);
    }
  });
  
  next();
});

// Enable compression for all requests
app.use(compression({
  level: 6, // Default compression level
  threshold: 0, // Compress all responses
  filter: (req: Request, res: Response) => {
    // Don't compress already compressed resources like images
    if (req.headers['content-type']) {
      return !/^(image|video|audio)/i.test(req.headers['content-type']);
    }
    return true;
  }
}));

// Add SEO-friendly headers for all responses as backup
app.use((req, res, next) => {
  // Remove any existing X-Robots-Tag headers that might have been set by proxy
  res.removeHeader('X-Robots-Tag');
  
  // Add SEO-friendly robots header that allows indexing
  res.setHeader('X-Robots-Tag', 'index, follow');
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
