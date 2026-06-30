package com.komodo.order;

import com.komodo.catalog.Product;
import com.komodo.catalog.ProductRepository;
import com.komodo.common.ResourceNotFoundException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        // 1. Resolve products and validate stock
        List<OrderItemRequest> itemRequests = request.items();

        long totalInCents = 0;
        Order order = new Order();

        for (OrderItemRequest itemRequest : itemRequests) {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found: " + itemRequest.productId()));

            if (product.getStockQuantity() < itemRequest.quantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for product: " + product.getName());
            }

            // 2. Build OrderItem — price is snapshotted from the product at this moment
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.quantity());
            item.setUnitPriceInCents(product.getPriceInCents());

            order.getItems().add(item);
            totalInCents += product.getPriceInCents() * itemRequest.quantity();
        }

        // 3. Save order in PENDING_PAYMENT before calling Stripe
        // If the Stripe call fails, the transaction rolls back cleanly
        order.setTotalInCents(totalInCents);
        order = orderRepository.save(order);

        // 4. Create the Stripe PaymentIntent
        PaymentIntent intent = createPaymentIntent(totalInCents, order.getId());

        // 5. Persist the PaymentIntent ID so the webhook can find this order later
        order.setStripePaymentIntentId(intent.getId());
        orderRepository.save(order);

        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getTotalInCents(),
                intent.getClientSecret());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        // clientSecret is not returned on GET — the frontend already has it from the
        // POST
        return new OrderResponse(order.getId(), order.getStatus(), order.getTotalInCents(), null);
    }

    @Transactional
    public void confirmOrder(String paymentIntentId) {
        Order order = orderRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found for PaymentIntent: " + paymentIntentId));

        // Idempotency guard — Stripe may deliver the same event more than once
        if (order.getStatus() == OrderStatus.CONFIRMED) {
            return;
        }

        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
    }

    private PaymentIntent createPaymentIntent(long amountInCents, Long orderId) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("mxn")
                    // Attach the orderId as metadata so it's visible in the Stripe dashboard
                    .putMetadata("order_id", orderId.toString())
                    // automatic_payment_methods enables the Payment Element to show
                    // the right payment methods for the customer's location automatically
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build())
                    .build();

            return PaymentIntent.create(params);
        } catch (StripeException e) {
            throw new RuntimeException("Failed to create Stripe PaymentIntent", e);
        }
    }
}