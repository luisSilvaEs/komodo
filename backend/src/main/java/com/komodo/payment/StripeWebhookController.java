package com.komodo.payment;

import com.komodo.order.OrderService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    private final OrderService orderService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    // Spring normally parses the request body as JSON, but Stripe's signature
    // verification requires the raw bytes exactly as they arrived over the wire.
    // @RequestBody byte[] prevents any deserialization that would alter the
    // payload.
    @PostMapping(value = "/stripe", consumes = "application/json")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;

        // Step 1: Verify the signature — reject anything that doesn't pass
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.warn("Stripe webhook signature verification failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        // Step 2: Route by event type — only handle what we care about
        switch (event.getType()) {
            case "payment_intent.succeeded" -> handlePaymentIntentSucceeded(event);
            default -> log.debug("Unhandled Stripe event type: {}", event.getType());
        }

        // Always return 200 to Stripe after processing — otherwise Stripe retries
        return ResponseEntity.ok("Received");
    }

    private void handlePaymentIntentSucceeded(Event event) {
        Optional<StripeObject> stripeObject = event.getDataObjectDeserializer().getObject();

        if (stripeObject.isEmpty()) {
            log.error("Could not deserialize PaymentIntent from event {}", event.getId());
            return;
        }

        PaymentIntent intent = (PaymentIntent) stripeObject.get();
        log.info("PaymentIntent succeeded: {}", intent.getId());

        orderService.confirmOrder(intent.getId());
    }
}