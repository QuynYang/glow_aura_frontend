import { Crown, Sparkles, TrendingUp } from 'lucide-react';

// 1. Định nghĩa các mốc điểm
const TIERS = {
  NONE: { min: 0, label: 'Thành viên mới', next: 100 },
  BRONZE: { min: 100, label: 'Hạng Đồng', next: 500 },
  SILVER: { min: 500, label: 'Hạng Bạc', next: 1000 },
  GOLD: { min: 1000, label: 'Hạng Vàng', next: 3000 },
  PLATINUM: { min: 3000, label: 'Hạng Bạch Kim', next: null }, // Max level
};

// 2. Cấu hình giao diện cho từng hạng (Màu sắc, Gradient)
const TIER_STYLES: Record<string, any> = {
  NONE: {
    bg: "bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-200",
    text: "text-gray-600",
    title: "text-gray-800",
    barBg: "bg-gray-200",
    barFill: "bg-gray-500",
    iconColor: "text-gray-400",
    glow: "",
  },
  BRONZE: {
    bg: "bg-gradient-to-br from-[#5D4037] to-[#8D6E63]", // Nâu đất sang nâu sáng
    text: "text-[#D7CCC8]", // Màu be nhạt
    title: "text-[#FFAB91]", // Cam đồng
    barBg: "bg-[#4E342E]",
    barFill: "bg-gradient-to-r from-[#FF7043] to-[#FFAB91]",
    iconColor: "text-[#FF8A65]",
    glow: "shadow-[0_4px_20px_rgba(141,110,99,0.4)]",
  },
  SILVER: {
    bg: "bg-gradient-to-br from-[#455A64] to-[#78909C]", // Xám xanh kim loại
    text: "text-[#ECEFF1]",
    title: "text-[#B0BEC5]", // Bạc sáng
    barBg: "bg-[#263238]",
    barFill: "bg-gradient-to-r from-[#CFD8DC] to-[#FFFFFF]",
    iconColor: "text-[#CFD8DC]",
    glow: "shadow-[0_4px_20px_rgba(120,144,156,0.4)]",
  },
  GOLD: {
    bg: "bg-[#330511]", // Màu đỏ rượu gốc của bạn
    text: "text-white",
    title: "text-accent", // Màu vàng gold
    barBg: "bg-gray-700",
    barFill: "bg-accent",
    iconColor: "text-accent",
    glow: "shadow-[0_4px_20px_rgba(164,28,78,0.4)]",
  },
  PLATINUM: {
    bg: "bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#333333]", // Đen huyền bí
    text: "text-gray-300",
    title: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400", // Chữ màu Hologram
    barBg: "bg-gray-800",
    barFill: "bg-gradient-to-r from-cyan-400 to-purple-500",
    iconColor: "text-cyan-300",
    glow: "shadow-[0_4px_20px_rgba(0,255,255,0.2)]",
  },
};

interface MemberCardProps {
  currentPoints: number;
}

export const MemberCard = ({ currentPoints }: MemberCardProps) => {
  // 3. Logic xác định hạng hiện tại
  const getCurrentTier = (points: number) => {
    if (points >= TIERS.PLATINUM.min) return 'PLATINUM';
    if (points >= TIERS.GOLD.min) return 'GOLD';
    if (points >= TIERS.SILVER.min) return 'SILVER';
    if (points >= TIERS.BRONZE.min) return 'BRONZE';
    return 'NONE';
  };

  const tierKey = getCurrentTier(currentPoints);
  const tierInfo = TIERS[tierKey as keyof typeof TIERS];
  const styles = TIER_STYLES[tierKey];

  // 4. Tính toán Progress Bar
  let progressPercent = 100;
  let nextPointsNeeded = 0;
  
  if (tierInfo.next) {
    const range = tierInfo.next - tierInfo.min;
    const currentInRange = currentPoints - tierInfo.min;
    progressPercent = Math.min(100, Math.max(0, (currentInRange / range) * 100));
    nextPointsNeeded = tierInfo.next - currentPoints;
  }

  return (
    <div className={`relative rounded-xl p-6 overflow-hidden transition-all duration-300 ${styles.bg} ${styles.glow} ${tierKey === 'NONE' ? '' : 'text-white'}`}>
      
      {/* Hiệu ứng nền trang trí */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl"></div>

      {/* Header Card */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
            <div>
                <p className={`text-[10px] uppercase tracking-widest mb-1 ${styles.text} opacity-80`}>Hạng thành viên</p>
                <h3 className={`text-2xl font-serif font-bold ${styles.title} flex items-center gap-2`}>
                   {tierKey === 'PLATINUM' && <Sparkles className="w-5 h-5 animate-pulse" />}
                   {tierKey === 'GOLD' && <Crown className="w-5 h-5" />}
                   {tierInfo.label}
                </h3>
            </div>
            <div className={`p-2 rounded-full bg-white/10 backdrop-blur-sm ${styles.iconColor}`}>
               <Crown className="w-6 h-6" />
            </div>
        </div>

        {/* Điểm số */}
        <div className={`flex justify-between items-end text-xs mb-3 ${styles.text}`}>
             <div className="flex flex-col">
                <span className="opacity-70">Điểm tích lũy</span>
                <span className="text-xl font-bold font-sans">{currentPoints.toLocaleString()} pts</span>
             </div>
             {tierKey !== 'PLATINUM' && (
                 <div className="text-right">
                    <span className="opacity-70">Cần thêm</span>
                    <div className="font-bold flex items-center gap-1 justify-end">
                         <TrendingUp className="w-3 h-3" /> {nextPointsNeeded.toLocaleString()} pts
                    </div>
                 </div>
             )}
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-2 rounded-full mb-2 ${styles.barBg}`}>
            <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${styles.barFill}`} 
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>

        {/* Thông báo footer */}
        <p className={`text-[10px] text-center italic opacity-70 ${styles.text}`}>
            {tierKey === 'PLATINUM' 
                ? 'Bạn đã đạt cấp độ cao nhất. Tận hưởng đặc quyền VIP!' 
                : 'Tích điểm để nâng hạng và nhận thêm ưu đãi'}
        </p>
      </div>
    </div>
  );
};