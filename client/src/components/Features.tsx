import React from 'react';
import { Check, Lightbulb, ClipboardList, PieChart, AlertCircle } from 'lucide-react';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}> = ({ icon, title, description, benefits }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:translate-y-[-5px] hover:shadow-[0_25px_30px_-12px_rgba(0,0,0,0.1)]">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-aeonik font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-slate-700">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <section className="py-6 md:py-10 lg:py-[3.75rem] bg-[#FFFFFF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-[1240px] w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center">
            {/* Left side image */}
            <div className="relative w-full mx-auto md:mr-auto mb-6 md:mb-0">
              {/* Main image */}
              <img 
                src="/GPT.png"
                alt="AI Chat Interface"
                className="rounded-3xl w-full max-w-[600px]"
              />
            </div>

            {/* Right side content */}
            <div>
              <h2 className="text-[2rem] sm:text-[2rem] md:text-[32px] lg:text-[3.25rem] font-aeonik font-medium leading-[1.2] sm:leading-[1.3] md:leading-[1.2] lg:leading-[3.75rem] mb-2 sm:mb-6 text-[#232323]">
                All top AIs in one place
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-aeonik">
                Each model has its strength — we pick the right one for your question, so you don't waste time or money switching between them
              </p>
              <button className="hidden md:block px-[3.75rem] py-[1.125rem] bg-[#232323] text-white rounded-full text-lg font-aeonik font-medium">
                Get Started
              </button>
            </div>
            
            {/* Mobile Get Started button */}
            <div className="block md:hidden">
              <button className="w-full px-[3.75rem] py-[1.125rem] bg-[#232323] text-white rounded-full text-lg font-aeonik font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
