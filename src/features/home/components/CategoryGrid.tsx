const categories = [
  { id: 1, title: "Women Make Up", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800" },
  { id: 2, title: "Women Skincare", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800" },
  { id: 3, title: "Gifts & Sets", image: "https://images.unsplash.com/photo-1612817288484-969160d0d419?q=80&w=800" },
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
                Shop Now
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};