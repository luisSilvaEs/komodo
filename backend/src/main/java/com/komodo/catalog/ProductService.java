package com.komodo.catalog;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Returns only active products — inactive ones are an internal concern
    // and should never be exposed through the public API
    public List<ProductResponse> getActiveProducts() {
        return productRepository.findAllByActiveTrue()
                .stream()
                .map(ProductResponse::from)
                .toList();
    }
}