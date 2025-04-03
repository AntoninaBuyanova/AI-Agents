import React, { useState, useEffect } from 'react';

interface UseCase {
  title: string;
  description: string;
  image: string;
}

const useCases: UseCase[] = [
  {
    title: "Research",
    description: "Dig deeper into complex topics or papers",
    image: "Cases.png"
  },
  {
    title: "Chat with Files",
    description: "Upload a document and ask anything about it",
    image: "Cases1.png"
  },
  {
    title: "Writing",
    description: "Get help with tone, phrasing, and structure",
    image: "Writing.png"
  },
  {
    title: "Everyday Questions",
    description: "Ask anything and get a fast, accurate answer",
    image: "Everyday Questions.png"
  },
  {
    title: "Brainstorming",
    description: "Generate ideas, titles, angles, or directions",
    image: "Brainstorming.png"
  },
  {
    title: "Study Assistant",
    description: "Clarify concepts, prep for tests, or quiz yourself",
    image: "Study Assistant.png"
  }
];

const UseCard: React.FC<{
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ title, description, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`rounded-[1.25rem] p-5 cursor-pointer transition-colors ${
        isActive ? 'bg-[#EEFF91]' : 'bg-white border border-[#E8E8E5] hover:bg-gray-50'
      }`}
    >
      <h3 className="text-[20px] font-['Aeonik_Pro'] font-medium leading-[28px] mb-2 text-[#3C3C3C]">{title}</h3>
      <p className="text-[#3C3C3C] text-[16px] font-['Aeonik_Pro'] font-normal leading-[24px]">{description}</p>
    </div>
  );
};

const UseCases: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Preload all images when component mounts
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = useCases.map((useCase) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = useCase.image;
          img.onload = resolve;
          img.onerror = reject;
        });
      });
      
      try {
        await Promise.all(imagePromises);
        setImagesPreloaded(true);
      } catch (error) {
        console.error("Failed to preload images:", error);
        setImagesPreloaded(true); // Continue even if some images fail to load
      }
    };
    
    preloadImages();
  }, []);

  // Function to handle tab changes with memoization
  const handleTabChange = (index: number) => {
    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      setActiveTab(index);
    });
  };

  return (
    <section className="py-6 md:py-10 lg:py-[3.75rem] bg-[#FFFFFF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto">
          <h2 className="text-[32px] lg:text-[52px] font-medium mb-6 lg:mb-8 text-[#232323] leading-[60px]">Use Cases</h2>

          <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16 lg:justify-between">
            <div className="block md:hidden w-full mb-8">
              {useCases.map((useCase, index) => (
                <img 
                  key={useCase.title}
                  src={useCase.image} 
                  alt={useCase.title}
                  className={`w-full h-auto rounded-[1.25rem] transition-opacity duration-300 ${
                    activeTab === index ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                />
              ))}
            </div>

            <div className="md:w-[340px] lg:w-[600px]">
              <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory -mx-4 px-4 gap-3 hide-scrollbar">
                {useCases.map((useCase, index) => (
                  <div key={useCase.title} className="flex-shrink-0 w-[280px] snap-center">
                    <UseCard
                      title={useCase.title}
                      description={useCase.description}
                      isActive={activeTab === index}
                      onClick={() => handleTabChange(index)}
                    />
                  </div>
                ))}
              </div>

              <div className="hidden md:flex flex-col gap-3">
                {useCases.map((useCase, index) => (
                  <UseCard
                    key={useCase.title}
                    title={useCase.title}
                    description={useCase.description}
                    isActive={activeTab === index}
                    onClick={() => handleTabChange(index)}
                  />
                ))}
              </div>
            </div>
            
            <div className="hidden md:block md:w-[340px] lg:w-[520px] flex-shrink-0 relative">
              {useCases.map((useCase, index) => (
                <img 
                  key={useCase.title}
                  src={useCase.image} 
                  alt={useCase.title}
                  className={`w-full h-auto rounded-[1.25rem] transition-opacity duration-300 absolute top-0 left-0 ${
                    activeTab === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  style={{
                    display: activeTab === index ? 'block' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default UseCases; 