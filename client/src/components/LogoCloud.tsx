import React, { useEffect, useState, useRef } from 'react';
import { ChatIcon, QuotesIcon, DocumentIcon, ColumnsIcon } from './icons/Logo';

const LogoCloud: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  
  // Optimize LCP by setting attributes directly on the already preloaded image
  useEffect(() => {
    // Find the placeholder in the DOM if it exists
    const domPlaceholder = document.querySelector('.lcp-placeholder');
    if (domPlaceholder) {
      // When our component image loads, remove the global placeholder
      if (imgRef.current) {
        imgRef.current.onload = () => {
          setImageLoaded(true);
          // Apply fade-in animation to our image
          if (imgRef.current) {
            imgRef.current.style.opacity = '1';
          }
          // Remove the global placeholder
          domPlaceholder.remove();
          // Fade out our local placeholder
          if (placeholderRef.current) {
            placeholderRef.current.style.opacity = '0';
          }
        };
        
        // Set src if not already loaded
        if (!imgRef.current.src) {
          imgRef.current.src = '/Img 5.png';
        }
      }
    } else {
      // No global placeholder found, just load the image normally
      if (imgRef.current && !imgRef.current.src) {
        imgRef.current.src = '/Img 5.png';
        imgRef.current.onload = () => {
          setImageLoaded(true);
          if (imgRef.current) imgRef.current.style.opacity = '1';
          if (placeholderRef.current) placeholderRef.current.style.opacity = '0';
        };
      }
    }
  }, []);

  return (
    <section className="py-6 md:py-10 lg:pt-10 lg:pb-[3.75rem] bg-[#FFFFFF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[2rem] lg:text-[3.25rem] leading-[1.1] lg:leading-[1.2] font-aeonik font-medium mb-8 md:mb-12 text-center text-[#232323]">
          Chat that's actually made for students
        </h2>
        
        <div className="max-w-[1240px] mx-auto mb-12 md:mb-16 relative">
          {/* Low quality image placeholder with background color */}
          <div 
            ref={placeholderRef}
            className="w-full bg-gray-100 rounded-2xl shadow-lg"
            style={{
              aspectRatio: "16/9",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "opacity 0.5s ease-in-out",
            }}
          />

          {/* Main image with priority loading - important for LCP */}
          <img 
            ref={imgRef}
            alt="AI Chat Interface for Students" 
            width="1240"
            height="697"
            className="w-full h-auto rounded-2xl shadow-lg absolute top-0 left-0"
            style={{ 
              opacity: 0,
              transition: "opacity 0.5s ease-in-out" 
            }}
            fetchPriority="high"
            decoding="async"
            loading="eager" 
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1240px"
            // Using only PNG since WebP doesn't seem to be available
            srcSet="/Img 5.png 1240w"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-[1240px] mx-auto mt-16 md:mt-24">
          {/* Always the best answer */}
          <div className="flex flex-row items-start md:flex-col md:items-center md:text-center gap-3 md:gap-4">
            <div className="mb-0 md:mb-4">
              <ChatIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-[15px] md:text-base lg:text-base font-medium mb-1 md:mb-2">Always the best answer</h3>
              <p className="text-[#666666] text-sm">
                We auto-select the best model to give you a smarter, faster answer
              </p>
            </div>
          </div>

          {/* Academic citations */}
          <div className="flex flex-row items-start md:flex-col md:items-center md:text-center gap-3 md:gap-4">
            <div className="mb-0 md:mb-4">
              <QuotesIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-[15px] md:text-base lg:text-base font-medium mb-1 md:mb-2">Academic citations</h3>
              <p className="text-[#666666] text-sm">
                Every answer come with formatted, trustworthy academic citations
              </p>
            </div>
          </div>

          {/* Academic databases */}
          <div className="flex flex-row items-start md:flex-col md:items-center md:text-center gap-3 md:gap-4">
            <div className="mb-0 md:mb-4">
              <DocumentIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-[15px] md:text-base lg:text-base font-medium mb-1 md:mb-2">Academic databases</h3>
              <p className="text-[#666666] text-sm">
                Pull facts from real, credible academic sources
              </p>
            </div>
          </div>

          {/* Chat with PDFs */}
          <div className="flex flex-row items-start md:flex-col md:items-center md:text-center gap-3 md:gap-4">
            <div className="mb-0 md:mb-4">
              <ColumnsIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-[15px] md:text-base lg:text-base font-medium mb-1 md:mb-2">Chat with PDFs</h3>
              <p className="text-[#666666] text-sm">
                Ask across documents, compare arguments, extract key points
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
