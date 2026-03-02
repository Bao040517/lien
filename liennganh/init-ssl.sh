#!/bin/bash
# Script khởi tạo SSL cho abshoem.id.vn
# Chạy script này MỘT LẦN DUY NHẤT khi deploy lần đầu trên VPS

set -e

DOMAIN="abshoem.id.vn"
EMAIL="your-email@gmail.com"  # ĐỔI EMAIL CỦA BẠN TẠI ĐÂY

echo "=== Bước 1: Khởi động các container (nginx chạy HTTP để Certbot xác minh) ==="
docker compose up -d

echo "=== Bước 2: Đợi nginx khởi động ==="
sleep 5

echo "=== Bước 3: Xin chứng chỉ SSL từ Let's Encrypt ==="
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN

echo "=== Bước 4: Chuyển sang nginx config có SSL ==="
cp nginx-proxy/nginx-ssl.conf nginx-proxy/nginx.conf

echo "=== Bước 5: Reload nginx với SSL ==="
docker compose exec nginx-proxy nginx -s reload

echo ""
echo "=== DONE! Website đã chạy tại https://$DOMAIN ==="
