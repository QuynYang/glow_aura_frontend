import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wand2, CheckSquare, Tag, ChevronRight, 
  ChevronLeft, X, Sparkles 
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../features/products/components/ProductCard';
import { products } from '../data/mockData'; // Mock data sản phẩm của bạn

type QuizPhase = 'intro' | 'quiz' | 'analyzing' | 'result';

const QUIZ_STEPS = [
  {
    id: '1',
    title: 'Sau khi rửa mặt 30 phút, da bạn cảm thấy như thế nào?',
    options: ['Bóng dầu, đặc biệt ở vùng T', 'Căng, khô, hơi khó chịu', 'Bình thường, thoải mái', 'Vùng T hơi dầu, má thì khô','Hơi đỏ, ngứa nhẹ']
  },
  {
    id: '2',
    title: 'Lỗ chân lông của bạn trông như thế nào?',
    options: ['To, dễ thấy, đặc biệt ở mũi và má', 'Nhỏ, gần như không thấy', 'Vừa phải, cân đối', 'To ở vùng T, nhỏ ở má', 'Nhỏ nhưng hay bị đỏ xung quanh']
  },
  {
    id: '3',
    title: 'Bạn có thường xuyên bị mụn không?',
    options: ['Có, thường xuyên bị mụn đầu đen, mụn ẩn', 'Hiếm khi, nhưng hay bị khô nứt', 'Rất ít, thỉnh thoảng 1-2 nốt', 'Có, chủ yếu ở vùng trán và mũi', 'Có, nhưng kèm theo đỏ, viêm']
  },
  {
    id: '4',
    title: 'Da bạn phản ứng thế nào với các sản phẩm skincare mới?',
    options: ['Bình thường, không có vấn đề gì', 'Đôi khi bị khô hơn', 'Thường bị đỏ, ngứa, châm chích', 'Vùng má hay bị kích ứng hơn vùng T', 'Có thể bị nổi mụn nếu quá dầu']
  },
    {
    id: '5',
    title: 'Đến cuối ngày, da bạn trông như thế nào?',
    options: ['Rất bóng dầu, makeup trôi', 'Căng, có thể bong tróc', 'Gần như buổi sáng, bình thường', 'Vùng T bóng, má vẫn ổn hoặc hơi khô', 'Có thể đỏ hơn, mệt mỏi']
  },
  {
    id: '6',
    title: 'Da bạn phản ứng thế nào với thời tiết thay đổi?',
    options: ['Dầu hơn khi nóng, bình thường khi lạnh', 'Khô hơn, nứt nẻ khi lạnh', 'Không thay đổi nhiều', 'Thay đổi tùy vùng trên mặt', 'Dễ bị đỏ, kích ứng khi thời tiết khắc nghiệt']
  },
  {
    id: '7',
    title: 'Khi soi gương gần, bạn thấy gì?',
    options: ['Lỗ chân lông to, mụn đầu đen', 'Vảy khô, nếp nhăn nhỏ', 'Da mịn, đều màu', 'Khác biệt giữa vùng T và má', 'Mạch máu nhỏ, vùng đỏ']
  },
  {
    id: '8',
    title: 'Bạn cần dùng bao nhiêu kem dưỡng ẩm?',
    options: ['Rất ít hoặc không cần, sợ bóng dầu', 'Nhiều, vẫn cảm thấy thiếu ẩm', 'Lượng vừa phải là đủ', 'Nhiều cho má, ít cho vùng T', 'Cẩn thận chọn loại dịu nhẹ']
  },
  {
    id: '9',
    title: 'Kem chống nắng phù hợp với bạn là?',
    options: ['Dạng gel, không dầu, kiềm dầu', 'Dạng cream, dưỡng ẩm cao', 'Bất kỳ loại nào cũng ổn', 'Kết hợp: nhẹ vùng T, dưỡng ẩm vùng má', 'Mineral/Physical, hypoallergenic']
  },
  {
    id: '10',
    title: 'Vấn đề da bạn lo lắng nhất là gì?',
    options: ['Mụn, bóng dầu, lỗ chân lông to', 'Khô, nếp nhăn, thiếu độ đàn hồi', 'Duy trì làn da khỏe mạnh', 'Cân bằng các vùng da khác nhau', 'Kích ứng, đỏ, dị ứng']
  }
];

