-- ============================================================
-- V1 - Create products table
-- Money is stored in cents (BIGINT) -- never float or decimal
-- ============================================================

CREATE TABLE products
(
    id             BIGSERIAL PRIMARY KEY,
    sku            VARCHAR(100) NOT NULL,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    category       VARCHAR(100) NOT NULL,
    price_in_cents BIGINT       NOT NULL,
    image_url      VARCHAR(500),
    stock_quantity INTEGER      NOT NULL DEFAULT 0,
    active         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_products_sku CHECK (stock_quantity >= 0),
    CONSTRAINT chk_products_price_positive CHECK (price_in_cents > 0)
);

CREATE UNIQUE INDEX uix_products_sku ON products (sku);

-- ============================================================
-- Seed data — development only
-- Categories: electronics, clothing, books
-- ============================================================

INSERT INTO products (sku, name, description, category, price_in_cents, image_url, stock_quantity, active)
VALUES
    -- Electronics
    ('ELEC-001',
     'Mechanical Keyboard TKL',
     'Tenkeyless mechanical keyboard with tactile brown switches. Compact layout ideal for desk setups.',
     'electronics',
     229900,
     'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
     40,
     TRUE),

    ('ELEC-002',
     'Wireless Noise-Cancelling Headphones',
     'Over-ear headphones with active noise cancellation and 30-hour battery life.',
     'electronics',
     189900,
     'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
     25,
     TRUE),

    ('ELEC-003',
     'USB-C 100W GaN Charger',
     'Compact 3-port GaN charger. Charges a laptop, phone, and tablet simultaneously.',
     'electronics',
     89900,
     'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=800',
     100,
     TRUE),

    -- Clothing
    ('CLO-001',
     'Merino Wool Crew Neck',
     'Lightweight 100% merino wool sweater. Temperature-regulating and odor-resistant.',
     'clothing',
     149900,
     'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
     60,
     TRUE),

    ('CLO-002',
     'Slim Fit Chino Pants',
     'Classic slim-fit chinos in stretch cotton. Available in one size for seed purposes.',
     'clothing',
     99900,
     'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
     80,
     TRUE),

    ('CLO-003',
     'Waterproof Shell Jacket',
     '3-layer waterproof and windproof shell jacket. Packable into its own pocket.',
     'clothing',
     349900,
     'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800',
     30,
     TRUE),

    -- Books
    ('BOOK-001',
     'Designing Data-Intensive Applications',
     'The definitive guide to the principles behind reliable, scalable, and maintainable systems. By Martin Kleppmann.',
     'books',
     69900,
     'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
     200,
     TRUE),

    ('BOOK-002',
     'Clean Code',
     'A handbook of agile software craftsmanship by Robert C. Martin. Essential reading for any developer.',
     'books',
     59900,
     'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
     150,
     TRUE),

    ('BOOK-003',
     'The Pragmatic Programmer',
     'From journeyman to master — timeless lessons on software craftsmanship. By Hunt and Thomas.',
     'books',
     64900,
     'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
     0,      -- intentionally out of stock to test that case
     FALSE); -- intentionally inactive to test filtering