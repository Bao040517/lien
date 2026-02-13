package com.liennganh.shopee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// Trigger restart for schema update v16
public class ShopeeApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShopeeApplication.class, args);
	}

}
