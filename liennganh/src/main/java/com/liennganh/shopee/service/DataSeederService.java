package com.liennganh.shopee.service;

import com.github.javafaker.Faker;
import com.liennganh.shopee.model.*;
import com.liennganh.shopee.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DataSeederService {

    private static final Logger log = LoggerFactory.getLogger(DataSeederService.class);
    private static final String UPLOAD_DIR = "C:\\Users\\Admin\\Desktop\\liennganh\\uploads";

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private VoucherRepository voucherRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductAttributeRepository productAttributeRepository;
    @Autowired
    private ProductAttributeOptionRepository productAttributeOptionRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private FlashSaleRepository flashSaleRepository;
    @Autowired
    private AddressRepository addressRepository;

    private final Faker faker = new Faker();
    private final Random random = new Random();

    // ==================== CLEAR ALL DATA ====================
    @Transactional
    public void clearAllData() {
        log.info("Clearing ALL data...");
        reviewRepository.deleteAll();
        cartRepository.deleteAll();
        flashSaleRepository.deleteAll();
        productVariantRepository.deleteAll();
        productAttributeOptionRepository.deleteAll();
        productAttributeRepository.deleteAll();
        orderRepository.deleteAll();
        voucherRepository.deleteAll();
        productRepository.deleteAll();
        addressRepository.deleteAll();
        shopRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();
        clearUploadsFolder();
        log.info("All data cleared!");
    }

    // ==================== USERS ====================
    @Transactional
    public void seedUsers(int count) {
        log.info("Starting to seed {} users", count);
        String[] firstNames = { "Nguyen", "Tran", "Le", "Pham", "Hoang", "Phan", "Vu", "Dang", "Bui", "Do", "Ho", "Ngo",
                "Duong", "Ly" };
        String[] middleNames = { "Van", "Thi", "Huu", "Duc", "Minh", "Anh", "Thanh", "Hoang", "Quoc", "Tuan", "Hai" };
        String[] lastNames = { "Hung", "Dung", "Linh", "Huong", "Mai", "Lan", "Ha", "Trang", "Phuong", "Quan", "Long",
                "Nam", "An", "Binh", "Cuong", "Dat", "Giang", "Hai", "Khoa", "Minh" };

        List<User> users = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            User user = new User();
            String fn = firstNames[random.nextInt(firstNames.length)];
            String mn = middleNames[random.nextInt(middleNames.length)];
            String ln = lastNames[random.nextInt(lastNames.length)];
            user.setUsername((fn + mn + ln).toLowerCase() + random.nextInt(1000));
            user.setEmail(fn.toLowerCase() + mn.toLowerCase() + ln.toLowerCase() + random.nextInt(1000) + "@gmail.com");
            user.setPassword("password");
            if (random.nextDouble() < 0.3) {
                user.setRole(User.Role.SELLER);
                user.setSellerStatus(User.SellerStatus.APPROVED);
            } else {
                user.setRole(User.Role.USER);
            }
            users.add(user);
        }
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@shopee.com");
            admin.setPassword("admin");
            admin.setRole(User.Role.ADMIN);
            users.add(admin);
        }
        userRepository.saveAll(users);
        log.info("Saved {} users", users.size());
    }

    // ==================== SHOPS ====================
    @Transactional
    public void seedShops(int count) {
        log.info("Starting to seed {} shops", count);
        String[] shopPrefixes = { "Cửa hàng", "Shop", "Gian hàng", "Nhà cung cấp", "Siêu thị" };
        String[] shopTypes = { "Thời trang", "Điện tử", "Gia dụng", "Mỹ phẩm", "Thực phẩm", "Đồ chơi", "Sách",
                "Giày dép", "Túi xách", "Phụ kiện" };
        String[] shopNames = { "Minh Anh", "Hồng Phúc", "Thành Đạt", "Bảo Long", "Kim Cương", "Hoàng Gia", "Vạn Phát",
                "Tân Tiến", "Hải Đăng", "Quốc Tế" };

        List<User> users = userRepository.findAll();
        if (users.isEmpty())
            return;
        List<Shop> existingShops = shopRepository.findAll();
        Set<Long> existingOwnerIds = existingShops.stream().map(s -> s.getOwner().getId()).collect(Collectors.toSet());
        List<User> availableSellers = users.stream()
                .filter(u -> u.getRole() == User.Role.SELLER)
                .filter(u -> !existingOwnerIds.contains(u.getId()))
                .collect(Collectors.toList());
        if (availableSellers.isEmpty()) {
            log.info("No available sellers");
            return;
        }
        Collections.shuffle(availableSellers);

        List<Shop> shops = new ArrayList<>();
        int limit = Math.min(count, availableSellers.size());
        for (int i = 0; i < limit; i++) {
            Shop shop = new Shop();
            shop.setName(shopPrefixes[random.nextInt(shopPrefixes.length)] + " "
                    + shopTypes[random.nextInt(shopTypes.length)] + " " + shopNames[random.nextInt(shopNames.length)]);
            shop.setDescription("Chuyên cung cấp sản phẩm chất lượng cao");
            shop.setOwner(availableSellers.get(i));
            shops.add(shop);
        }
        shopRepository.saveAll(shops);
        log.info("Saved {} shops", shops.size());
    }

    // ==================== CATEGORIES ====================
    @Transactional
    public void seedCategories(int count) {
        log.info("Starting to seed categories");
        String[] categoryNames = {
                "Thời trang nam", "Thời trang nữ", "Điện thoại & Phụ kiện",
                "Máy tính & Laptop", "Thiết bị điện tử", "Nhà cửa & Đời sống",
                "Sức khỏe & Làm đẹp", "Mẹ & Bé", "Thể thao & Du lịch",
                "Giày dép nam", "Giày dép nữ", "Túi ví nữ", "Phụ kiện & Trang sức",
                "Đồng hồ", "Bách hóa online", "Ô tô & Xe máy", "Nhà sách online", "Thú cưng"
        };
        List<Category> categories = new ArrayList<>();
        int limit = Math.min(count, categoryNames.length);
        for (int i = 0; i < limit; i++) {
            Category c = new Category();
            c.setName(categoryNames[i]);
            c.setDescription("Danh mục " + categoryNames[i].toLowerCase());
            categories.add(c);
        }
        categoryRepository.saveAll(categories);
        log.info("Saved {} categories", categories.size());
    }

    // ==================== PRODUCTS (MAIN) ====================
    @Transactional
    public void seedProducts(int count) {
        log.info("Starting COMPREHENSIVE product seeder — 100 products per category");

        // 1. Xoá ảnh cũ trong uploads
        clearUploadsFolder();

        List<Shop> shops = shopRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        if (shops.isEmpty() || categories.isEmpty()) {
            log.warn("No shops or categories found. Seed them first.");
            return;
        }

        // 2. Tạo thư mục uploads nếu chưa có
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists())
            uploadDir.mkdirs();

        int totalCreated = 0;

        for (Category category : categories) {
            String catName = category.getName();
            String[] productNames = getProductNamesForCategory(catName);
            String[] imageKeywords = getImageKeywordsForCategory(catName);
            int[] priceRange = getPriceRangeForCategory(catName);

            List<Product> products = new ArrayList<>();

            for (int i = 0; i < count; i++) {
                String name = productNames[i % productNames.length];
                // Thêm hậu tố để tên không trùng
                if (i >= productNames.length) {
                    String[] suffixes = { "- Mẫu Mới " + (2024 + random.nextInt(3)), "- Hot Trend", "- Bán Chạy",
                            "- Cao Cấp", "- Giá Rẻ", "- Chính Hãng", "- Sale " + (10 + random.nextInt(60)) + "%",
                            "- Freeship", "- Limited Edition", "- Best Seller", "- Siêu Phẩm",
                            "V" + (i / productNames.length + 1), "- Premium", "- Mới Về" };
                    name = name + " " + suffixes[i % suffixes.length];
                }

                Product product = new Product();
                product.setName(name);
                product.setDescription(generateDescription(catName, name));
                product.setPrice(generatePrice(priceRange[0], priceRange[1]));
                product.setStockQuantity(random.nextInt(500) + 10);
                product.setShop(shops.get(random.nextInt(shops.size())));
                product.setCategory(category);

                // Tạo ảnh phù hợp với category
                String keyword = imageKeywords[i % imageKeywords.length];
                String fileName = generateProductImage(catName, keyword, name, i);
                product.setImageUrl("http://localhost:8080/api/files/" + fileName);

                products.add(product);
            }

            productRepository.saveAll(products);
            totalCreated += products.size();
            log.info("Seeded 100 products for category: {}", catName);
        }

        log.info("Total products seeded: {}", totalCreated);
    }

    // ==================== TÊN SẢN PHẨM THEO DANH MỤC ====================
    private String[] getProductNamesForCategory(String categoryName) {
        switch (categoryName) {
            case "Thời trang nam":
                return new String[] {
                        "Áo Thun Nam Cotton Cổ Tròn", "Áo Polo Nam Trơn Cao Cấp", "Áo Sơ Mi Nam Tay Dài Công Sở",
                        "Quần Jean Nam Ống Suông", "Quần Kaki Nam Slim Fit", "Quần Short Nam Thể Thao",
                        "Áo Khoác Dù Nam Chống Nắng", "Áo Hoodie Nam Unisex", "Áo Vest Nam Lịch Lãm",
                        "Quần Jogger Nam Túi Hộp", "Áo Thun Nam Oversize", "Áo Sweater Nam Cổ Tròn",
                        "Quần Tây Nam Công Sở", "Áo Tank Top Nam Gym", "Set Bộ Thể Thao Nam",
                        "Áo Len Nam Cổ Lọ", "Quần Linen Nam Ống Rộng", "Áo Thun Polo Nam Phối Màu",
                        "Áo Gió Nam Lót Lông", "Bomber Jacket Nam Cá Tính"
                };
            case "Thời trang nữ":
                return new String[] {
                        "Váy Hoa Nhí Vintage Nữ", "Đầm Suông Công Sở Nữ", "Áo Kiểu Nữ Tay Phồng",
                        "Chân Váy Tennis Xếp Ly", "Quần Ống Rộng Nữ Cạp Cao", "Áo Croptop Nữ Basic",
                        "Set Bộ Nữ Đi Chơi", "Đầm Dự Tiệc Sang Trọng", "Áo Blazer Nữ Thanh Lịch",
                        "Jumpsuit Nữ Ống Rộng", "Quần Jean Nữ Lưng Cao", "Áo Sơ Mi Nữ Tay Dài",
                        "Váy Midi Nữ Elegant", "Áo Len Nữ Cardigan", "Set Đồ Bộ Mặc Nhà Nữ",
                        "Đầm Maxi Nữ Đi Biển", "Quần Culottes Nữ Thời Trang", "Áo Babydoll Nữ",
                        "Váy Caro Vintage Nữ", "Áo Peplum Nữ Nơ Eo"
                };
            case "Điện thoại & Phụ kiện":
                return new String[] {
                        "Ốp Lưng iPhone 15 Pro Max Silicon", "Kính Cường Lực Full Màn Hình", "Sạc Nhanh 65W GaN TypeC",
                        "Cáp Sạc TypeC to TypeC 100W", "Tai Nghe Bluetooth TWS", "Giá Đỡ Điện Thoại Ô Tô",
                        "Pin Sạc Dự Phòng 20000mAh", "Kẹp Điện Thoại Livestream", "Bao Da Flip Cover Samsung",
                        "Dán Skin Carbon Điện Thoại", "Micro Thu Âm Điện Thoại", "Lens Macro Chụp Hình Điện Thoại",
                        "Hub TypeC Đa Năng 7in1", "Đế Sạc Không Dây 15W", "Túi Đựng Phụ Kiện Công Nghệ",
                        "Bút Cảm Ứng Stylus Pen", "Ring Light Mini", "Tripod Mini Cho Điện Thoại",
                        "Adapter Chuyển Đổi OTG", "Miếng Dán PPF Mặt Sau"
                };
            case "Máy tính & Laptop":
                return new String[] {
                        "Bàn Phím Cơ Gaming RGB", "Chuột Không Dây Wireless", "Laptop Stand Nhôm Cao Cấp",
                        "Ổ Cứng SSD 512GB NVMe", "RAM DDR4 16GB 3200MHz", "Webcam Full HD 1080p",
                        "Balo Laptop 15.6 inch", "Lót Chuột Gaming XXL", "USB Flash 128GB Type-C",
                        "Hub USB 3.0 4 Cổng", "Màn Hình Monitor 24 inch", "Dây HDMI 2.1 8K",
                        "Tản Nhiệt Laptop 6 Quạt", "Loa Bluetooth Mini", "Bộ Vệ Sinh Laptop",
                        "Phím Tắt Stream Deck", "Card Đồ Họa GTX 1660", "Mouse Pad RGB Led",
                        "Kê Tay Bàn Phím Memory Foam", "Tai Nghe Gaming 7.1"
                };
            case "Thiết bị điện tử":
                return new String[] {
                        "Loa Bluetooth JBL GO3", "Tai Nghe Chụp Tai ANC", "Máy Ảnh Mini Instax",
                        "Đồng Hồ Thông Minh Smart Watch", "Máy Chiếu Mini Projector", "Robot Hút Bụi Thông Minh",
                        "Nồi Chiên Không Dầu 6L", "Camera WiFi Trong Nhà", "Máy Lọc Không Khí Mini",
                        "Bàn Là Hơi Nước Cầm Tay", "TV Box Android 4K", "Máy Xay Sinh Tố Cầm Tay",
                        "Đèn LED Thông Minh RGB", "Ổ Cắm WiFi Smart Plug", "Máy Đo Huyết Áp Tự Động",
                        "Quạt Mini USB Để Bàn", "Đèn Ngủ LED 3D Mặt Trăng", "Cân Điện Tử Thông Minh",
                        "Máy Sấy Tóc Ion Âm", "Máy Ép Trái Cây Chậm"
                };
            case "Nhà cửa & Đời sống":
                return new String[] {
                        "Bộ Chăn Ga Gối Cotton", "Đèn Bàn Học LED Chống Cận", "Kệ Sách Gỗ Đa Năng",
                        "Thảm Trải Sàn Phòng Khách", "Rèm Cửa Chống Nắng", "Bình Hoa Gốm Sứ Trang Trí",
                        "Hộp Đựng Đồ Gấp Gọn", "Giá Treo Quần Áo Inox", "Tấm Thớt Gỗ Tự Nhiên",
                        "Bộ Nồi Inox 5 Đáy", "Chậu Cây Cảnh Bàn Làm Việc", "Gương Trang Điểm LED",
                        "Đèn Cắm Tường Cảm Ứng", "Hộp Bảo Quản Thực Phẩm", "Bộ Dao Nhà Bếp Ceramic",
                        "Giá Để Gia Vị 3 Tầng", "Móc Treo Dán Tường 3M", "Tổ Chức Đồ Ngăn Kéo",
                        "Đồng Hồ Treo Tường Vintage", "Bộ Ly Thuỷ Tinh Cao Cấp"
                };
            case "Sức khỏe & Làm đẹp":
                return new String[] {
                        "Sữa Rửa Mặt CeraVe", "Kem Chống Nắng SPF50", "Toner Hoa Hồng Bulgaria",
                        "Serum Vitamin C Trắng Da", "Mặt Nạ Giấy Mediheal", "Son Kem Lì Velvet",
                        "Kem Dưỡng Ẩm Innisfree", "Tẩy Trang Micellar Water", "Bông Tẩy Trang Cotton",
                        "Bộ Cọ Trang Điểm 12 Cây", "Sáp Vuốt Tóc Nam Wax", "Máy Rửa Mặt Foreo",
                        "Tinh Dầu Dưỡng Tóc Moroccanoil", "Phấn Nước Cushion BB", "Kẻ Mắt Nước Waterproof",
                        "Gel Rửa Tay Khô 500ml", "Lăn Khử Mùi Nivea", "Kem Trị Mụn Spot Gel",
                        "Collagen Nước Uống", "Viên Uống Vitamin Tổng Hợp"
                };
            case "Mẹ & Bé":
                return new String[] {
                        "Bỉm Dán Bobby Size M", "Sữa Bột Ensure Grow Plus", "Xe Đẩy Em Bé Gấp Gọn",
                        "Ghế Ăn Dặm Cho Bé", "Đồ Chơi Xếp Hình Lego", "Bình Sữa Pigeon Cổ Rộng",
                        "Quần Áo Sơ Sinh Set 5 Bộ", "Tã Quần Huggies Dry", "Balo Đi Học Cho Bé",
                        "Nôi Rung Tự Động", "Yếm Ăn Silicon Cho Bé", "Bộ Bát Thìa Ăn Dặm",
                        "Kem Chống Hăm Sudocrem", "Đồ Chơi Montessori Gỗ", "Khăn Ướt Bobby Không Mùi",
                        "Gối Chống Trào Ngược", "Đàn Piano Mini Cho Bé", "Sách Vải Cho Bé 0-3 Tuổi",
                        "Máy Hâm Sữa Philips Avent", "Bình Giữ Nhiệt Cho Bé"
                };
            case "Thể thao & Du lịch":
                return new String[] {
                        "Giày Chạy Bộ Nike Air", "Balo Du Lịch 40L Chống Nước", "Thảm Tập Yoga TPE 6mm",
                        "Dây Nhảy Thể Dục Có Đếm", "Bình Nước Gym 1L Tritan", "Găng Tay Tập Gym Nam",
                        "Vợt Cầu Lông Yonex", "Túi Du Lịch Gấp Gọn", "Mũ Lưỡi Trai Thể Thao",
                        "Áo Thun Gym Dri-Fit", "Quần Short Thể Thao", "Tạ Tay 5kg Bọc Cao Su",
                        "Kính Bơi Chống Sương", "Bóng Đá Adidas Size 5", "Đồng Hồ GPS Chạy Bộ",
                        "Xe Đạp Tập Thể Dục", "Vớ Thể Thao Cotton", "Đai Lưng Tập Gym",
                        "Lều Cắm Trại 4 Người", "Bộ Dụng Cụ Cắm Trại"
                };
            case "Giày dép nam":
                return new String[] {
                        "Giày Sneaker Nam Trắng", "Giày Thể Thao Nam Nike", "Dép Quai Ngang Nam Cao Su",
                        "Giày Lười Nam Da Bò", "Giày Boot Nam Cổ Cao", "Sandal Nam Quai Chéo",
                        "Giày Chạy Bộ Nam Adidas", "Giày Tây Nam Công Sở", "Dép Xỏ Ngón Nam",
                        "Giày Bata Nam Canvas", "Giày Đá Banh Sân Cỏ", "Giày Leo Núi Nam Outdoor",
                        "Dép Sục Nam Crocs", "Giày Slip-On Nam", "Giày Cao Cổ Converse",
                        "Sandal Chỉnh Hình Nam", "Giày Lưới Nam Thoáng Khí", "Dép Lê Nam Êm Chân",
                        "Giày Oxford Nam Da Thật", "Giày Jordan Retro Nam"
                };
            case "Giày dép nữ":
                return new String[] {
                        "Giày Cao Gót Nữ 7cm", "Giày Búp Bê Nữ Êm Chân", "Sandal Nữ Đế Xuồng",
                        "Dép Quai Ngang Nữ", "Giày Sneaker Nữ Trắng", "Boot Nữ Cổ Thấp",
                        "Giày Oxford Nữ Phong Cách", "Dép Lông Nữ Đi Trong Nhà", "Giày Thể Thao Nữ Nhẹ",
                        "Sandal Xỏ Ngón Nữ Đi Biển", "Giày Mary Jane Nữ", "Dép Sục Nữ Thời Trang",
                        "Giày Lười Nữ Đế Mềm", "Giày Platform Nữ Độn Đế", "Sandal Cao Gót Quai Mảnh",
                        "Giày Thể Thao Nữ New Balance", "Dép Bít Mũi Nữ", "Giày Mọi Nữ Da Mềm",
                        "Boot Chelsea Nữ", "Giày Vải Nữ Hàn Quốc"
                };
            case "Túi ví nữ":
                return new String[] {
                        "Túi Xách Nữ Da Cao Cấp", "Balo Nữ Mini Ulzzang", "Ví Dài Nữ Cầm Tay",
                        "Túi Đeo Chéo Nữ Nhỏ Gọn", "Clutch Dự Tiệc Sang Trọng", "Túi Tote Nữ Vải Canvas",
                        "Ví Ngắn Nữ Nhiều Ngăn", "Túi Bucket Nữ Dây Rút", "Túi Kẹp Nách Nữ Vintage",
                        "Balo Laptop Nữ 14 inch", "Túi Đeo Vai Nữ Chain", "Ví Card Holder Mini",
                        "Túi Woven Nữ Đan Tay", "Túi Saddle Bag Nữ", "Túi Lunch Bag Giữ Nhiệt",
                        "Balo Đi Học Nữ Sinh", "Túi Dạ Nữ Handmade", "Ví Passport Du Lịch",
                        "Túi Trống Du Lịch", "Túi Đeo Bụng Nữ Sporty"
                };
            case "Phụ kiện & Trang sức":
                return new String[] {
                        "Vòng Tay Bạc 925", "Bông Tai Ngọc Trai", "Dây Chuyền Vàng 18K",
                        "Nhẫn Đôi Tình Nhân", "Kính Mát Thời Trang UV400", "Mũ Bucket Hat Unisex",
                        "Thắt Lưng Da Bò Nam", "Khẩu Trang Vải 3D", "Khăn Lụa Choàng Cổ",
                        "Trâm Cài Tóc Hàn Quốc", "Cặp Tóc Kẹp Mỏ Vịt", "Band Đầu Thể Thao",
                        "Vòng Cổ Choker", "Charm Bạc Pandora", "Bông Tai Dài Tassel",
                        "Chuỗi Hạt Đeo Tay Phong Thuỷ", "Kẹp Cà Vạt Inox", "Ghim Cài Áo Vest",
                        "Mắt Kính Chống Ánh Sáng Xanh", "Vòng Chân Nữ Bạc Ý"
                };
            case "Đồng hồ":
                return new String[] {
                        "Đồng Hồ Nam Casio Classic", "Đồng Hồ Nữ Michael Kors", "Smart Watch Apple Watch SE",
                        "Đồng Hồ Cơ Automatic Nam", "Đồng Hồ Đôi Tình Nhân", "Đồng Hồ Thể Thao G-Shock",
                        "Đồng Hồ Nữ Dây Da", "Đồng Hồ Nam Dây Thép", "Đồng Hồ Trẻ Em Digital",
                        "Đồng Hồ Thông Minh Xiaomi", "Đồng Hồ Pilot Chronograph", "Đồng Hồ Dress Watch Nữ",
                        "Đồng Hồ Điện Tử LED", "Đồng Hồ Dây Nato Nam", "Đồng Hồ Nữ Mặt Vuông",
                        "Đồng Hồ Lặn Diver 200m", "Đồng Hồ Vintage Retro", "Đồng Hồ Skeleton Lộ Máy",
                        "Đồng Hồ Nữ Rose Gold", "Đồng Hồ Field Watch Quân Đội"
                };
            case "Bách hóa online":
                return new String[] {
                        "Nước Giặt Omo 3.5kg", "Nước Rửa Chén Sunlight", "Giấy Vệ Sinh Pulppy 12 Cuộn",
                        "Dầu Ăn Cooking Oil 5L", "Mì Hảo Hảo Thùng 30 Gói", "Sữa Vinamilk Thùng 48 Hộp",
                        "Cafe Trung Nguyên G7", "Trà Lipton Túi Lọc 100", "Nước Xả Vải Downy",
                        "Kem Đánh Răng Colgate", "Dầu Gội Head & Shoulders", "Sữa Tắm Dove 530ml",
                        "Bột Giặt Ariel 4.1kg", "Nước Mắm Chinsu 500ml", "Gia Vị Lẩu Thái Vifon",
                        "Snack Lay's Khoai Tây", "Bánh Oreo Sô Cô La", "Kẹo Dẻo Haribo",
                        "Trà Sữa Nestea Hộp", "Sốt Mayonnaise Aji-mayo"
                };
            case "Ô tô & Xe máy":
                return new String[] {
                        "Mũ Bảo Hiểm Fullface", "Áo Mưa Bộ 2 Lớp", "Đèn LED Pha Ô Tô H4",
                        "Camera Hành Trình 70mai", "Nước Hoa Ô Tô", "Bọc Vô Lăng Da Cao Cấp",
                        "Tấm Che Nắng Ô Tô", "Dung Dịch Rửa Xe 5L", "Bộ Dụng Cụ Sửa Xe Đa Năng",
                        "Lọc Gió Xe Máy", "Nhớt Motul Xe Máy", "Khoá Đĩa Xe Chống Trộm",
                        "Bao Tay Lái Xe Máy", "Đệm Ngồi Ô Tô", "Giá Đỡ Điện Thoại Xe",
                        "Bình Chữa Cháy Mini", "Miếng Dán Chống Va Đập", "Đèn Hậu LED Xe Máy",
                        "Dây Đai An Toàn", "Quạt Hương Ô Tô"
                };
            case "Nhà sách online":
                return new String[] {
                        "Đắc Nhân Tâm - Dale Carnegie", "Nhà Giả Kim - Paulo Coelho", "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                        "Atomic Habits - Thay Đổi Tí Hon", "Bố Già - Mario Puzo", "Sapiens Lược Sử Loài Người",
                        "Tư Duy Nhanh Và Chậm", "Người Giàu Nhất Thành Babylon", "Một Lít Nước Mắt",
                        "Python Crash Course", "Sách Tô Màu Người Lớn", "Sổ Tay Bullet Journal Dotted",
                        "Bút Máy Lamy Safari", "Bộ 12 Bút Màu Staedtler", "Sticker Trang Trí Sổ Tay",
                        "Flashcard Tiếng Anh 3000 Từ", "Từ Điển Anh Việt Oxford", "Sách IELTS Cam 18",
                        "Manga One Piece Tập 106", "Truyện Tranh Conan Tập 103"
                };
            case "Thú cưng":
                return new String[] {
                        "Thức Ăn Hạt Cho Chó Royal Canin", "Cát Vệ Sinh Mèo 10L", "Vòng Cổ Cho Chó Mèo",
                        "Lồng Vận Chuyển Thú Cưng", "Đồ Chơi Chuột Nhắt Cho Mèo", "Bát Ăn Inox Cho Chó",
                        "Quần Áo Cho Chó Mèo", "Sữa Tắm Thú Cưng 500ml", "Dây Dắt Chó Đi Dạo",
                        "Nhà Cho Mèo Cat Tree", "Snack Thưởng Cho Chó", "Cỏ Mèo Catnip Tự Nhiên",
                        "Khay Vệ Sinh Cho Mèo", "Máng Nước Tự Động", "Bàn Cào Móng Cho Mèo",
                        "Pate Cho Mèo Whiskas", "Vitamin Cho Thú Cưng", "Lược Chải Lông Pet",
                        "Túi Đeo Chó Mèo Đi Chơi", "Đèn UV Diệt Khuẩn Bể Cá"
                };
            default:
                return new String[] {
                        "Sản phẩm A", "Sản phẩm B", "Sản phẩm C", "Sản phẩm D", "Sản phẩm E",
                        "Sản phẩm F", "Sản phẩm G", "Sản phẩm H", "Sản phẩm I", "Sản phẩm J"
                };
        }
    }

    // ==================== TỪ KHOÁ ẢNH THEO DANH MỤC ====================
    private String[] getImageKeywordsForCategory(String categoryName) {
        switch (categoryName) {
            case "Thời trang nam":
                return new String[] { "shirt", "polo", "jacket", "jeans", "menswear", "hoodie", "blazer", "sweater",
                        "pants", "tshirt" };
            case "Thời trang nữ":
                return new String[] { "dress", "blouse", "skirt", "womens fashion", "gown", "cardigan", "jumpsuit",
                        "outfit", "clothing", "tops" };
            case "Điện thoại & Phụ kiện":
                return new String[] { "smartphone", "phone case", "charger", "earbuds", "powerbank", "cable",
                        "phone stand", "screen protector", "bluetooth", "gadget" };
            case "Máy tính & Laptop":
                return new String[] { "laptop", "keyboard", "mouse", "monitor", "computer", "ssd", "webcam", "usb",
                        "headset", "gaming" };
            case "Thiết bị điện tử":
                return new String[] { "speaker", "headphone", "camera", "smartwatch", "projector", "robot vacuum",
                        "air fryer", "electronics", "led light", "appliance" };
            case "Nhà cửa & Đời sống":
                return new String[] { "bedding", "desk lamp", "bookshelf", "carpet", "curtain", "vase", "kitchen",
                        "furniture", "home decor", "cookware" };
            case "Sức khỏe & Làm đẹp":
                return new String[] { "skincare", "sunscreen", "serum", "lipstick", "moisturizer", "makeup",
                        "cosmetics", "beauty", "cream", "perfume" };
            case "Mẹ & Bé":
                return new String[] { "baby", "stroller", "toy", "bottle", "diaper", "baby clothes", "teddy bear",
                        "kids", "nursery", "pacifier" };
            case "Thể thao & Du lịch":
                return new String[] { "sneakers running", "backpack travel", "yoga mat", "gym", "sports bottle",
                        "camping", "bicycle", "fitness", "dumbbell", "outdoor" };
            case "Giày dép nam":
                return new String[] { "sneakers mens", "loafers", "boots", "sandals mens", "oxford shoes",
                        "canvas shoes", "sport shoes", "leather shoes", "casual shoes", "running shoes" };
            case "Giày dép nữ":
                return new String[] { "high heels", "flats", "sandals womens", "boots womens", "sneakers womens",
                        "wedge shoes", "ballet shoes", "slippers", "platform shoes", "pumps" };
            case "Túi ví nữ":
                return new String[] { "handbag", "backpack mini", "wallet", "crossbody bag", "clutch", "tote bag",
                        "purse", "bucket bag", "shoulder bag", "leather bag" };
            case "Phụ kiện & Trang sức":
                return new String[] { "bracelet", "earrings", "necklace", "ring", "sunglasses", "hat", "belt",
                        "jewelry", "pendant", "accessories" };
            case "Đồng hồ":
                return new String[] { "watch", "wristwatch", "smartwatch", "clock", "chronograph", "luxury watch",
                        "digital watch", "vintage watch", "sport watch", "timepiece" };
            case "Bách hóa online":
                return new String[] { "grocery", "detergent", "snacks", "milk", "coffee", "shampoo", "toothpaste",
                        "household", "cleaning", "food" };
            case "Ô tô & Xe máy":
                return new String[] { "helmet", "raincoat", "car camera", "car accessories", "motorcycle", "car seat",
                        "steering wheel", "car light", "motor oil", "car tools" };
            case "Nhà sách online":
                return new String[] { "book", "novel", "notebook", "pen", "stationery", "manga", "dictionary",
                        "journal", "bookmark", "reading" };
            case "Thú cưng":
                return new String[] { "dog food", "cat litter", "pet collar", "pet carrier", "cat toy", "dog bowl",
                        "pet clothes", "leash", "cat tree", "aquarium" };
            default:
                return new String[] { "product" };
        }
    }

    // ==================== KHOẢNG GIÁ THEO DANH MỤC ====================
    private int[] getPriceRangeForCategory(String categoryName) {
        switch (categoryName) {
            case "Thời trang nam":
                return new int[] { 89000, 999000 };
            case "Thời trang nữ":
                return new int[] { 79000, 1200000 };
            case "Điện thoại & Phụ kiện":
                return new int[] { 29000, 2500000 };
            case "Máy tính & Laptop":
                return new int[] { 99000, 35000000 };
            case "Thiết bị điện tử":
                return new int[] { 49000, 15000000 };
            case "Nhà cửa & Đời sống":
                return new int[] { 25000, 3000000 };
            case "Sức khỏe & Làm đẹp":
                return new int[] { 15000, 1500000 };
            case "Mẹ & Bé":
                return new int[] { 35000, 5000000 };
            case "Thể thao & Du lịch":
                return new int[] { 39000, 8000000 };
            case "Giày dép nam":
                return new int[] { 69000, 3500000 };
            case "Giày dép nữ":
                return new int[] { 59000, 2500000 };
            case "Túi ví nữ":
                return new int[] { 49000, 5000000 };
            case "Phụ kiện & Trang sức":
                return new int[] { 19000, 3000000 };
            case "Đồng hồ":
                return new int[] { 99000, 15000000 };
            case "Bách hóa online":
                return new int[] { 8000, 500000 };
            case "Ô tô & Xe máy":
                return new int[] { 25000, 5000000 };
            case "Nhà sách online":
                return new int[] { 15000, 500000 };
            case "Thú cưng":
                return new int[] { 15000, 2000000 };
            default:
                return new int[] { 50000, 1000000 };
        }
    }

    // ==================== MÔ TẢ SẢN PHẨM ====================
    private String generateDescription(String category, String productName) {
        String[] quality = { "Chất lượng cao", "Hàng chính hãng 100%", "Cam kết như mô tả", "Bảo hành 12 tháng" };
        String[] shipping = { "Freeship toàn quốc", "Giao hàng nhanh 2h", "Đóng gói cẩn thận", "Ship COD toàn quốc" };
        String[] promo = { "Giá tốt nhất thị trường", "Sale giá sốc", "Mua 2 giảm 10%", "Tặng quà khi mua" };
        return "🔥 " + productName + "\n\n" +
                "✅ " + quality[random.nextInt(quality.length)] + "\n" +
                "🚚 " + shipping[random.nextInt(shipping.length)] + "\n" +
                "💰 " + promo[random.nextInt(promo.length)] + "\n\n" +
                "📌 Danh mục: " + category;
    }

    // ==================== TẠO GIÁ ====================
    private BigDecimal generatePrice(int min, int max) {
        int raw = random.nextInt(max - min) + min;
        // Làm tròn đến hàng nghìn đồng
        int rounded = (raw / 1000) * 1000;
        return BigDecimal.valueOf(rounded);
    }

    // ==================== TẠO ẢNH SẢN PHẨM (TẢI ẢNH THẬT TỪ INTERNET)
    // ====================
    private final Map<String, String> categoryImageCache = new HashMap<>();

    private String generateProductImage(String category, String keyword, String productName, int index) {
        String safeCategory = category.replace(" ", "_").replace("&", "and");
        String fileName = "product_" + safeCategory + "_" + index + ".jpg";
        File file = new File(UPLOAD_DIR, fileName);

        // Mỗi category download 10 ảnh, reuse cho 100 sản phẩm
        int imageIndex = index % 10;
        String cacheKey = category + "_" + imageIndex;

        // Nếu đã download ảnh cho slot này rồi thì copy
        if (categoryImageCache.containsKey(cacheKey)) {
            try {
                String sourceName = categoryImageCache.get(cacheKey);
                File source = new File(UPLOAD_DIR, sourceName);
                if (source.exists()) {
                    Files.copy(source.toPath(), file.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                    return fileName;
                }
            } catch (IOException e) {
                log.warn("Failed to copy cached image: {}", e.getMessage());
            }
        }

        // Download ảnh thật từ loremflickr.com
        try {
            String searchKeyword = keyword.replace(" ", ",");
            String url = "https://loremflickr.com/400/400/" + searchKeyword + "?lock=" + (category.hashCode() + index);

            java.net.URL imageUrl = new java.net.URL(url);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) imageUrl.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);
            conn.setInstanceFollowRedirects(true);
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                try (java.io.InputStream in = conn.getInputStream();
                        java.io.FileOutputStream out = new java.io.FileOutputStream(file)) {
                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = in.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);
                    }
                }
                categoryImageCache.put(cacheKey, fileName);
                log.debug("Downloaded image for: {} -> {}", productName, fileName);
                return fileName;
            }
        } catch (Exception e) {
            log.warn("Failed to download image for {}: {}", productName, e.getMessage());
        }

        // Fallback: tạo ảnh placeholder đơn giản nhưng đẹp hơn
        return generateFallbackImage(category, productName, index);
    }

    private String generateFallbackImage(String category, String productName, int index) {
        try {
            int width = 400, height = 400;
            BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = img.createGraphics();
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            Color[] colors = getCategoryColors(category);
            GradientPaint gradient = new GradientPaint(0, 0, colors[0], width, height, colors[1]);
            g.setPaint(gradient);
            g.fillRect(0, 0, width, height);

            // White pill for product name
            g.setColor(new Color(255, 255, 255, 220));
            g.fill(new RoundRectangle2D.Float(30, 160, 340, 80, 20, 20));

            g.setFont(new Font("Arial", Font.BOLD, 15));
            g.setColor(new Color(50, 50, 50));
            String shortName = productName.length() > 35 ? productName.substring(0, 32) + "..." : productName;
            drawWrappedText(g, shortName, 45, 195, 310, 20);

            g.dispose();

            String safeCategory = category.replace(" ", "_").replace("&", "and");
            String fileName = "product_" + safeCategory + "_" + index + ".jpg";
            File file = new File(UPLOAD_DIR, fileName);
            ImageIO.write(img, "jpg", file);
            return fileName;
        } catch (IOException e) {
            return "default.jpg";
        }
    }

    private Color[] getCategoryColors(String category) {
        switch (category) {
            case "Thời trang nam":
                return new Color[] { new Color(52, 73, 94), new Color(44, 62, 80) };
            case "Thời trang nữ":
                return new Color[] { new Color(232, 67, 147), new Color(214, 48, 49) };
            case "Điện thoại & Phụ kiện":
                return new Color[] { new Color(9, 132, 227), new Color(0, 206, 209) };
            case "Máy tính & Laptop":
                return new Color[] { new Color(45, 52, 54), new Color(99, 110, 114) };
            case "Thiết bị điện tử":
                return new Color[] { new Color(108, 92, 231), new Color(162, 155, 254) };
            case "Nhà cửa & Đời sống":
                return new Color[] { new Color(253, 203, 110), new Color(225, 177, 44) };
            case "Sức khỏe & Làm đẹp":
                return new Color[] { new Color(253, 121, 168), new Color(250, 177, 160) };
            case "Mẹ & Bé":
                return new Color[] { new Color(129, 207, 224), new Color(164, 176, 190) };
            case "Thể thao & Du lịch":
                return new Color[] { new Color(46, 204, 113), new Color(39, 174, 96) };
            case "Giày dép nam":
                return new Color[] { new Color(139, 90, 43), new Color(93, 64, 55) };
            case "Giày dép nữ":
                return new Color[] { new Color(253, 167, 223), new Color(238, 130, 238) };
            case "Túi ví nữ":
                return new Color[] { new Color(207, 106, 135), new Color(167, 80, 114) };
            case "Phụ kiện & Trang sức":
                return new Color[] { new Color(255, 215, 0), new Color(218, 165, 32) };
            case "Đồng hồ":
                return new Color[] { new Color(52, 73, 94), new Color(149, 165, 166) };
            case "Bách hóa online":
                return new Color[] { new Color(255, 107, 107), new Color(238, 90, 36) };
            case "Ô tô & Xe máy":
                return new Color[] { new Color(45, 52, 54), new Color(0, 148, 50) };
            case "Nhà sách online":
                return new Color[] { new Color(116, 185, 255), new Color(9, 132, 227) };
            case "Thú cưng":
                return new Color[] { new Color(255, 159, 67), new Color(255, 107, 107) };
            default:
                return new Color[] { new Color(149, 165, 166), new Color(127, 140, 141) };
        }
    }

    private void drawWrappedText(Graphics2D g, String text, int x, int y, int maxWidth, int lineHeight) {
        FontMetrics fm = g.getFontMetrics();
        String[] words = text.split(" ");
        StringBuilder line = new StringBuilder();
        int currentY = y;
        for (String word : words) {
            String test = line.length() == 0 ? word : line + " " + word;
            if (fm.stringWidth(test) > maxWidth && line.length() > 0) {
                g.drawString(line.toString(), x, currentY);
                line = new StringBuilder(word);
                currentY += lineHeight;
            } else {
                line = new StringBuilder(test);
            }
        }
        if (line.length() > 0)
            g.drawString(line.toString(), x, currentY);
    }

    // ==================== XOÁ ẢNH CŨ ====================
    private void clearUploadsFolder() {
        try {
            Path uploadsPath = Paths.get(UPLOAD_DIR);
            if (Files.exists(uploadsPath)) {
                Files.walk(uploadsPath)
                        .filter(Files::isRegularFile)
                        .forEach(file -> {
                            try {
                                Files.delete(file);
                            } catch (IOException e) {
                                log.warn("Could not delete: {}", file);
                            }
                        });
                log.info("Cleared all files in uploads folder");
            }
        } catch (IOException e) {
            log.error("Error clearing uploads folder", e);
        }
    }

    // ==================== VOUCHERS ====================
    @Transactional
    public void seedVouchers(int count) {
        log.info("Starting to seed {} vouchers", count);
        String[] voucherPrefixes = { "GIAM", "SALE", "FREESHIP", "KHUYENMAI", "HOTSALE" };
        List<Voucher> vouchers = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            Voucher v = new Voucher();
            v.setCode(voucherPrefixes[random.nextInt(voucherPrefixes.length)] + (random.nextInt(9000) + 1000));
            if (random.nextBoolean()) {
                v.setDiscountType(Voucher.DiscountType.FIXED);
                v.setDiscountValue(BigDecimal.valueOf(faker.number().numberBetween(10000, 100000)));
            } else {
                v.setDiscountType(Voucher.DiscountType.PERCENTAGE);
                v.setDiscountValue(BigDecimal.valueOf(faker.number().numberBetween(5, 50)));
            }
            v.setMinOrderValue(BigDecimal.valueOf(faker.number().numberBetween(50000, 500000)));
            v.setUsageLimit(faker.number().numberBetween(10, 100));
            v.setStartDate(java.time.LocalDateTime.now());
            v.setEndDate(java.time.LocalDateTime.now().plusDays(30));
            vouchers.add(v);
        }
        voucherRepository.saveAll(vouchers);
        log.info("Saved {} vouchers", vouchers.size());
    }

    // ==================== ORDERS ====================
    @Transactional
    public void seedOrders(int count) {
        log.info("Starting to seed {} orders", count);
        List<User> users = userRepository.findAll();
        List<Product> products = productRepository.findAll();
        if (users.isEmpty() || products.isEmpty())
            return;

        for (int i = 0; i < count; i++) {
            User user = users.get(random.nextInt(users.size()));
            Order order = new Order();
            order.setUser(user);
            order.setStatus(Order.OrderStatus.values()[random.nextInt(Order.OrderStatus.values().length)]);

            List<OrderItem> items = new ArrayList<>();
            BigDecimal totalPrice = BigDecimal.ZERO;
            int itemCount = random.nextInt(5) + 1;
            for (int j = 0; j < itemCount; j++) {
                Product product = products.get(random.nextInt(products.size()));
                OrderItem item = new OrderItem();
                item.setProduct(product);
                item.setQuantity(random.nextInt(5) + 1);
                item.setPrice(product.getPrice());
                item.setOrder(order);
                items.add(item);
                totalPrice = totalPrice.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            }
            order.setOrderItems(items);
            order.setTotalPrice(totalPrice);
            order.setFinalPrice(totalPrice);
            orderRepository.save(order);
        }
        log.info("Saved {} orders", count);
    }

    // ==================== PRODUCT VARIANTS ====================
    @Transactional
    public void seedProductVariants() {
        log.info("Starting to seed product variants");
        List<Product> products = productRepository.findAll();
        if (products.isEmpty())
            return;

        String[][] fashionAttrs = { { "Size", "S,M,L,XL,XXL" }, { "Màu sắc", "Đen,Trắng,Xanh,Đỏ,Vàng" } };
        String[][] phoneAttrs = { { "Color", "Đen,Trắng,Vàng,Xanh dương" }, { "Bộ nhớ", "64GB,128GB,256GB,512GB" } };
        String[][] shoeAttrs = { { "Size", "38,39,40,41,42,43" }, { "Màu", "Đen,Trắng,Nâu" } };
        String[][] defaultAttrs = { { "Phân loại", "Mặc định" } };

        int variantCount = 0;
        for (Product product : products) {
            String categoryName = product.getCategory().getName().toLowerCase();
            String[][] attrsToUse;
            if (categoryName.contains("thời trang") || categoryName.contains("áo") || categoryName.contains("quần")) {
                attrsToUse = fashionAttrs;
            } else if (categoryName.contains("điện thoại") || categoryName.contains("phụ kiện")) {
                attrsToUse = phoneAttrs;
            } else if (categoryName.contains("giày") || categoryName.contains("dép")) {
                attrsToUse = shoeAttrs;
            } else {
                attrsToUse = defaultAttrs;
            }

            List<List<String>> allOptionValues = new ArrayList<>();
            List<String> attrNames = new ArrayList<>();
            for (String[] attrDef : attrsToUse) {
                ProductAttribute attr = new ProductAttribute();
                attr.setProduct(product);
                attr.setName(attrDef[0]);
                attr = productAttributeRepository.save(attr);
                attrNames.add(attrDef[0]);
                String[] optionValues = attrDef[1].split(",");
                List<String> optVals = new ArrayList<>();
                for (String val : optionValues) {
                    ProductAttributeOption option = new ProductAttributeOption();
                    option.setAttribute(attr);
                    option.setValue(val.trim());
                    productAttributeOptionRepository.save(option);
                    optVals.add(val.trim());
                }
                allOptionValues.add(optVals);
            }
            int numVariants = Math.min(5, allOptionValues.get(0).size());
            for (int i = 0; i < numVariants; i++) {
                ProductVariant variant = new ProductVariant();
                variant.setProduct(product);
                StringBuilder json = new StringBuilder("{");
                for (int a = 0; a < attrNames.size(); a++) {
                    List<String> opts = allOptionValues.get(a);
                    String val = opts.get(i % opts.size());
                    if (a > 0)
                        json.append(", ");
                    json.append("\"").append(attrNames.get(a)).append("\":\"").append(val).append("\"");
                }
                json.append("}");
                variant.setAttributes(json.toString());
                BigDecimal priceVariation = product.getPrice()
                        .multiply(BigDecimal.valueOf(0.9 + random.nextDouble() * 0.3));
                variant.setPrice(priceVariation.setScale(0, RoundingMode.HALF_UP));
                variant.setStockQuantity(random.nextInt(200) + 10);
                variant.setImageUrl(product.getImageUrl());
                productVariantRepository.save(variant);
                variantCount++;
            }
        }
        log.info("Seeded {} variants for {} products", variantCount, products.size());
    }

    // ==================== REVIEWS ====================
    public void seedReviews(int maxPerProduct) {
        List<Product> products = productRepository.findAll();
        List<User> users = userRepository.findAll();
        List<Order> orders = orderRepository.findAll();

        if (users.isEmpty() || products.isEmpty()) {
            log.warn("No users or products to seed reviews");
            return;
        }

        String[] goodComments = {
                "Sản phẩm rất tốt, đúng mô tả. Giao hàng nhanh!",
                "Chất lượng tuyệt vời, đóng gói cẩn thận. Sẽ mua lại.",
                "Hàng đẹp, giá hợp lý. Shop giao nhanh lắm!",
                "Rất hài lòng với sản phẩm này. 10 điểm!",
                "Mình đã mua lần 2 rồi, chất lượng vẫn ổn định.",
                "Giao hàng siêu nhanh, đóng gói kỹ càng. Recommend!",
                "Sản phẩm chính hãng, dùng rất thích. Cảm ơn shop!",
                "Mua cho gia đình, ai cũng thích. Giá tốt nữa.",
                "Đã so sánh nhiều shop, shop này giá tốt nhất!",
                "Hàng nhận đúng mẫu, chất liệu ok. 5 sao!"
        };

        String[] okComments = {
                "Sản phẩm tạm ổn, giao hàng hơi lâu.",
                "Chất lượng bình thường, tầm giá này thì chấp nhận được.",
                "Hàng ok nhưng đóng gói sơ sài một chút.",
                "Sản phẩm đúng mô tả nhưng màu hơi khác ảnh.",
                "Dùng được, nhưng chưa thật sự ấn tượng."
        };

        String[] badComments = {
                "Hàng không giống mô tả lắm, hơi thất vọng.",
                "Giao hàng chậm, sản phẩm tạm được.",
                "Chất lượng không tốt lắm so với giá tiền."
        };

        int totalReviews = 0;
        for (Product product : products) {
            int reviewCount = random.nextInt(maxPerProduct) + 1;
            for (int i = 0; i < reviewCount; i++) {
                Review review = new Review();
                review.setUser(users.get(random.nextInt(users.size())));
                review.setProduct(product);

                // Assign a random order if available
                if (!orders.isEmpty()) {
                    review.setOrder(orders.get(random.nextInt(orders.size())));
                } else {
                    continue;
                }

                // Weighted rating: more 4-5 star reviews
                int rand = random.nextInt(100);
                int rating;
                String comment;
                if (rand < 50) {
                    rating = 5;
                    comment = goodComments[random.nextInt(goodComments.length)];
                } else if (rand < 75) {
                    rating = 4;
                    comment = goodComments[random.nextInt(goodComments.length)];
                } else if (rand < 90) {
                    rating = 3;
                    comment = okComments[random.nextInt(okComments.length)];
                } else {
                    rating = random.nextInt(2) + 1;
                    comment = badComments[random.nextInt(badComments.length)];
                }

                review.setRating(rating);
                review.setComment(comment);
                review.setCreatedAt(java.time.LocalDateTime.now().minusDays(random.nextInt(30)));

                reviewRepository.save(review);
                totalReviews++;
            }
        }
        log.info("Seeded {} reviews for {} products", totalReviews, products.size());
    }
}
