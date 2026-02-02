import { Star, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { reviews } from '../../../../data/mockData';

export const ProductReviews = () => {
  return (
    <section className="container mx-auto px-4 py-16 border-t border-gray-100">
      
      {/* 1. Header: Điểm số & Nút bấm */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex items-center gap-6">
            <span className="text-6xl font-serif font-medium">4.8</span>
            <div className="space-y-1">
                <div className="flex text-primary">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-sm text-gray-500">Dựa trên 142 đánh giá</p>
            </div>
        </div>

        <div className="flex gap-4">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 uppercase text-xs font-bold rounded-sm">
                Viết đánh giá
            </Button>
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-3 uppercase text-xs font-bold rounded-sm">
                Đặt câu hỏi
            </Button>
        </div>
      </div>

      {/* 2. Filter Tags (Giả lập) */}
      <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-gray-100">
         {["Quality", "Value", "Effectiveness", "Packaging", "Scent"].map(tag => (
             <button key={tag} className="px-4 py-1 bg-gray-100 text-gray-600 text-xs hover:bg-gray-200 transition-colors">
                {tag}
             </button>
         ))}
      </div>

      {/* 3. Review List */}
      <div className="space-y-8">
        {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-500" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-sm">{review.user}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                     <div className="flex text-primary">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-current" />
                                        ))}
                                     </div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {review.content}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                             <span className="font-medium text-gray-900">Đánh giá này có hữu ích không?</span>
                             <button className="flex items-center gap-1 hover:text-primary">
                                <ThumbsUp className="w-3 h-3" /> {review.likes}
                             </button>
                             <button className="flex items-center gap-1 hover:text-primary">
                                <ThumbsDown className="w-3 h-3" /> {review.dislikes}
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="text-center mt-8">
         <button className="text-primary text-xs font-bold uppercase hover:underline">Đọc thêm đánh giá</button>
      </div>
    </section>
  );
};