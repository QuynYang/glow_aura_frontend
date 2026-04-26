import { ProductCard } from '../../products/components/ProductCard';
import { VirtualAnalysisCard } from './VirtualAnalysisCard';
import { SectionHeading } from '../../../components/ui/SectionHeading';

interface NewArrivalsProps {
  products: any[];
}

export const NewArrivals = ({ products }: NewArrivalsProps) => {
  return (
    <section className="container mx-auto px-4 py-16">
      {/* Tiêu đề Section */}
      <SectionHeading title="Hàng mới về" />
      
      {/* Grid 3 cột: 2 Sản phẩm + 1 Thẻ Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Render tối đa 2 sản phẩm được truyền vào */}
        {products.slice(0, 2).map((product) => (
           <div key={product.id} className="h-full">
              <ProductCard product={product} />
           </div>
        ))}

        {/* Cột 3: Thẻ Analysis */}
        <div className="h-full">
            <VirtualAnalysisCard />
        </div>

      </div>
    </section>
  );
};