export const SkinQuizPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<QuizPhase>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Cuộn lên đầu trang mỗi khi đổi phase hoặc đổi câu hỏi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase, step]);

  const handleSelect = (option: string) => {
    const currentStepData = QUIZ_STEPS[step];
    setAnswers({ ...answers, [currentStepData.id]: option });
    
    // Tự động chuyển câu sau 400ms để mượt mà
    setTimeout(() => {
      if (step < QUIZ_STEPS.length - 1) {
        setStep(step + 1);
      } else {
        startAnalysis();
      }
    }, 400);
  };

  const startAnalysis = () => {
    setPhase('analyzing');
    setTimeout(() => setPhase('result'), 3000); // Giả lập AI 3 giây
  };

  const progress = ((step + 1) / QUIZ_STEPS.length) * 100;

  return (
    <MainLayout>
      <div className="font-sans min-h-screen bg-white">
        
        {/* ========================================== */}
        {/* GIAI ĐOẠN 1: TRANG GIỚI THIỆU (ẢNH 2, 3, 4) */}
        {/* ========================================== */}
        {phase === 'intro' && (
          <div className="animate-in fade-in duration-500">
            
            {/* 1. Hero Banner (Card bo góc) */}
            <div className="container mx-auto px-4 pt-8 md:pt-12">
              <div className="relative w-full h-[450px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-xl">
                {/* Ảnh nền */}
                <img 
                    src="https://cdn.shopify.com/s/files/1/0410/9608/5665/t/3/assets/pf-cee320f0--Blog-Creative-1.jpg?v=1603789844" 
                    alt="Skincare Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Lớp phủ Gradient đen/đỏ mận sang trong suốt */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#3D021E]/95 via-[#3D021E]/70 to-transparent"></div>
                
                {/* Nội dung Banner */}
                <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center max-w-2xl">
                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest w-fit mb-6 border border-white/20">
                        Cá nhân hóa bởi AI
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
                        Khám phá nhu cầu <br/> thực sự của làn da bạn
                    </h1>
                    <p className="text-gray-200 text-sm md:text-base mb-10 max-w-md leading-relaxed">
                        Công nghệ phân tích da bằng AI tiên tiến mang lại giải pháp cá nhân hóa hoàn hảo cho vẻ đẹp rạng rỡ của bạn từ bên trong.
                    </p>
                    <button 
                        onClick={() => setPhase('quiz')}
                        className="bg-white text-[#3D021E] font-bold px-8 py-4 rounded-full text-sm hover:bg-gray-100 transition-colors w-fit shadow-lg flex items-center gap-2"
                    >
                        Bắt đầu phân tích
                    </button>
                </div>
              </div>
            </div>

            {/* 2. Lợi ích độc quyền */}
            <div className="container mx-auto px-4 py-20 text-center">
              <h2 className="text-2xl font-serif font-bold text-[#3D021E] mb-12">
                  Lợi ích độc quyền
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {[
                      { icon: Wand2, title: 'Phân tích da tức thì', desc: 'Nhận kết quả đánh giá tình trạng da chính xác chỉ sau vài giây phân tích AI.' },
                      { icon: CheckSquare, title: 'Lộ trình 4 bước cá nhân', desc: 'Quy trình chăm sóc chuyên biệt được thiết kế riêng cho từng vấn đề của bạn.' },
                      { icon: Tag, title: 'Ưu đãi đặc quyền', desc: 'Giảm ngay 5% cho tất cả các sản phẩm được đề xuất trong lộ trình cá nhân.' },
                  ].map((item, idx) => (
                      <div key={idx} className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-50 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                          <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 text-[#3D021E]">
                              <item.icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-bold text-gray-900 mb-3 text-lg">{item.title}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed px-4">{item.desc}</p>
                      </div>
                  ))}
              </div>
            </div>

            {/* 3. Quy trình thực hiện */}
            <div className="w-full bg-pink-50 py-20 px-4 text-center border-y border-gray-100">
              <h2 className="text-2xl font-serif font-bold text-[#3D021E] mb-2">Quy trình thực hiện</h2>
              <p className="text-sm text-gray-600 mb-16">Đơn giản, khoa học và hoàn toàn miễn phí</p>

              <div className="max-w-4xl mx-auto relative">
                  {/* Đường kẻ ngang */}
                  <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-[2px] bg-[#3D021E] z-0"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                      {[
                          { step: 1, title: 'Làm khảo sát', desc: 'Trả lời các câu hỏi nhanh về thói quen và cảm nhận làn da.' },
                          { step: 2, title: 'Phân tích AI', desc: 'Hệ thống AI đối chiếu dữ liệu với hàng nghìn tình trạng da tương đồng.' },
                          { step: 3, title: 'Nhận phác đồ', desc: 'Sở hữu lộ trình dưỡng da chuyên biệt cùng bộ sản phẩm phù hợp nhất.' },
                      ].map((item) => (
                          <div key={item.step} className="flex flex-col items-center bg-pink-50">
                              <div className="w-14 h-14 rounded-full bg-[#3D021E] text-white flex items-center justify-center font-bold text-xl mb-6 shadow-md ring-8 ring-[#FAFAFA]">
                                  {item.step}
                              </div>
                              <h3 className="font-bold text-gray-900 mb-3 text-lg">{item.title}</h3>
                              <p className="text-sm text-gray-500 leading-relaxed px-6">{item.desc}</p>
                          </div>
                      ))}
                  </div>
              </div>
            </div>

            {/* 4. Sẵn sàng để tỏa sáng (CTA) */}
            <div className="container mx-auto px-4 py-20">
              <div className="bg-[#3D021E] rounded-[2rem] p-16 md:p-20 text-center text-white shadow-2xl max-w-5xl mx-auto relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Sẵn sàng nhận bài kiểm tra?</h2>
                    <p className="text-gray-300 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
                        Tham gia ngay bài Test AI và nhận lộ trình thay đổi làn da của bạn chỉ trong 4 tuần.
                    </p>
                    <button 
                        onClick={() => setPhase('quiz')}
                        className="bg-white text-[#3D021E] font-bold px-10 py-4 rounded-full text-sm hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2 mx-auto"
                    >
                        Bắt đầu phân tích AI ngay <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* GIAI ĐOẠN 2: LÀM TRẮC NGHIỆM (ẢNH 5) */}
        {/* ========================================== */}
        {phase === 'quiz' && (
          <div className="min-h-[80vh] bg-gray-50/50 flex items-center justify-center p-4 py-12 animate-in slide-in-from-right duration-500">
             <div className="bg-white w-full max-w-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                
                {/* Header Navbar của khung Quiz */}
                <div className="flex items-center justify-between px-6 py-5">
                    <button 
                        onClick={() => step > 0 ? setStep(step - 1) : setPhase('intro')} 
                        className="text-gray-400 hover:text-[#3D021E] transition-colors p-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-xs tracking-widest uppercase text-[#3D021E]">
                        BƯỚC {step + 1} / {QUIZ_STEPS.length}
                    </span>
                    <button onClick={() => setPhase('intro')} className="text-gray-400 hover:text-[#3D021E] transition-colors p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar (Đường kẻ đỏ) */}
                <div className="w-full h-1 bg-gray-100">
                    <div className="h-full bg-[#3D021E] transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Nội dung câu hỏi */}
                <div className="px-8 py-16 md:px-16 md:py-20">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-12 text-center">
                        {QUIZ_STEPS[step].title}
                    </h2>
                    
                    <div className="space-y-4 max-w-md mx-auto">
                        {QUIZ_STEPS[step].options.map((option) => {
                            const isSelected = answers[QUIZ_STEPS[step].id] === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className={`w-full p-5 rounded-xl border-[1.5px] text-left font-medium transition-all duration-300 flex justify-between items-center group
                                        ${isSelected 
                                            ? 'border-[#3D021E] bg-[#3D021E]/5 text-[#3D021E]' 
                                            : 'border-gray-200 text-gray-600 hover:border-[#3D021E]'
                                        }
                                    `}
                                >
                                    <span className="text-base">{option}</span>
                                    {/* Icon tròn giả lập Radio Button */}
                                    <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors
                                        ${isSelected ? 'border-[#3D021E]' : 'border-gray-300 group-hover:border-[#3D021E]'}
                                    `}>
                                        {isSelected && <div className="w-2.5 h-2.5 bg-[#3D021E] rounded-full animate-in zoom-in duration-200"></div>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* ========================================== */}
        {/* GIAI ĐOẠN 3 & 4: ĐANG PHÂN TÍCH & KẾT QUẢ */}
        {/* ========================================== */}
        {phase === 'analyzing' && (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white p-4">
                <div className="relative w-32 h-32 mb-10">
                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#3D021E] rounded-full border-t-transparent animate-spin"></div>
                    <Sparkles className="w-10 h-10 text-[#3D021E] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">Đang phân tích làn da...</h3>
                <p className="text-gray-500 text-lg">Hệ thống đang thiết kế phác đồ hoàn hảo nhất dành riêng cho bạn.</p>
            </div>
        )}

        {phase === 'result' && (
             <div className="container mx-auto px-4 py-20 animate-in slide-in-from-bottom duration-700">
                <div className="text-center mb-16">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckSquare className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Phân tích hoàn tất!</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Dựa trên bài test, chúng tôi đã tạo ra một lộ trình chăm sóc da gồm 4 bước chuyên biệt dành riêng cho da <b className="text-[#3D021E]">{answers.skinType?.toLowerCase()}</b> của bạn.
                    </p>
                </div>

                {/* Kết quả đề xuất sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="bg-[#3D021E] text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-[#5a032d] transition-colors">
                        Thêm trọn bộ vào giỏ hàng
                    </button>
                    <button onClick={() => setPhase('intro')} className="bg-white border border-gray-200 text-gray-700 px-10 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">
                        Làm lại bài khảo sát
                    </button>
                </div>
             </div>
        )}

      </div>
    </MainLayout>
  );
};