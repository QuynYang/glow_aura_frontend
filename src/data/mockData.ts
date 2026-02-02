export const products = [
  {
    id: 1,
    name: "Beautya La Mousse Off/On Foaming Cleaner",
    price: 65.00,
    description: "Sữa rửa mặt tạo bọt chống ô nhiễm chiết xuất hoa súng Pháp",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600",
    tag: "Mới"
  },
  {
    id: 2,
    name: "Beautya Prestige La Mousse Micellaire",
    price: 520.00,
    description: "Tinh chất chống lão hóa cao cấp, thanh lọc da",
    image: "https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2023/05/sua-rua-mat-ket-hop-tay-trang-dior-prestige-la-mousse-micellaire-nettoyant-120g-646acb5b0aa85-22052023085435.jpg",
  },
  // Lưu ý: Vị trí số 3 sẽ là Banner Expert
  {
    id: 3,
    name: "Beautya Prestige La Mousse Micellaire",
    price: 520.00,
    description: "Tinh chất chống lão hóa da mặt, phục hồi chuyên sâu",
    image: "https://media3.scdn.vn/img4/2021/04_08/5l6E91nWxzfhnAzGcZNz_simg_de2fe0_500x500_maxb.jpg",
  },
  {
    id: 4,
    name: "Dior Snow Essence of Light",
    price: 520.00,
    description: "Tinh chất sữa dưỡng sáng da, mờ thâm nám",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600",
  },
  {
    id: 5,
    name: "Le Serum Anti-Aging",
    price: 520.00,
    description: "Serum chống lão hóa toàn diện",
    image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=600",
  }
];

export const filters = {
  categories: [
    "Sữa rửa mặt", 
    "Tẩy tế bào chết", 
    "Nước cân bằng (Toner)", 
    "Retinol", 
    "Mặt nạ & Peel da", 
    "Kem dưỡng ẩm", 
    "Kem dưỡng ban đêm", 
    "Dầu dưỡng da", 
    "Kem chống nắng", 
    "Chăm sóc mắt"
  ],
  // Giữ nguyên USD nếu hệ thống tính tiền của bạn đang dùng USD.
  // Nếu muốn đổi sang VND, bạn cần đổi cả logic tính toán trong code.
  prices: ["$50.00 - $150.00", "$150.00 - $250.00", "$250.00 - $350.00", "$350.00 - $450.00", "$450.00 - $550.00"]
};


// Detail product
export const singleProduct = {
  id: 1,
  brand: "Beautya Prestige",
  name: "LA MICRO-HUILE DE ROSE ADVANCED SERUM",
  subtitle: "Tinh chất chống lão hóa da mặt",
  tags: ["Mọi loại da", "Sáng & Tối", "Làm sáng da"],
  description: "Công thức đặc biệt với 92% thành phần có nguồn gốc tự nhiên, an toàn và lành tính.",
  price: 520.00,
  sizes: ["30 ML", "50 ML", "75 ML"],
  images: [
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800", // Main
    "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800", // Thumb 1
    "https://www.faces.eg/dw/image/v2/BJSM_PRD/on/demandware.static/-/Sites-faces-master-catalog/default/dwef43da2b/product/3348901552905_3/3348901552905_3.jpg?sw=800&sh=800", // Thumb 2
    "https://cdn.vuahanghieu.com/unsafe/0x0/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/news/content/2021/01/sua-rua-matui-jpg-1611645507-26012021141827.jpg", // Thumb 3
  ],
  reviews: 142,
  rating: 4.8
};

// Reviews - Đã thay tên người dùng và nội dung bình luận sang tiếng Việt cho tự nhiên
export const reviews = [
  {
    id: 1,
    user: "Nguyễn Thùy Linh",
    rating: 5,
    date: "2 ngày trước",
    content: "Sản phẩm dùng cực thích, thấm nhanh và mùi hương rất dễ chịu. Da mình cải thiện rõ rệt sau 1 tuần sử dụng.",
    likes: 12,
    dislikes: 0
  },
  {
    id: 2,
    user: "Trần Minh Tâm",
    rating: 4,
    date: "1 tuần trước",
    content: "Chất lượng tốt, đóng gói sang trọng. Tuy nhiên giá hơi cao so với dung tích, nhưng đắt xắt ra miếng.",
    likes: 5,
    dislikes: 1
  },
  {
    id: 3,
    user: "Phạm Ngọc Anh",
    rating: 5,
    date: "2 tuần trước",
    content: "Giao hàng nhanh, tư vấn nhiệt tình. Mình đã mua chai thứ 2 rồi, rất đáng tiền nhé mọi người.",
    likes: 8,
    dislikes: 0
  }
];