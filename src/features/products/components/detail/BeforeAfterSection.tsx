export const BeforeAfterSection = () => {
  return (
    <section className="bg-[#4A0424] text-white py-16"> {/* Màu đỏ rượu đậm */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Ảnh 1 */}
            <div className="aspect-square bg-gray-300 relative group overflow-hidden">
                 <img src="https://img.freepik.com/free-photo/portrait-young-woman-with-natural-make-up_23-2149084942.jpg" className="w-full h-full object-cover" />
                 <span className="absolute bottom-4 left-4 text-xs font-bold uppercase">Trước</span>
            </div>
             {/* Ảnh 2 */}
            <div className="aspect-square bg-gray-300 relative group overflow-hidden">
                 <img src="https://img.freepik.com/free-photo/portrait-young-woman-with-natural-make-up_23-2149084939.jpg" className="w-full h-full object-cover" />
                 <span className="absolute bottom-4 left-4 text-xs font-bold uppercase">Sau 1 tuần</span>
            </div>
             {/* Ảnh 3 */}
            <div className="aspect-square bg-gray-300 relative group overflow-hidden">
                 <img src="https://img.freepik.com/free-photo/close-up-portrait-beautiful-young-woman_176420-1361.jpg" className="w-full h-full object-cover" />
                 <span className="absolute bottom-4 left-4 text-xs font-bold uppercase">Sau 1 tháng</span>
            </div>
            
             {/* Text Info */}
            <div className="flex flex-col justify-center px-4">
                <p className="text-lg font-bold mb-2">Chỉ trong 1 tuần:</p>
                <p className="text-sm text-gray-300 mb-4">Da trông săn chắc, khỏe mạnh và mịn màng hơn</p>
                
                <p className="text-lg font-bold mb-2">Chỉ trong 3 tuần:</p>
                <p className="text-sm text-gray-300 mb-4">Cải thiện gấp 2 lần về vẻ ngoài và cảm giác độ đàn hồi của da</p>
            </div>
        </div>
      </div>
    </section>
  );
};