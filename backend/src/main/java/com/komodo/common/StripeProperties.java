package com.komodo.common;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binds the stripe.* block from application.yml into a typed Spring bean.
 *
 * Usage: inject StripeProperties wherever you need the keys,
 * rather than scattering @Value annotations across the codebase.
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "stripe")
public class StripeProperties {

    /** sk_test_... — used to authenticate calls to the Stripe API */
    private String secretKey;

    /** whsec_... — used to verify webhook signature on incoming Stripe events */
    private String webhookSecret;
}