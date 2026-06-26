CREATE TYPE order_status AS ENUM (
    'PENDING_PAYMENT',
    'CONFIRMED',
    'CANCELLED',
    'REFUNDED'
);

CREATE TABLE orders (
    id                       BIGSERIAL PRIMARY KEY,
    status                   order_status        NOT NULL DEFAULT 'PENDING_PAYMENT',
    total_in_cents           BIGINT              NOT NULL,
    stripe_payment_intent_id VARCHAR(255)        UNIQUE,
    created_at               TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMP           NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id                 BIGSERIAL PRIMARY KEY,
    order_id           BIGINT  NOT NULL REFERENCES orders(id),
    product_id         BIGINT  NOT NULL REFERENCES products(id),
    quantity           INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_in_cents BIGINT NOT NULL,
    created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_orders_stripe_payment_intent_id ON orders(stripe_payment_intent_id);

ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;
ALTER TABLE orders ALTER COLUMN status TYPE VARCHAR(50) USING status::text;
DROP TYPE order_status;