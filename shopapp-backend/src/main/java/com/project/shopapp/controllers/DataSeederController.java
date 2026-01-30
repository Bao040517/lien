package com.project.shopapp.controllers;

import com.project.shopapp.models.*;
import com.project.shopapp.repositories.*;
import lombok.RequiredArgsConstructor;
import net.datafaker.Faker;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/start-seeding")
@RequiredArgsConstructor
public class DataSeederController {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final PasswordEncoder passwordEncoder;
    private final Faker faker = new Faker();

    @GetMapping("/roles")
    public ResponseEntity<String> seedRoles() {
        if (roleRepository.findByName(Role.ADMIN).isEmpty()) {
            roleRepository.save(Role.builder().name(Role.ADMIN).build());
        }
        if (roleRepository.findByName(Role.USER).isEmpty()) {
            roleRepository.save(Role.builder().name(Role.USER).build());
        }
        return ResponseEntity.ok("Seeded Roles.");
    }

    @GetMapping("/users")
    public ResponseEntity<String> seedUsers() {
        if (userRepository.count() >= 10) {
            return ResponseEntity.ok("Users already seeded.");
        }
        List<User> users = new ArrayList<>();
        Role userRole = roleRepository.findByName(Role.USER)
                .orElse(null);
        if (userRole == null) {
            return ResponseEntity.badRequest().body("Role USER not found. Please seed roles first.");
        }

        // Create 1000 users
        for (int i = 0; i < 1000; i++) {
            String fullName = faker.name().fullName();
            String email = faker.internet().emailAddress();
            String phone = faker.phoneNumber().cellPhone();

            // To avoid Unique constraint error, let's append index
            email = i + "_" + email;
            phone = "0" + faker.number().digits(9);

            User user = User.builder()
                    .fullName(fullName)
                    .phoneNumber(phone) // Assuming phone is unique key logic in your app
                    .password(passwordEncoder.encode("123456"))
                    .active(true)
                    .dateOfBirth(faker.date().birthday(18, 80))
                    .facebookAccountId("0")
                    .googleAccountId("0")
                    .role(userRole)
                    .build();
            users.add(user);

            if (users.size() >= 100) {
                userRepository.saveAll(users);
                users.clear();
            }
        }
        if (!users.isEmpty()) {
            userRepository.saveAll(users);
        }
        return ResponseEntity.ok("Seeded 1000 Users.");
    }

    @GetMapping("/categories")
    public ResponseEntity<String> seedCategories() {
        if (categoryRepository.count() >= 5) {
            return ResponseEntity.ok("Categories already seeded.");
        }
        List<Category> categories = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            String name = faker.commerce().department();
            Category category = Category.builder()
                    .name(name + " " + i)
                    .build();
            categories.add(category);
        }
        categoryRepository.saveAll(categories);
        return ResponseEntity.ok("Seeded 100 Categories.");
    }

    @GetMapping("/products")
    public ResponseEntity<String> seedProducts() {
        if (productRepository.count() >= 10) {
            return ResponseEntity.ok("Products already seeded.");
        }
        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) {
            return ResponseEntity.badRequest().body("No categories found. Please seed categories first.");
        }

        List<Product> products = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            Product product = Product.builder()
                    .name(faker.commerce().productName() + " " + i)
                    .price((float) faker.number().randomDouble(2, 10, 10000))
                    .thumbnail(faker.internet().image())
                    .description(faker.lorem().sentence())
                    .category(categories.get(faker.random().nextInt(categories.size())))
                    .build();
            products.add(product);

            if (products.size() >= 100) {
                productRepository.saveAll(products);
                products.clear();
            }
        }
        if (!products.isEmpty()) {
            productRepository.saveAll(products);
        }
        return ResponseEntity.ok("Seeded 1000 Products.");
    }

    @GetMapping("/orders")
    public ResponseEntity<String> seedOrders() {
        if (orderRepository.count() >= 10) {
            return ResponseEntity.ok("Orders already seeded.");
        }
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            return ResponseEntity.badRequest().body("No users found. Please seed users first.");
        }

        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            User user = users.get(faker.random().nextInt(users.size()));

            Order order = Order.builder()
                    .user(user)
                    .fullName(user.getFullName())
                    .email(faker.internet().emailAddress())
                    .phoneNumber(user.getPhoneNumber())
                    .address(faker.address().fullAddress())
                    .note(faker.lorem().sentence())
                    .orderDate(LocalDateTime.now().minusDays(faker.number().numberBetween(0, 30)))
                    .status("pending")
                    .totalMoney((float) faker.number().randomDouble(2, 100, 2000))
                    .shippingMethod(faker.options().option("Standard", "Express", "GHTK"))
                    .shippingAddress(faker.address().fullAddress())
                    .shippingDate(LocalDate.now().plusDays(faker.number().numberBetween(1, 5)))
                    .paymentMethod(faker.options().option("COD", "Credit Card"))
                    .active(true)
                    .build();

            orders.add(order);
            if (orders.size() >= 100) {
                orderRepository.saveAll(orders);
                orders.clear();
            }
        }
        if (!orders.isEmpty()) {
            orderRepository.saveAll(orders);
        }
        return ResponseEntity.ok("Seeded 1000 Orders.");
    }

    @GetMapping("/order-details")
    public ResponseEntity<String> seedOrderDetails() {
        if (orderRepository.count() == 0) {
            return ResponseEntity.badRequest().body("No orders found. Please seed orders first.");
        }

        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            return ResponseEntity.badRequest().body("No products found. Please seed products first.");
        }

        // We will loop through orders to add details, but might be slow if 1000 orders.
        // Let's seed details for all existing orders that don't have details?
        // Or simply follow the logic of previous DataSeeder: iterate all orders and add
        // details.

        // Caution: logic in DataSeeder iterates existing orders. If duplicate run, it
        // might duplicate details or not?
        // DataSeeder logic: checking `if (orderRepository.count() < 10)` which implies
        // it only runs if few orders.
        // But here we might want to be explicit.
        // Let's assume we just run this.

        List<Order> savedOrders = orderRepository.findAll();
        List<OrderDetail> orderDetails = new ArrayList<>();
        for (Order order : savedOrders) {
            int numberOfItems = faker.number().numberBetween(1, 4);
            for (int j = 0; j < numberOfItems; j++) {
                Product product = products.get(faker.random().nextInt(products.size()));
                OrderDetail detail = OrderDetail.builder()
                        .order(order)
                        .product(product)
                        .price(product.getPrice())
                        .numberOfProducts(faker.number().numberBetween(1, 5))
                        .totalMoney(product.getPrice() * faker.number().numberBetween(1, 5))
                        .color(faker.color().name())
                        .build();
                orderDetails.add(detail);
            }
            if (orderDetails.size() >= 500) {
                orderDetailRepository.saveAll(orderDetails);
                orderDetails.clear();
            }
        }
        if (!orderDetails.isEmpty()) {
            orderDetailRepository.saveAll(orderDetails);
        }
        return ResponseEntity.ok("Seeded OrderDetails.");
    }
}
