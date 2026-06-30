package com.komodo.order;

import com.komodo.catalog.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    // Snapshot of the price at the time the order was placed.
    // Products can change price later — we must keep what the customer actually
    // paid.
    @Column(nullable = false)
    private Long unitPriceInCents;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}