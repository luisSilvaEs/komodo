package com.komodo.common;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

/**
 * Sets the global Stripe API key once when the application starts.
 *
 * Stripe.apiKey is a static field — setting it once here is the standard
 * pattern for server-side integrations where all requests share one key.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class StripeConfig {

    private final StripeProperties stripeProperties;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeProperties.getSecretKey();
        log.info("Stripe SDK initialized");
    }
}