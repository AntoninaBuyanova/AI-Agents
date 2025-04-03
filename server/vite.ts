import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Middleware to override the default express response methods and ensure X-Robots-Tag is correct
export function overridePlatformHeaders(res: any) {
  // Store the original methods
  const originalSet = res.set;
  const originalSetHeader = res.setHeader;
  const originalWriteHead = res.writeHead;
  
  // Override the set method
  res.set = function(field: any, val?: any) {
    if (typeof field === 'string' && field.toLowerCase() === 'x-robots-tag') {
      if (typeof val === 'string' && (val.includes('noindex') || val.includes('none'))) {
        // Override with SEO-friendly value
        return originalSet.call(this, field, 'index, follow');
      }
    } else if (typeof field === 'object') {
      // Check if x-robots-tag is in the object
      const fieldLower = Object.keys(field).reduce((acc: any, key) => {
        acc[key.toLowerCase()] = key;
        return acc;
      }, {});
      
      if (fieldLower['x-robots-tag']) {
        const actualKey = fieldLower['x-robots-tag'];
        const value = field[actualKey];
        if (typeof value === 'string' && (value.includes('noindex') || value.includes('none'))) {
          field[actualKey] = 'index, follow';
        }
      }
    }
    
    return originalSet.apply(this, arguments);
  };
  
  // Override setHeader method
  res.setHeader = function(name: string, value: any) {
    if (name.toLowerCase() === 'x-robots-tag') {
      if (typeof value === 'string' && (value.includes('noindex') || value.includes('none'))) {
        return originalSetHeader.call(this, name, 'index, follow');
      }
    }
    return originalSetHeader.apply(this, arguments);
  };
  
  // Override writeHead method to intercept headers at the last moment
  res.writeHead = function(statusCode: number, statusMessage?: any, headers?: any) {
    // Handle different method signatures
    let finalHeaders: any = headers;
    
    if (typeof statusMessage === 'object' && !headers) {
      finalHeaders = statusMessage;
      statusMessage = undefined;
    }
    
    if (finalHeaders) {
      const headersObj = Object.keys(finalHeaders).reduce((acc: any, key) => {
        acc[key.toLowerCase()] = key;
        return acc;
      }, {});
      
      if (headersObj['x-robots-tag']) {
        const actualKey = headersObj['x-robots-tag'];
        const value = finalHeaders[actualKey];
        if (typeof value === 'string' && (value.includes('noindex') || value.includes('none'))) {
          finalHeaders[actualKey] = 'index, follow';
        }
      }
    }
    
    if (statusMessage && typeof statusMessage !== 'object') {
      return originalWriteHead.call(this, statusCode, statusMessage, finalHeaders);
    } else {
      return originalWriteHead.call(this, statusCode, finalHeaders);
    }
  };
  
  // Explicitly set the SEO-friendly header
  res.setHeader('X-Robots-Tag', 'index, follow');
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ['localhost', '127.0.0.1']
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Middleware to override platform headers before Vite middleware
  app.use((req, res, next) => {
    overridePlatformHeaders(res);
    next();
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    // Override headers for this specific route too
    overridePlatformHeaders(res);
    
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      
      // Add preload links for critical resources
      const preloadLinks = `
        <link rel="preload" href="/src/main.tsx?v=${nanoid()}" as="script" crossorigin>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com">
      `;
      
      // Add preload links before the closing </head> tag
      template = template.replace('</head>', `${preloadLinks}</head>`);
      
      // Replace the main script tag with a versioned one
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      
      // Add a meta robots tag to the HTML directly
      if (!template.includes('<meta name="robots"')) {
        template = template.replace('</head>', '<meta name="robots" content="index,follow">\n</head>');
      }
      
      const transformedHtml = await vite.transformIndexHtml(url, template);
      
      // Forcefully set headers right before sending response
      res.status(200).set({ 
        "Content-Type": "text/html",
        // Add cache headers for better performance
        "Cache-Control": "public, max-age=0, must-revalidate",
        // Force the correct X-Robots-Tag
        "X-Robots-Tag": "index, follow"
      }).end(transformedHtml);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Intercept headers for static files
  app.use((req, res, next) => {
    overridePlatformHeaders(res);
    next();
  });

  // Serve static files with caching headers for better performance
  app.use(express.static(distPath, {
    maxAge: '1d', // Cache static assets for 1 day
    immutable: true, // Assets with content hashes are immutable
    etag: true,
    index: false, // Don't serve index.html automatically
    setHeaders: (res) => {
      // Force SEO-friendly headers to all static assets
      res.setHeader('X-Robots-Tag', 'index, follow');
    }
  }));

  // Intercept headers for the fallback route
  app.use((req, res, next) => {
    overridePlatformHeaders(res);
    next();
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    // Force SEO-friendly headers once more before sending
    res
      .set({
        "Cache-Control": "public, max-age=0, must-revalidate",
        "X-Robots-Tag": "index, follow"
      })
      .sendFile(path.resolve(distPath, "index.html"));
  });
}
