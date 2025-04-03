import { React, ReactDOMClient } from './react-fix';
import App from './App';
import './index.css';

// Create a simple loading indicator for async components
const LoadingIndicator = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

// Preload LCP image before rendering application
const preloadLCP = () => {
  const img = new Image();
  img.src = '/Img 5.png';
  // Use as any to bypass the TypeScript error for fetchPriority
  (img as any).fetchPriority = 'high';
  img.onload = () => {
    // Hide the placeholder once the actual image is loaded
    const placeholder = document.querySelector('.lcp-placeholder');
    if (placeholder) {
      placeholder.classList.add('opacity-0');
    }
  };
};

// Immediately start loading the LCP image
preloadLCP();

// Render the application with a higher priority
const renderApp = () => {
  const root = document.getElementById('root');
  // Remove placeholder when app is hydrated
  const placeholder = document.querySelector('.lcp-placeholder');
  if (placeholder) {
    placeholder.remove();
  }
  
  if (root) {
    ReactDOMClient.createRoot(root).render(
      <React.StrictMode>
        <React.Suspense fallback={<LoadingIndicator />}>
          <App />
        </React.Suspense>
      </React.StrictMode>,
    );
  }
};

// Use requestAnimationFrame for better timing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(renderApp);
  });
} else {
  requestAnimationFrame(renderApp);
}

// Preload other assets after main content is visible
window.addEventListener('load', () => {
  // Use requestIdleCallback to defer non-critical operations
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      // Preload large JS libraries that may be needed later
      const preloadLinks = [
        '/assets/vendor-chunk.js',
        '/assets/ui-chunk.js'
      ];
      
      preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    });
  }
});
