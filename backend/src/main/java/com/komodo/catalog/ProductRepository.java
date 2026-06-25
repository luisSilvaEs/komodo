package com.komodo.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Derived query — Spring Data generates the SQL from the method name:
    // SELECT * FROM products WHERE active = true
    List<Product> findAllByActiveTrue();
}