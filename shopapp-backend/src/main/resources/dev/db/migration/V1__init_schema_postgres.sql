-- Schema PostgreSQL tương đương database.sql (ShopApp)
-- Thứ tự tạo bảng đảm bảo khóa ngoại

-- 1. roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);

-- 2. categories (name UNIQUE theo V1)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE
);

-- 3. users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fullname VARCHAR(100) DEFAULT '',
  phone_number VARCHAR(15),
  address VARCHAR(200) DEFAULT '',
  password CHAR(60) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  date_of_birth DATE,
  facebook_account_id VARCHAR(100),
  google_account_id VARCHAR(100),
  role_id INTEGER DEFAULT 1 REFERENCES roles(id),
  email VARCHAR(255) DEFAULT '',
  profile_image VARCHAR(255) DEFAULT ''
);

-- 4. tokens (is_mobile, refresh_token, refresh_expiration_date đã có)
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  token_type VARCHAR(50) NOT NULL,
  expiration_date TIMESTAMP,
  revoked BOOLEAN NOT NULL,
  expired BOOLEAN NOT NULL,
  user_id INTEGER REFERENCES users(id),
  is_mobile BOOLEAN DEFAULT false,
  refresh_token VARCHAR(255) DEFAULT '',
  refresh_expiration_date TIMESTAMP
);

-- 5. social_accounts
CREATE TABLE social_accounts (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(20) NOT NULL,
  provider_id VARCHAR(50) NOT NULL,
  email VARCHAR(150) NOT NULL,
  name VARCHAR(100) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);

-- 6. products (price DECIMAL, thumbnail VARCHAR(255) theo V1)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(350),
  price DECIMAL(10,2),
  thumbnail VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  category_id INTEGER REFERENCES categories(id)
);

-- 7. product_images
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(300)
);

-- 8. comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  user_id INTEGER REFERENCES users(id),
  content VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 9. coupons
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

-- 10. orders (status VARCHAR thay cho MySQL ENUM)
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  fullname VARCHAR(100) DEFAULT '',
  email VARCHAR(100) DEFAULT '',
  phone_number VARCHAR(20) NOT NULL,
  address VARCHAR(200) NOT NULL,
  note VARCHAR(100) DEFAULT '',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  total_money DOUBLE PRECISION,
  shipping_method VARCHAR(100),
  shipping_address VARCHAR(200),
  shipping_date DATE,
  tracking_number VARCHAR(100),
  payment_method VARCHAR(100),
  active BOOLEAN,
  coupon_id INTEGER REFERENCES coupons(id),
  vnp_txn_ref VARCHAR(255)
);

-- 11. order_details (price, number_of_products, total_money theo V1)
CREATE TABLE order_details (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  price DECIMAL(10,2),
  number_of_products INTEGER DEFAULT 1,
  total_money DECIMAL(10,2) DEFAULT 0,
  color VARCHAR(20) DEFAULT '',
  coupon_id INTEGER REFERENCES coupons(id)
);

-- 12. coupon_conditions
CREATE TABLE coupon_conditions (
  id SERIAL PRIMARY KEY,
  coupon_id INTEGER NOT NULL REFERENCES coupons(id),
  attribute VARCHAR(255) NOT NULL,
  operator VARCHAR(10) NOT NULL,
  value VARCHAR(255) NOT NULL,
  discount_amount DECIMAL(5,2) NOT NULL
);

-- 13. favorites
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id)
);

-- Indexes
CREATE INDEX idx_tokens_user_id ON tokens(user_id);
CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_comments_product_id ON comments(product_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_coupon_id ON orders(coupon_id);
CREATE INDEX idx_order_details_order_id ON order_details(order_id);
CREATE INDEX idx_order_details_product_id ON order_details(product_id);
CREATE INDEX idx_order_details_coupon_id ON order_details(coupon_id);
CREATE INDEX idx_coupon_conditions_coupon_id ON coupon_conditions(coupon_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);
CREATE INDEX idx_users_role_id ON users(role_id);

-- Seed: roles (user, admin)
INSERT INTO roles (id, name) VALUES (1, 'user'), (2, 'admin');
SELECT setval('roles_id_seq', 2);

-- Seed: categories (như database.sql)
INSERT INTO categories (name) VALUES
  ('Đồ điện tử'),
  ('Bánh kẹo'),
  ('Đồ gia dụng'),
  ('Chăn ga gối đệm'),
  ('Quần áo'),
  ('Phụ kiện');

-- Seed: coupons (HEAVEN, DISCOUNT20)
INSERT INTO coupons (code, active) VALUES ('HEAVEN', true), ('DISCOUNT20', true);

-- Seed: coupon_conditions (như database.sql)
INSERT INTO coupon_conditions (coupon_id, attribute, operator, value, discount_amount) VALUES
  (1, 'minimum_amount', '>', '100', 10.00),
  (1, 'applicable_date', 'BETWEEN', '2023-12-25', 5.00);
