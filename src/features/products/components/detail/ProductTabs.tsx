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
            Tinh chất phục hồi đầu tiên của Beautya, cô đọng sức mạnh gấp đôi của hoa hồng De Granville từ thân đến hoa, giúp phục hồi làn da nhanh gấp đôi và trẻ hóa rõ rệt.
        </p>
        <p>
            Được tạo ra sau 20 năm nghiên cứu, 10.000 hạt vi ngọc giàu dưỡng chất hoa hồng giúp phục hồi sức sống nay được hoàn thiện nhờ sức mạnh của nhựa hoa hồng.
        </p>
        <button className="text-primary font-bold text-xs uppercase mt-4 flex items-center">
            Đọc ít hơn <span className="ml-1">‹</span>
        </button>
      </div>
    </div>
  );
};