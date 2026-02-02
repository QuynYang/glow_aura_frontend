export const ExpertBanner = () => {
  return (
    <div className="bg-primary text-white h-full p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group">
      {/* Hiệu ứng nền nhẹ (Optional) */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10 space-y-6">
        <h3 className="text-2xl font-serif font-bold">1-2-1 expert advice</h3>
        <p className="text-sm leading-relaxed text-gray-200">
           Take Some Time To Feel Uplifted With A Complimentary, Bespoke Beauty Service. Our Team Of Experts Are Here To Help In Person.
        </p>
        <img 
            src="https://grazia.wwmindia.com/content/2023/nov/pashamalwanigraziabeauty21700124294.jpg" 
            alt="Expert" 
            className="w-full h-48 object-cover object-top opacity-90 rounded-sm mt-4 grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
    </div>
  );
};