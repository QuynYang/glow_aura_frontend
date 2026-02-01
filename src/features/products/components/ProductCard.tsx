// Interface tạm thời (Sau này sẽ lấy từ folder types chung)
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  tag?: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group relative">
      {/* 1. Ảnh sản phẩm */}
      <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-4">
        {product.tag && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] uppercase font-bold px-2 py-1 z-10">
            {product.tag}
          </span>
        )}
        
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Nút Add to Cart trượt lên */}
        <button className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-medium text-sm hover:bg-accent">
          ADD TO CART
        </button>
      </div>

      {/* 2. Thông tin */}
      <div className="text-center space-y-1">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.brand}</h3>
        <h2 className="text-base font-medium text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h2>
        <p className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};