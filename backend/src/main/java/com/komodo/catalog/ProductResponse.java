package com.komodo.catalog;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Product returned by the API")
public record ProductResponse(

        @Schema(description = "Unique product identifier", example = "1") Long id,

        @Schema(description = "Stock-keeping unit — unique per product", example = "ELEC-001") String sku,

        @Schema(description = "Display name of the product", example = "Mechanical Keyboard TKL") String name,

        @Schema(description = "Long-form product description") String description,

        @Schema(description = "Product category", example = "electronics") String category,

        // Raw integer cents — formatting to "$229.90 MXN" is the frontend's
        // responsibility
        @Schema(description = "Price in cents — divide by 100 to get the display amount", example = "229900") Long priceInCents,

        @Schema(description = "ISO 4217 currency code", example = "MXN") String currency,

        @Schema(description = "Product image URL") String imageUrl,

        @Schema(description = "Available stock units", example = "40") Integer stockQuantity) {

    // Static factory method — maps a Product entity to this DTO
    static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                product.getCategory(),
                product.getPriceInCents(),
                "MXN",
                product.getImageUrl(),
                product.getStockQuantity());
    }
}