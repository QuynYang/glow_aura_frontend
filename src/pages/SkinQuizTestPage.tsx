import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Sparkles, AlertCircle, Droplet, 
  Smile, Info, ArrowRight, Wand2, CheckSquare, Tag
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';

type TestStatus = 'answering' | 'analyzing';

const QUIZ_STEPS = [
  { id: '1', title: 'Sau khi rửa mặt 30 phút, da bạn cảm thấy như thế nào?', options: ['Bóng dầu, đặc biệt ở vùng T', 'Căng, khô, hơi khó chịu', 'Bình thường, thoải mái', 'Vùng T hơi dầu, má thì khô','Hơi đỏ, ngứa nhẹ'] },
  { id: '2', title: 'Lỗ chân lông của bạn trông như thế nào?', options: ['To, dễ thấy, đặc biệt ở mũi và má', 'Nhỏ, gần như không thấy', 'Vừa phải, cân đối', 'To ở vùng T, nhỏ ở má', 'Nhỏ nhưng hay bị đỏ xung quanh'] },
  { id: '3', title: 'Bạn có thường xuyên bị mụn không?', options: ['Có, thường xuyên bị mụn đầu đen, mụn ẩn', 'Hiếm khi, nhưng hay bị khô nứt', 'Rất ít, thỉnh thoảng 1-2 nốt', 'Có, chủ yếu ở vùng trán và mũi', 'Có, nhưng kèm theo đỏ, viêm'] },
  { id: '4', title: 'Vấn đề da bạn lo lắng nhất là gì?', options: ['Mụn, bóng dầu, lỗ chân lông to', 'Khô, nếp nhăn, thiếu độ đàn hồi', 'Duy trì làn da khỏe mạnh', 'Cân bằng các vùng da khác nhau', 'Kích ứng, đỏ, dị ứng'] }
];

export const SkinQuizTestPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<TestStatus>('answering');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, status]);

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [QUIZ_STEPS[step].id]: option });
  };

  const handleNext = () => {
    if (!answers[QUIZ_STEPS[step].id]) return alert("Vui lòng chọn một đáp án!");
    if (step < QUIZ_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      startAnalysis();
    }
  };

  const handleBack = () => {
      if (step > 0) setStep(step - 1);
      else navigate('/skin-quiz'); 
  };

  // LOGIC ĐÃ SỬA: Chuyển hướng sang trang kết quả sau khi phân tích
  const startAnalysis = () => {
    setStatus('analyzing');
    setTimeout(() => {
        navigate('/skin-quiz/result'); // Chuyển trang
    }, 3000); 
  };

  const progress = ((step + 1) / QUIZ_STEPS.length) * 100;
  
  const getIconForOption = (index: number) => {
      const icons = [AlertCircle, Droplet, Smile, Info, Sparkles];
      const Icon = icons[index % icons.length];
      return <Icon className="w-5 h-5" />;
  };

  return (
    <MainLayout>
      <div className="font-sans min-h-screen bg-[#FDFBFB]">
        
        {/* TRẠNG THÁI 1: TRẢ LỜI CÂU HỎI */}
        {status === 'answering' && (
          <div className="container mx-auto px-4 py-12 animate-in slide-in-from-right duration-500">
             <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                 
                 {/* CỘT TRÁI */}
                 <div className="w-full lg:w-2/3 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-[#3D021E] text-lg">Tiến trình hoàn thành</span>
                        <span className="text-sm font-bold bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full">
                            {step + 1}/{QUIZ_STEPS.length}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mb-10 overflow-hidden">
                        <div className="h-full bg-[#3D021E] transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2 leading-tight">
                        {QUIZ_STEPS[step].title}
                    </h2>
                    <p className="text-gray-500 text-sm mb-10 italic">
                        Vui lòng chọn trạng thái gần nhất với cảm nhận của bạn
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 mb-10">
                        {QUIZ_STEPS[step].options.map((option, idx) => {
                            const isSelected = answers[QUIZ_STEPS[step].id] === option;
                            const title = option.split(',')[0];
                            const sub = option.split(',').slice(1).join(',');
                            
                            return (
                                <div key={option} onClick={() => handleSelect(option)}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-start gap-4 group
                                        ${isSelected ? 'border-[#3D021E] bg-white shadow-md' : 'border-gray-100 hover:border-[#3D021E]/30 hover:bg-gray-50'}
                                    `}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                                        ${isSelected ? 'bg-[#3D021E] text-white' : 'bg-gray-100 text-gray-800 group-hover:bg-gray-200'}
                                    `}>
                                        {getIconForOption(idx)}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-lg mb-1 ${isSelected ? 'text-[#3D021E]' : 'text-gray-900'}`}>{title}</h4>
                                        {sub && <p className="text-sm text-gray-500">{sub.trim()}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4 mt-auto">
                        <button onClick={handleBack} className="flex-1 py-4 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
                            <ChevronLeft className="w-5 h-5" /> Quay lại
                        </button>
                        <button onClick={handleNext} className="flex-1 py-4 bg-[#3D021E] text-white font-bold rounded-xl hover:bg-[#5a032d] flex items-center justify-center gap-2 shadow-lg">
                            Tiếp theo <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                 </div>

                 {/* CỘT PHẢI */}
                 <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <div className="bg-[#3D021E] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex-1">
                        <div className="relative z-10">
                            <span className="inline-block bg-white/20 backdrop-blur-sm text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6">Glow Aura Premium</span>
                            <h3 className="text-3xl font-serif font-bold mb-8 leading-tight">Tại sao nên làm bài kiểm tra này?</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Wand2 className="w-4 h-4 text-pink-200" /></div><div><h4 className="font-bold">Phân tích AI chính xác</h4><p className="text-sm text-white/70">Dữ liệu từ hàng triệu mẫu da.</p></div></div>
                                <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><CheckSquare className="w-4 h-4 text-pink-200" /></div><div><h4 className="font-bold">Phác đồ cá nhân hóa</h4><p className="text-sm text-white/70">Quy trình chăm sóc 4 bước riêng biệt.</p></div></div>
                                <div className="flex gap-4"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Tag className="w-4 h-4 text-pink-200" /></div><div><h4 className="font-bold">Đặc quyền mua sắm</h4><p className="text-sm text-white/70">Giảm ngay 5% cho đơn hàng đầu tiên.</p></div></div>
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
          </div>
        )}

        {/* TRẠNG THÁI 2: ĐANG PHÂN TÍCH */}
        {status === 'analyzing' && (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
                <div className="relative w-32 h-32 mb-10">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#3D021E] rounded-full border-t-transparent animate-spin"></div>
                    <Sparkles className="w-10 h-10 text-[#3D021E] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">AI Đang phân tích làn da...</h3>
                <p className="text-gray-500 text-lg">Đang tính toán phác đồ tốt nhất dành riêng cho bạn.</p>
            </div>
        )}

      </div>
    </MainLayout>
  );
};