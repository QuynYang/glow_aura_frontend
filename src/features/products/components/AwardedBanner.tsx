export const AwardedBanner = () => {
  return (
    <div className="relative h-full min-h-[400px] bg-black text-white overflow-hidden group">
      {/* Ảnh nền tím */}
      <img 
        src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800" 
        alt="Awarded Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
      />
      
      {/* Nội dung */}
      <div className="relative z-10 p-8 flex flex-col justify-center h-full max-w-md">
        <span className="font-bold text-sm tracking-widest mb-2">#AWARDED</span>
        <h3 className="text-2xl font-serif font-bold mb-4">Capture Totale Super Potent Rich Cream</h3>
        <ul className="space-y-2 text-sm text-gray-200 mb-8">
            <li>• Global Age-Defying Rich Cream - Intense Nourishment & Revitalisation</li>
            <li>• Formulated With 88% Natural-Origin Ingredients</li>
        </ul>
      </div>

      {/* Ảnh chai serum góc phải (Trang trí) */}
      <div className="absolute bottom-0 right-0 w-1/2 h-3/4 translate-x-10 translate-y-10">
         <img 
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400" 
            alt="Product" 
            className="w-full h-full object-contain drop-shadow-2xl"
         />
      </div>
    </div>
  );
};