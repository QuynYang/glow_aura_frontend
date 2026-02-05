const categories = [
  { id: 1, title: "Đồ trang điểm", image: "https://images2.thanhnien.vn/thumb_w/640/528068263637045248/2023/8/16/snapinstaapp3336509811900460769868192880823254101155453n1080-16921721867051793767174.jpg" },
  { id: 2, title: "Sản phẩm dưỡng da", image: "https://hips.hearstapps.com/hmg-prod/images/korean-skincare-explained-1574778012.jpg?crop=0.661xw:1.00xh;0.103xw,0&resize=1200:*" },
  { id: 3, title: "Quà tặng & Sets", image: "https://media.self.com/photos/635fbc03e9291730a33a4b42/3:4/w_748%2Cc_limit/necessaire%2520set.jpeg" },
];

export const CategoryGrid = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="group cursor-pointer relative overflow-hidden h-[400px]">
             {/* Ảnh */}
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Nền đen mờ khi hover */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            
            {/* Chữ */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <h3 className="text-white text-xl font-serif tracking-wide mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {cat.title}
              </h3>
              <span className="text-white text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 border-b border-white pb-1">
                Xem thêm
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};