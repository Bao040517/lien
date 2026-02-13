const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const categories = [
    { name: 'Thời trang nam', color: '#E3F2FD', emoji: '👕', file: 'icon_thoi_trang_nam.svg' },
    { name: 'Thời trang nữ', color: '#FCE4EC', emoji: '👗', file: 'icon_thoi_trang_nu.svg' },
    { name: 'Điện thoại & Phụ kiện', color: '#E8EAF6', emoji: '📱', file: 'icon_dien_thoai_phu_kien.svg' },
    { name: 'Máy tính & Laptop', color: '#E0F2F1', emoji: '💻', file: 'icon_may_tinh_laptop.svg' },
    { name: 'Thiết bị điện tử', color: '#ECEFF1', emoji: '📷', file: 'icon_thiet_bi_dien_tu.svg' },
    { name: 'Nhà cửa & Đời sống', color: '#FBE9E7', emoji: '🏠', file: 'icon_nha_cua_doi_song.svg' },
    { name: 'Sức khỏe & Làm đẹp', color: '#F3E5F5', emoji: '💄', file: 'icon_suc_khoe_lam_dep.svg' },
    { name: 'Mẹ & Bé', color: '#FFF3E0', emoji: '👶', file: 'icon_me_va_be.svg' },
    { name: 'Thể thao & Du lịch', color: '#E0F7FA', emoji: '⚽', file: 'icon_the_thao_du_lich.svg' },
    { name: 'Giày dép nam', color: '#EFEBE9', emoji: '👞', file: 'icon_giay_dep_nam.svg' },
    { name: 'Giày dép nữ', color: '#FCE4EC', emoji: '👠', file: 'icon_giay_dep_nu.svg' },
    { name: 'Túi ví nữ', color: '#FFF8E1', emoji: '👜', file: 'icon_tui_vi_nu.svg' },
    { name: 'Phụ kiện & Trang sức', color: '#F3E5F5', emoji: '💍', file: 'icon_phu_kien_trang_suc.svg' },
    { name: 'Đồng hồ', color: '#ECEFF1', emoji: '⌚', file: 'icon_dong_ho.svg' },
    { name: 'Bách hóa online', color: '#F1F8E9', emoji: '🍎', file: 'icon_bach_hoa_online.svg' },
    { name: 'Ô tô & Xe máy', color: '#FAFAFA', emoji: '🚗', file: 'icon_o_to_xe_may.svg' },
    { name: 'Nhà sách online', color: '#FFF3E0', emoji: '📚', file: 'icon_nha_sach_online.svg' },
    { name: 'Thú cưng', color: '#EFEBE9', emoji: '🐶', file: 'icon_thu_cung.svg' },
];

categories.forEach(cat => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="${cat.color}" />
  <text x="50" y="55" font-size="50" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif">${cat.emoji}</text>
</svg>`;

    fs.writeFileSync(path.join(outputDir, cat.file), svgContent);
    console.log(`Generated ${cat.file}`);
});
