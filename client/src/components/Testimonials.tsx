import React from 'react';

const AgentBuilder: React.FC = () => {
  return (
    <section className="py-6 md:py-10 lg:py-[3.75rem] bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          {/* Left side - Text content */}
          <div className="md:w-1/2">
            <h2 className="text-[32px] lg:text-[52px] font-medium leading-[1.2] mb-6 text-[#232323]">
              Want a math tutor?
              <br />
              Or a fact-checker?
              <br />
              Build it.
            </h2>
            <p className="text-[16px] md:text-[20px] font-['Aeonik_Pro'] font-normal text-[#3C3C3C] leading-[24px] md:leading-[28px] md:mb-8">
              Create your own AI agents with custom tone, skills,
              and detailed instructions tailored to your needs
            </p>
            <button className="hidden md:block bg-[#232323] text-white px-[60px] py-[18px] rounded-full text-[20px] font-['Aeonik_Pro'] font-medium hover:bg-[#333333] transition-colors">
              Try It
            </button>
          </div>

          {/* Right side - Form UI */}
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 -z-10">
              <img 
                src="want.png" 
                alt="Background pattern" 
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl">
              <img 
                src="want2.png" 
                alt="Agent builder interface" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Mobile Try It button */}
          <div className="block md:hidden w-full">
            <button className="w-full bg-[#232323] text-white px-[60px] py-[18px] rounded-full text-[16px] font-['Aeonik_Pro'] font-medium hover:bg-[#333333] transition-colors">
              Try It
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentBuilder;
