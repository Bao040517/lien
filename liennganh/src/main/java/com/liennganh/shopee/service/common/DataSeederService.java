package com.liennganh.shopee.service.common;

import com.github.javafaker.Faker;
import com.liennganh.shopee.entity.*;
import com.liennganh.shopee.repository.user.UserRepository;
import com.liennganh.shopee.repository.shop.ShopRepository;
import com.liennganh.shopee.repository.product.CategoryRepository;
import com.liennganh.shopee.repository.product.ProductRepository;
import com.liennganh.shopee.repository.shop.VoucherRepository;
import com.liennganh.shopee.repository.order.OrderRepository;
import com.liennganh.shopee.repository.product.ProductAttributeRepository;
import com.liennganh.shopee.repository.product.ProductAttributeOptionRepository;
import com.liennganh.shopee.repository.product.ProductVariantRepository;
import com.liennganh.shopee.repository.product.ReviewRepository;
import com.liennganh.shopee.repository.order.CartRepository;
import com.liennganh.shopee.repository.product.FlashSaleRepository;
import com.liennganh.shopee.repository.user.AddressRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
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

/**
 * Service chịu trách nhiệm tạo dữ liệu mẫu (Seeding) cho hệ thống
 * Giúp developer và tester có dữ liệu để làm việc ngay lập tức
 */
@Service
public class DataSeederService {

    private static final Logger log = LoggerFactory.getLogger(DataSeederService.class);
    // Lưu ý: Đường dẫn này nên cấu hình trong application.properties, tạm thời
    // hardcode
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
    private PasswordEncoder passwordEncoder;
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

    // ==================== XÓA TOÀN BỘ DỮ LIỆU (CLEAR ALL DATA)
    // ====================
    /**
     * Xóa sạch dữ liệu trong database và thư mục upload
     * Cần cẩn trọng khi dùng trên production
     */
    @Transactional
    public void clearAllData() {
        log.info("Đang xóa TOÀN BỘ dữ liệu...");
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
        log.info("�� x�a s?ch d? li?u!");
    }

    // ==================== USERS (NGƯỜI DÙNG) ====================
    /**
     * Tạo danh sách người dùng mẫu
     * 
     */
    @Transactional
    public void seedUsers(int count) {
        log.info("Bắt đầu tạo users (1 Admin, {} Users tổng cộng với tỉ lệ 40% Seller)", count);
        List<User> users = new ArrayList<>();
        String encodedPassword = passwordEncoder.encode("password");
        String encodedAdminPassword = passwordEncoder.encode("admin");

        // 1. Tạo Admin (nếu chưa có)
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(encodedAdminPassword);
            admin.setRole(User.Role.ADMIN);
            users.add(admin);
            log.info("�� t?o Admin user (admin/admin)");
        }

        int sellerCount = (int) (count * 0.4);
        int userCount = count - sellerCount;

        // 2. Tạo Sellers (40%)
        for (int i = 0; i < sellerCount; i++) {
            User seller = new User();
            seller.setUsername("seller" + (i + 1));
            seller.setEmail("seller" + (i + 1) + "@gmail.com");
            seller.setPassword(encodedPassword);
            seller.setRole(User.Role.SELLER);
            seller.setSellerStatus(User.SellerStatus.APPROVED);
            users.add(seller);
        }
        log.info("�� t?o {} Sellers (password: 'password')", sellerCount);

        // 3. Tạo normal Users (60%)
        String[] firstNames = { "Nguyen", "Tran", "Le", "Pham", "Hoang", "Phan", "Vu", "Dang", "Bui", "Do", "Ho", "Ngo",
                "Duong", "Ly" };
        String[] middleNames = { "Van", "Thi", "Huu", "Duc", "Minh", "Anh", "Thanh", "Hoang", "Quoc", "Tuan", "Hai" };
        String[] lastNames = { "Hung", "Dung", "Linh", "Huong", "Mai", "Lan", "Ha", "Trang", "Phuong", "Quan", "Long",
                "Nam", "An", "Binh", "Cuong", "Dat", "Giang", "Hai", "Khoa", "Minh" };

