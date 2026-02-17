package com.liennganh.shopee.service.shop;

import com.liennganh.shopee.dto.response.*;
import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.*;
import com.liennganh.shopee.repository.user.UserRepository;
import com.liennganh.shopee.repository.shop.ShopRepository;
import com.liennganh.shopee.repository.product.ProductRepository;
import com.liennganh.shopee.repository.order.OrderRepository;
import com.liennganh.shopee.repository.order.OrderItemRepository;
import com.liennganh.shopee.repository.product.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

        private static final Logger log = LoggerFactory.getLogger(StatisticsService.class);

        private final UserRepository userRepository;
        private final ShopRepository shopRepository;
        private final ProductRepository productRepository;
        private final OrderRepository orderRepository;
        private final OrderItemRepository orderItemRepository;
        private final ReviewRepository reviewRepository;

        // Seller Statistics
        public SellerStatisticsDTO getSellerStatistics(Long sellerId) {
                User seller = userRepository.findById(sellerId)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

                if (seller.getRole() != User.Role.SELLER) {
                        throw new AppException(ErrorCode.UNAUTHORIZED);
                }

                Shop shop = shopRepository.findByOwner(seller)
                                .orElseThrow(() -> new AppException(ErrorCode.SHOP_NOT_FOUND));

                SellerStatisticsDTO stats = new SellerStatisticsDTO();

                // Total products
                Long totalProducts = productRepository.countByShop(shop);
                stats.setTotalProducts(totalProducts);

                // Get all orders containing products from this shop
                List<Product> shopProducts = productRepository.findByShop(shop);
                List<Long> productIds = shopProducts.stream().map(Product::getId).collect(Collectors.toList());

                if (productIds.isEmpty()) {
                        // No products, return empty stats
                        stats.setTotalRevenue(BigDecimal.ZERO);
                        stats.setTotalOrders(0L);
                        stats.setPendingOrders(0L);
                        stats.setShippingOrders(0L);
                        stats.setDeliveringOrders(0L);
                        stats.setDeliveredOrders(0L);
                        stats.setCancelledOrders(0L);
                        stats.setTopProducts(new ArrayList<>());
                        stats.setRevenueChart(new ArrayList<>());
                        stats.setOrdersChart(new ArrayList<>());
                        return stats;
                }

                List<OrderItem> orderItems = orderItemRepository.findByProductIdIn(productIds);
                Set<Long> orderIds = orderItems.stream()
                                .map(item -> item.getOrder().getId())
                                .collect(Collectors.toSet());

                List<Order> orders = orderRepository.findAllById(orderIds);

                // Total orders
                stats.setTotalOrders((long) orders.size());

                // Orders by status
                long pending = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.PENDING).count();
                long shipping = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.SHIPPING).count();
                long delivering = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.DELIVERING).count();
                long delivered = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.DELIVERED).count();
                long cancelled = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.CANCELLED).count();

                stats.setPendingOrders(pending);
                stats.setShippingOrders(shipping);
                stats.setDeliveringOrders(delivering);
                stats.setDeliveredOrders(delivered);
                stats.setCancelledOrders(cancelled);

                // Total revenue (only from delivered orders)
                BigDecimal totalRevenue = orderItems.stream()
                                .filter(item -> item.getOrder().getStatus() == Order.OrderStatus.DELIVERED)
                                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                stats.setTotalRevenue(totalRevenue);

                // Top products
                Map<Long, TopProductDTO> productStatsMap = new HashMap<>();
                for (OrderItem item : orderItems) {
                        if (item.getOrder().getStatus() == Order.OrderStatus.DELIVERED) {
                                Long productId = item.getProduct().getId();
                                TopProductDTO productDTO = productStatsMap.getOrDefault(productId,
                                                new TopProductDTO(productId, item.getProduct().getName(), 0L,
                                                                BigDecimal.ZERO));

                                productDTO.setTotalSold(productDTO.getTotalSold() + item.getQuantity());
                                productDTO.setRevenue(productDTO.getRevenue().add(
                                                item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))));

                                productStatsMap.put(productId, productDTO);
                        }
                }

                List<TopProductDTO> topProducts = productStatsMap.values().stream()
                                .sorted((a, b) -> b.getTotalSold().compareTo(a.getTotalSold()))
                                .limit(10)
                                .collect(Collectors.toList());
                stats.setTopProducts(topProducts);

                // --- Chi tiết từng sản phẩm (tính từ OrderItem + Review) ---
                // Tạo map productId -> sold (từ OrderItem DELIVERED)
                Map<Long, Long> soldMap = new HashMap<>();
                for (OrderItem item : orderItems) {
                        if (item.getOrder().getStatus() == Order.OrderStatus.DELIVERED) {
                                Long pid = item.getProduct().getId();
                                soldMap.merge(pid, (long) item.getQuantity(), Long::sum);
                        }
                }

                // Lấy tất cả reviews của shop
                List<Review> shopReviews = reviewRepository.findByProductShopId(shop.getId());

                // Tạo map productId -> reviewCount
                Map<Long, Long> reviewCountMap = new HashMap<>();
                Map<Long, List<Integer>> reviewRatingsMap = new HashMap<>();
                for (Review review : shopReviews) {
                        Long pid = review.getProduct().getId();
                        reviewCountMap.merge(pid, 1L, Long::sum);
                        reviewRatingsMap.computeIfAbsent(pid, k -> new ArrayList<>()).add(review.getRating());
                }

                // Build productDetailStats cho TẤT CẢ sản phẩm của shop
                List<ProductDetailStatsDTO> detailStats = new ArrayList<>();
                for (Product p : shopProducts) {
                        long pSold = soldMap.getOrDefault(p.getId(), 0L);
                        long pReviews = reviewCountMap.getOrDefault(p.getId(), 0L);
                        double pAvgRating = 0.0;
                        if (reviewRatingsMap.containsKey(p.getId())) {
                                List<Integer> ratings = reviewRatingsMap.get(p.getId());
                                pAvgRating = ratings.stream().mapToInt(Integer::intValue).average().orElse(0.0);
                                pAvgRating = Math.round(pAvgRating * 10.0) / 10.0;
                        }
                        detailStats.add(new ProductDetailStatsDTO(
                                        p.getId(), p.getName(), p.getImageUrl(),
                                        p.getPrice(), p.getStockQuantity(),
                                        pSold, pReviews, pAvgRating));
                }
                stats.setProductDetailStats(detailStats);

                // Tổng số lượng đã bán
                long totalSold = orderItems.stream()
                                .filter(item -> item.getOrder().getStatus() == Order.OrderStatus.DELIVERED)
                                .mapToLong(OrderItem::getQuantity)
                                .sum();
                stats.setTotalSold(totalSold);

                // Tổng số feedback (đánh giá)
                long totalFeedback = shopReviews.size();
                stats.setTotalFeedback(totalFeedback);

                // Tỷ lệ hoàn hàng/hủy
                double returnRate = orders.isEmpty() ? 0.0
                                : (double) cancelled / orders.size() * 100;
                stats.setReturnRate(Math.round(returnRate * 10.0) / 10.0);

                // Điểm đánh giá trung bình của shop
                Double avgRating = reviewRepository.getAverageRatingByShopId(shop.getId());
                stats.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);

                // --- Chart Data ---
                List<Object[]> revenueData = orderRepository.getSellerRevenueByDate(shop.getId());
                stats.setRevenueChart(mapToChartData(revenueData));

                List<Object[]> ordersData = orderRepository.getSellerOrdersByDate(shop.getId());
                stats.setOrdersChart(mapToChartData(ordersData));

                return stats;
        }

        // Admin Statistics
        public AdminStatisticsDTO getAdminStatistics() {
                AdminStatisticsDTO stats = new AdminStatisticsDTO();

                // Total counts
                stats.setTotalUsers(userRepository.countByRole(User.Role.USER));
                stats.setTotalSellers(userRepository.countByRole(User.Role.SELLER));
                stats.setTotalProducts(productRepository.count());
                stats.setTotalOrders(orderRepository.count());

                // Seller status counts
                stats.setPendingSellers(
                                userRepository.countByRoleAndSellerStatus(User.Role.SELLER, User.SellerStatus.PENDING));
                stats.setApprovedSellers(
                                userRepository.countByRoleAndSellerStatus(User.Role.SELLER,
                                                User.SellerStatus.APPROVED));
                stats.setRejectedSellers(
                                userRepository.countByRoleAndSellerStatus(User.Role.SELLER,
                                                User.SellerStatus.REJECTED));
                stats.setSuspendedSellers(
                                userRepository.countByRoleAndSellerStatus(User.Role.SELLER,
                                                User.SellerStatus.SUSPENDED));

                // Total revenue (delivered orders only)
                List<Order> deliveredOrders = orderRepository.findByStatus(Order.OrderStatus.DELIVERED);
                BigDecimal totalRevenue = deliveredOrders.stream()
                                .map(Order::getFinalPrice)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                stats.setTotalRevenue(totalRevenue);

                // Orders by status
                Map<String, Long> ordersByStatus = new HashMap<>();
                for (Order.OrderStatus status : Order.OrderStatus.values()) {
                        long count = orderRepository.countByStatus(status);
                        ordersByStatus.put(status.name(), count);
                }
                stats.setOrdersByStatus(ordersByStatus);

                // Top sellers
                List<Shop> allShops = shopRepository.findAll();
                List<TopSellerDTO> topSellers = new ArrayList<>();

                for (Shop shop : allShops) {
                        List<Product> shopProducts = productRepository.findByShop(shop);
                        List<Long> productIds = shopProducts.stream().map(Product::getId).collect(Collectors.toList());

                        if (!productIds.isEmpty()) {
                                List<OrderItem> items = orderItemRepository.findByProductIdIn(productIds);
                                long totalOrders = items.stream()
                                                .map(item -> item.getOrder().getId())
                                                .distinct()
                                                .count();

                                BigDecimal revenue = items.stream()
                                                .filter(item -> item.getOrder()
                                                                .getStatus() == Order.OrderStatus.DELIVERED)
                                                .map(item -> item.getPrice()
                                                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                                topSellers.add(new TopSellerDTO(shop.getOwner().getId(), shop.getName(), totalOrders,
                                                revenue));
                        }
                }

                topSellers = topSellers.stream()
                                .sorted((a, b) -> b.getRevenue().compareTo(a.getRevenue()))
                                .limit(10)
                                .collect(Collectors.toList());
                stats.setTopSellers(topSellers);

                // Top products (system-wide)
                List<OrderItem> allItems = orderItemRepository.findAll();
                Map<Long, TopProductDTO> productStatsMap = new HashMap<>();

                for (OrderItem item : allItems) {
                        if (item.getOrder().getStatus() == Order.OrderStatus.DELIVERED) {
                                Long productId = item.getProduct().getId();
                                TopProductDTO productDTO = productStatsMap.getOrDefault(productId,
                                                new TopProductDTO(productId, item.getProduct().getName(), 0L,
                                                                BigDecimal.ZERO));

                                productDTO.setTotalSold(productDTO.getTotalSold() + item.getQuantity());
                                productDTO.setRevenue(productDTO.getRevenue().add(
                                                item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))));

                                productStatsMap.put(productId, productDTO);
                        }
                }

                List<TopProductDTO> topProducts = productStatsMap.values().stream()
                                .sorted((a, b) -> b.getTotalSold().compareTo(a.getTotalSold()))
                                .limit(10)
                                .collect(Collectors.toList());
                stats.setTopProducts(topProducts);

                // --- Chart Data ---
                List<Object[]> revenueData = orderRepository.getSystemRevenueByDate();
                stats.setRevenueChart(mapToChartData(revenueData));

                List<Object[]> ordersData = orderRepository.getSystemOrdersByDate();
                stats.setOrdersChart(mapToChartData(ordersData));

                return stats;
        }

        // Helper to convert Object[] from repository to ChartDataDTO
        private List<ChartDataDTO> mapToChartData(List<Object[]> data) {
                return data.stream()
                                .map(row -> {
                                        String date = row[0].toString();
                                        BigDecimal value;
                                        if (row[1] instanceof BigDecimal) {
                                                value = (BigDecimal) row[1];
                                        } else if (row[1] instanceof Long) {
                                                value = BigDecimal.valueOf((Long) row[1]);
                                        } else {
                                                value = BigDecimal.ZERO;
                                        }
                                        return new ChartDataDTO(date, value);
                                })
                                .collect(Collectors.toList());
        }
}
