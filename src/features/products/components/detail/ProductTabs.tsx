import { useState } from 'react';

const tabs = ["Product Details", "How To Apply", "Ingredient", "What Makes It Advance"];

export const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="my-12">
      {/* Tab Header */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 
              ${activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content (Mock text) */}
      <div className="py-8 text-gray-600 leading-relaxed text-sm space-y-4 max-w-4xl">
        <p>
            Beautya's 1st Revitalizing Serum That Concentrates The Double Power Of The Rose De Granville From The Stem To The Flower To Revitalize The Skin Twice As Fast And Visibly Rejuvenate.
        </p>
        <p>
            Created After 20 Years Of Research, The 10,000 Micro-Pearls Rich In Revitalizing Rose Micro-Nutrients Are Now Completed By The Power Of The Rose Sap.
        </p>
        <button className="text-primary font-bold text-xs uppercase mt-4 flex items-center">
            Read Less <span className="ml-1">‹</span>
        </button>
      </div>
    </div>
  );
};