package com.komodo.order;

public record OrderResponse(
        Long orderId,
        OrderStatus status,
        Long totalInCents,
        String clientSecret // null for GET requests after payment is complete
) {
}