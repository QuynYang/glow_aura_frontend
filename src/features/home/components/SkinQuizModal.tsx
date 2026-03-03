import { useState, useEffect } from 'react';
import { X, ChevronLeft, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ProductCard } from '../../products/components/ProductCard';
import { products } from '../../../data/mockData';

interface SkinQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUIZ_STEPS = [
  {
    id: 'gender',
    title: 'Giới tính của bạn là gì?',
    options: ['Nữ', 'Nam', 'Không muốn tiết lộ']
  },
  {
    id: 'age',
    title: 'Bạn đang ở độ tuổi nào?',
    options: ['Dưới 20', '20 - 29', '30 - 39', '40 - 49', 'Trên 50']
  },
  {
    id: 'skinType',
    title: 'Bạn thuộc loại da nào?',
    options: ['Da khô', 'Da dầu', 'Da hỗn hợp', 'Da thường', 'Da nhạy cảm'],
    desc: 'Lưu ý: Da hỗn hợp thường đổ dầu vùng chữ T và khô ở 2 bên má.'
  },
  {
    id: 'concern',
    title: 'Vấn đề da bạn quan tâm nhất hiện nay?',
    options: ['Mụn & Thâm mụn', 'Lão hóa & Nếp nhăn', 'Sạm nám & Không đều màu', 'Lỗ chân lông to', 'Thiếu ẩm & Bong tróc']
  }
];

export const SkinQuizModal = ({ isOpen, onClose }: SkinQuizModalProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setAnswers({});
      setIsAnalyzing(false);
      setShowResult(false);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (option: string) => {
    const currentStepData = QUIZ_STEPS[step];
    setAnswers({ ...answers, [currentStepData.id]: option });
    
    // Auto next after selection for smooth UX
    setTimeout(() => {
      if (step < QUIZ_STEPS.length - 1) {
        setStep(step + 1);
      } else {
        handleAnalyze();
      }
    }, 400);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Giả lập thời gian AI phân tích (3 giây)
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 3000);
  };

  const currentStepData = QUIZ_STEPS[step];
  const progress = ((step + 1) / QUIZ_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl h-[100dvh] md:h-auto md:min-h-[600px] md:max-h-[90vh] md:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden flex-shrink-0">
        
        {/* Header (Chỉ hiện khi đang làm Quiz, ẩn ở màn kết quả) */}
        {!showResult && !isAnalyzing && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <button 
              onClick={() => step > 0 ? setStep(step - 1) : onClose()} 
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-bold text-sm tracking-widest uppercase text-primary">
              Bước {step + 1} / {QUIZ_STEPS.length}
            </span>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Nút tắt cho màn Hình Phân tích & Kết quả */}
        {(showResult || isAnalyzing) && (
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 z-10 bg-white rounded-full shadow-sm">
              <X className="w-6 h-6" />
            </button>
        )}

        {/* Progress Bar */}
        {!showResult && !isAnalyzing && (
          <div className="w-full h-1 bg-gray-100">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col justify-center">
          
          {/* TRẠNG THÁI 1: CÂU HỎI TRẮC NGHIỆM */}
          {!isAnalyzing && !showResult && (
            <div className="max-w-xl mx-auto w-full animate-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2 text-center">
                {currentStepData.title}
              </h2>
              {currentStepData.desc && (
                <p className="text-gray-500 text-sm text-center mb-8">{currentStepData.desc}</p>
              )}
              
              <div className="space-y-4 mt-8">
                {currentStepData.options.map((option) => {
                  const isSelected = answers[currentStepData.id] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`w-full p-5 rounded-xl border-2 text-left font-medium transition-all duration-300 flex justify-between items-center group
                        ${isSelected 
                          ? 'border-primary bg-pink-50 text-primary' 
                          : 'border-gray-200 text-gray-700 hover:border-primary hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className="text-base">{option}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                          ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 group-hover:border-primary'}
                      `}>
                         {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TRẠNG THÁI 2: ĐANG PHÂN TÍCH */}
          {isAnalyzing && (
            <div className="text-center animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center h-full">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <Sparkles className="w-10 h-10 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Đang phân tích làn da...</h3>
              <p className="text-gray-500">AI của chúng tôi đang tạo phác đồ phù hợp nhất dựa trên câu trả lời của bạn.</p>
            </div>
          )}

          {/* TRẠNG THÁI 3: KẾT QUẢ & ĐỀ XUẤT */}
          {showResult && (
            <div className="animate-in slide-in-from-bottom-8 duration-700 h-full flex flex-col">
              <div className="text-center mb-10">
                 <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">Hoàn tất phân tích</span>
                 <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                    Phác đồ dành riêng cho bạn
                 </h2>
                 <p className="text-gray-600 max-w-lg mx-auto">
                    Dựa trên độ tuổi, làn da <b>{answers.skinType?.toLowerCase()}</b> và mong muốn cải thiện <b>{answers.concern?.toLowerCase()}</b>, đây là lộ trình tối ưu nhất từ chuyên gia Glow Aura.
                 </p>
              </div>

              {/* Danh sách sản phẩm đề xuất (Lấy 3 sản phẩm đầu tiên từ mockData) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                 {products.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                 ))}
              </div>

              <div className="mt-10 flex justify-center gap-4">
                 <Button onClick={onClose} className="px-10 py-3">Thêm tất cả vào giỏ</Button>
                 <Button variant="outline" onClick={() => setStep(0)} className="px-8 py-3">Làm lại bài test</Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};