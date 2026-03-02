#!/bin/bash
# Script gia hạn SSL tự động
# Thêm vào crontab: 0 3 * * 1 /path/to/renew-ssl.sh

docker compose run --rm certbot renew
docker compose exec nginx-proxy nginx -s reload