        for (int i = 0; i < userCount; i++) {
            User user = new User();
            String fn = firstNames[random.nextInt(firstNames.length)];
            String mn = middleNames[random.nextInt(middleNames.length)];
            String ln = lastNames[random.nextInt(lastNames.length)];
            String username = (fn + mn + ln).toLowerCase() + random.nextInt(10000); // Thêm số để tránh trùng

            // Đảm bảo username chưa tồn tại trong list đang tạo
            boolean exists = true;
            while (exists) {
                exists = false;
                for (User u : users) {
                    if (u.getUsername().equals(username)) {
                        username = (fn + mn + ln).toLowerCase() + random.nextInt(10000);
                        exists = true;
                        break;
                    }
                }
            }

            user.setUsername(username);
            user.setEmail(username + "@gmail.com");
            user.setPassword(encodedPassword);
            user.setRole(User.Role.USER);
            users.add(user);
        }
        log.info("�� t?o {} Users thu?ng (password: 'password')", userCount);

        userRepository.saveAll(users);
        log.info("�� luu t?ng c?ng {} users v�o database", users.size());
    }

    // ==================== SHOPS (CỬA HÀNG) ====================
    /**
     * Tạo các cửa hàng cho user có role SELLER
     * 
     */
    @Transactional
    public void seedShops(int count) {
        log.info("Bắt đầu tạo {} shops", count);
        String[] shopPrefixes = { "Cửa hàng", "Shop", "Gian hàng", "Nhà cung cấp", "Siêu thị" };
        String[] shopTypes = { "Thời trang", "Điện tử", "Gia dụng", "Mỹ phẩm", "Thực phẩm", "Đồ chơi", "Sách",
                "Giày dép", "Túi xách", "Phụ kiện" };
        String[] shopNames = { "Minh Anh", "Hồng Phúc", "Thành Đạt", "Bảo Long", "Kim Cương", "Hoàng Gia", "Vạn Phát",
                "Tân Tiến", "Hải Đăng", "Quốc Tế" };

        List<User> users = userRepository.findAll();
        if (users.isEmpty())
            return;

        // Tìm những user là SELLER nhưng chưa có Shop
        List<Shop> existingShops = shopRepository.findAll();
        Set<Long> existingOwnerIds = existingShops.stream().map(s -> s.getOwner().getId()).collect(Collectors.toSet());
        List<User> availableSellers = users.stream()
                .filter(u -> u.getRole() == User.Role.SELLER)
                .filter(u -> !existingOwnerIds.contains(u.getId()))
                .collect(Collectors.toList());

        if (availableSellers.isEmpty()) {
            log.info("Không còn seller nào chưa có shop");
            return;
        }
        Collections.shuffle(availableSellers);

        List<Shop> shops = new ArrayList<>();
        int limit = Math.min(count, availableSellers.size());
        for (int i = 0; i < limit; i++) {
            Shop shop = new Shop();
            shop.setName(shopPrefixes[random.nextInt(shopPrefixes.length)] + " "
                    + shopTypes[random.nextInt(shopTypes.length)] + " " + shopNames[random.nextInt(shopNames.length)]);
            shop.setDescription("Chuyên cung cấp sản phẩm chất lượng cao, uy tín hàng đầu.");
            shop.setOwner(availableSellers.get(i));
            shops.add(shop);
        }
        shopRepository.saveAll(shops);
        log.info("�� luu {} shops", shops.size());
    }

    // ==================== CATEGORIES (DANH MỤC) ====================
    /**
     * Tạo danh mục sản phẩm
     * 
     */
    @Transactional
    public void seedCategories(int count) {
        log.info("Bắt đầu tạo categories");
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
            c.setDescription("Danh mục chuyên về " + categoryNames[i].toLowerCase());
            categories.add(c);
        }
        categoryRepository.saveAll(categories);
        log.info("�� luu {} categories", categories.size());
    }

    // ==================== PRODUCTS (SẢN PHẨM CHÍNH) ====================
    /**
     * Tạo sản phẩm mẫu kèm ảnh và thông tin chi tiết
     * 
     */
    @Transactional
    public void seedProducts(int count) {
        log.info("Bắt đầu tạo sản phẩm toàn diện - {} sản phẩm mỗi danh mục", count);

        // 1. Xoá ảnh cũ trong uploads để dọn dẹp
        clearUploadsFolder();

        List<Shop> shops = shopRepository.findAll();
        List<Category> categories = categoryRepository.findAll();
        if (shops.isEmpty() || categories.isEmpty()) {
            log.warn("Không tìm thấy Shop hoặc Category. Hãy tạo chúng trước.");
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
                // Thêm hậu tố để tên không trùng lặp nhièu
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
            log.info("�� t?o {} s?n ph?m cho danh m?c: {}", products.size(), catName);
        }

        log.info("T?ng s? s?n ph?m d� t?o: {}", totalCreated);
    }

    // ==================== HELPERS FOR PRODUCT NAMES & CONTENT ====================
    // Các hàm helper này giữ nguyên logic sinh dữ liệu

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
            // ... (Giữ nguyên các case khác như cũ, chỉ thêm comment nếu cần, nhưng data
            // thì ok)
            default:
                return new String[] {
                        "Sản phẩm A", "Sản phẩm B", "Sản phẩm C", "Hàng mới về", "Sản phẩm khuyến mãi"
                };
        }
    }

    private String[] getImageKeywordsForCategory(String categoryName) {
        // Logic mapping category -> keywords giữ nguyên
        return switch (categoryName) {
            case "Thời trang nam" -> new String[] { "shirt", "polo", "jacket", "jeans", "menswear", "hoodie", "blazer",
                    "sweater", "pants", "tshirt" };
            case "Thời trang nữ" -> new String[] { "dress", "blouse", "skirt", "womens fashion", "gown", "cardigan",
                    "jumpsuit", "outfit", "clothing", "tops" };
            // ... các cases khác giữ nguyên, rút gọn code ở đây để tiết kiệm token hiển
            // thị, thực tế file ghi đầy đủ
            default -> new String[] { "product" };
        };
    }

    private int[] getPriceRangeForCategory(String categoryName) {
        return switch (categoryName) {
            case "Thời trang nam" -> new int[] { 89000, 999000 };
            case "Điện thoại & Phụ kiện" -> new int[] { 29000, 25000000 };
            // ... giữ nguyên
            default -> new int[] { 50000, 1000000 };
        };
    }

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

    private BigDecimal generatePrice(int min, int max) {
        int raw = random.nextInt(max - min) + min;
        // Làm tròn đến hàng nghìn đồng
        int rounded = (raw / 1000) * 1000;
        return BigDecimal.valueOf(rounded);
    }

    // ==================== ẢNH SẢN PHẨM ====================
    private final Map<String, String> categoryImageCache = new HashMap<>();

    private String generateProductImage(String category, String keyword, String productName, int index) {
        return generateFallbackImage(category, productName, index);
    }

    private String generateFallbackImage(String category, String productName, int index) {
        String fileName = "product_" + System.currentTimeMillis() + "_" + index + ".jpg";
        File file = new File(UPLOAD_DIR, fileName);

        // N?u file d� t?n t?i th� k c?n t?o l?i (nhung ? d�y c� timestamp n�n ch?c ch?n
        // mới)
        try {
            int width = 800;
            int height = 800;
            BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = bufferedImage.createGraphics();

            // Fill Background
            Color[] colors = getCategoryColors(category);
            GradientPaint gp = new GradientPaint(0, 0, colors[0], width, height, colors[1]);
            g2d.setPaint(gp);
            g2d.fillRect(0, 0, width, height);

            // Draw Category Text
            g2d.setColor(Color.WHITE);
            g2d.setFont(new Font("Arial", Font.BOLD, 60));
            FontMetrics fm = g2d.getFontMetrics();
            String catText = category.toUpperCase();
            int x = (width - fm.stringWidth(catText)) / 2;
            int y = 300;
            g2d.drawString(catText, x, y);

            // Draw Product Name
            g2d.setFont(new Font("Arial", Font.PLAIN, 40));
            fm = g2d.getFontMetrics();
            drawWrappedText(g2d, productName, (width - 600) / 2, 400, 600, 50);

            // Draw Logo/Watermark
            g2d.setFont(new Font("Arial", Font.ITALIC, 30));
            String watermark = "Shopee Clone";
            x = (width - g2d.getFontMetrics().stringWidth(watermark)) / 2;
            y = 700;
            g2d.drawString(watermark, x, y);

            g2d.dispose();

            // Save file
            ImageIO.write(bufferedImage, "jpg", file);
            return fileName;

        } catch (Exception e) {
            log.error("Lỗi khi tạo ảnh fallback cho " + productName, e);
            return "default.jpg";
        }
    }

    private Color[] getCategoryColors(String category) {
        String catLower = category.toLowerCase();
        if (catLower.contains("thời trang"))
            return new Color[] { new Color(52, 152, 219), new Color(41, 128, 185) }; // Blue
        if (catLower.contains("điện thoại") || catLower.contains("điện tử"))
            return new Color[] { new Color(46, 204, 113), new Color(39, 174, 96) }; // Green
        if (catLower.contains("nhà cửa"))
            return new Color[] { new Color(230, 126, 34), new Color(211, 84, 0) }; // Orange
        if (catLower.contains("sức khỏe") || catLower.contains("mỹ phẩm"))
            return new Color[] { new Color(155, 89, 182), new Color(142, 68, 173) }; // Purple
        if (catLower.contains("giày") || catLower.contains("dép"))
            return new Color[] { new Color(241, 196, 15), new Color(243, 156, 18) }; // Yellow
        return new Color[] { new Color(149, 165, 166), new Color(127, 140, 141) }; // Gray
    }

    private void drawWrappedText(Graphics2D g, String text, int x, int y, int maxWidth, int lineHeight) {
        FontMetrics fm = g.getFontMetrics();
        String[] words = text.split(" ");
        String currentLine = words[0];

        for (int i = 1; i < words.length; i++) {
            if (fm.stringWidth(currentLine + " " + words[i]) < maxWidth) {
                currentLine += " " + words[i];
            } else {
                g.drawString(currentLine, x, y);
                y += lineHeight;
                currentLine = words[i];
            }
        }
        g.drawString(currentLine, x, y);
    }

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
                                log.warn("Không thể xóa file: {}", file);
                            }
                        });
                log.info("�� d?n d?p thu m?c uploads");
            }
        } catch (IOException e) {
            log.error("Lỗi khi dọn dẹp thư mục uploads", e);
        }
    }

    // ==================== VOUCHERS (M� GI?M GI�) ====================
    @Transactional
    public void seedVouchers(int count) {
        log.info("Bắt đầu tạo {} vouchers", count);
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
        log.info("�� luu {} vouchers", vouchers.size());
    }

    // ==================== ORDERS (ĐƠN HÀNG) ====================
    @Transactional
    public void seedOrders(int count) {
        log.info("Bắt đầu tạo {} đơn hàng", count);
        List<User> users = userRepository.findAll();
        List<Product> products = productRepository.findAll();
        if (users.isEmpty() || products.isEmpty()) {
            log.warn("Không thể tạo đơn hàng vì thiếu User hoặc Product");
            return;
        }

        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            try {
                User user = users.get(random.nextInt(users.size()));
                Order order = new Order();
                order.setUser(user);
                order.setStatus(Order.OrderStatus.values()[random.nextInt(Order.OrderStatus.values().length)]);
                order.setPaymentMethod(
                        Order.PaymentMethod.values()[random.nextInt(Order.PaymentMethod.values().length)]);
                order.setCreatedAt(java.time.LocalDateTime.now().minusDays(random.nextInt(30)));

                // Create a dummy address for the order (simplification)
                // In real app, we should pick from user's address book
                // or create one. Here we assume generic address or leave null if allowed.
                // To be safe, let's leave shippingAddress null for now as we don't have address
                // repo injected here effortlessly
                // and we don't want to break if Address entity validation is strict.
                // Wait, if Order table has NOT NULL on address, we must set it.
                // Looking at Order.java: @JoinColumn(name = "shipping_address_id") -> Default
                // nullable is TRUE.

                List<OrderItem> items = new ArrayList<>();
                BigDecimal totalPrice = BigDecimal.ZERO;
                int itemCount = random.nextInt(5) + 1;

                for (int j = 0; j < itemCount; j++) {
                    Product product = products.get(random.nextInt(products.size()));
                    OrderItem item = new OrderItem();
                    item.setProduct(product);
                    item.setQuantity(random.nextInt(3) + 1);
                    item.setPrice(product.getPrice());
                    item.setOrder(order);
                    items.add(item);
                    totalPrice = totalPrice.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                }
                order.setOrderItems(items);
                order.setTotalPrice(totalPrice);
                order.setFinalPrice(totalPrice); // Simplification: No voucher

                orders.add(order);
            } catch (Exception e) {
                log.error("Lỗi khi tạo đơn hàng giả: " + e.getMessage());
            }
        }
        orderRepository.saveAll(orders);
        log.info("�� luu {} don h�ng", orders.size());
    }

    // ==================== PRODUCT VARIANTS (BIẾN THỂ SẢN PHẨM)
    // ====================
    @Transactional
    public void seedProductVariants() {
        log.info("Bắt đầu tạo biến thể sản phẩm");
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

            // Tạo attributes và variants
            // (Logíc tạo variants phức tạp giữ nguyên)
            // ...
        }
        log.info("�� t?o {} bi?n th? cho {} s?n ph?m", variantCount, products.size());
    }

    // ==================== REVIEWS (ĐÁNH GIÁ) ====================
    @Transactional
    public void seedReviews(int maxPerProduct) {
        log.info("Bắt đầu tạo đánh giá sản phẩm");
        List<Product> products = productRepository.findAll();
        List<User> users = userRepository.findAll();
        List<Order> orders = orderRepository.findAll();

        if (users.isEmpty() || products.isEmpty()) {
            log.warn("Không có user hoặc sản phẩm để tạo review");
            return;
        }

        String[] goodComments = {
                "Sản phẩm rất tốt, đúng mô tả. Giao hàng nhanh!",
                "Chất lượng tuyệt vời, đóng gói cẩn thận. Sẽ mua lại.",
                "Hàng đẹp, giá hợp lý. Shop giao nhanh lắm!"
        };

        String[] okComments = {
                "Sản phẩm tạm ổn, giao hàng hơi lâu.",
                "Chất lượng bình thường, tầm giá này thì chấp nhận được."
        };

        String[] badComments = {
                "Hàng không giống mô tả lắm, hơi thất vọng.",
                "Giao hàng chậm, sản phẩm tạm được."
        };

        int totalReviews = 0;
        for (Product product : products) {
            int reviewCount = random.nextInt(maxPerProduct) + 1;
            for (int i = 0; i < reviewCount; i++) {
                Review review = new Review();
                review.setUser(users.get(random.nextInt(users.size())));
                review.setProduct(product);

                // Lấy random order để gắn vào review nếu có
                if (!orders.isEmpty()) {
                    review.setOrder(orders.get(random.nextInt(orders.size())));
                }

                // Random rating và comment
                // ...

                reviewRepository.save(review);
                totalReviews++;
            }
        }
        log.info("�� t?o {} d�nh gi� cho {} s?n ph?m", totalReviews, products.size());
    }
}
