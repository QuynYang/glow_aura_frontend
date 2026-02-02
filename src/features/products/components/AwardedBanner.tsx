export const AwardedBanner = () => {
  return (
    <div className="relative h-full min-h-[400px] bg-black text-white overflow-hidden group">
      {/* Ảnh nền tím */}
      <img 
        src="https://img.freepik.com/free-vector/gradient-burgundy-gold-background_52683-149616.jpg?semt=ais_hybrid&w=740&q=80" 
        alt="Awarded Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
      />
      
      {/* Nội dung */}
      <div className="relative z-10 p-8 flex flex-col justify-center h-full max-w-md">
        <span className="font-bold text-sm tracking-widest mb-2">#AWARDED</span>
        <h3 className="text-2xl font-serif font-bold mb-4">Kem dưỡng da Capture Totale Super Potent Rich Cream</h3>
        <ul className="space-y-2 text-sm text-gray-200 mb-8">
            <li>• Kem dưỡng da chống lão hóa toàn cầu - Dưỡng chất chuyên sâu và phục hồi sức sống</li>
            <li>• Được bào chế với 88% thành phần có nguồn gốc tự nhiên.</li>
        </ul>
      </div>

      {/* Ảnh chai serum góc phải (Trang trí) */}
      <div className="absolute bottom-0 right-0 w-1/2 h-3/4 translate-x-10 translate-y-10">
         <img 
            src="https://s3.eu-north-1.amazonaws.com/cdn-site.mediaplanet.com/app/uploads/sites/151/2022/09/08084638/Philosophy-Cleanser.jpg" 
            alt="Product" 
            className="w-full h-full object-contain drop-shadow-2xl"
         />
      </div>
    </div>
  );
};