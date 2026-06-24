# komodo

A fullstack learning project for understanding **e-commerce**, **B2B**, and **fintech** concepts by building them from scratch — starting with a B2C payment flow using React, Spring Boot, and Stripe.

---

## Current Module: B2C E-commerce + Payments

The first module covers the core B2C loop:

```
Product Catalog → Cart → Checkout → Payment → Order Confirmation
```

- Browse products from a PostgreSQL-backed catalog
- Add to cart (client-side state with Zustand)
- Create an order and a Stripe PaymentIntent on the backend
- Complete payment using the Stripe Payment Element
- Confirm the order asynchronously via Stripe webhook

---

## Documentation

| Document                             | Description                                                  |
| ------------------------------------ | ------------------------------------------------------------ |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, project structure, and system design decisions   |
| [SETUP.md](./SETUP.md)               | Local environment setup, Docker, env vars, and Stripe config |

---

## Planned Modules

| Module               | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| **1. B2C Payments**  | Product catalog, cart, Stripe checkout, webhook confirmation ← _current_ |
| **2. Auth & Roles**  | JWT-based auth, customer and admin roles                                 |
| **3. B2B**           | Organizations, multi-user accounts, role-based access                    |
| **4. Quotes & POs**  | Pre-order pricing, purchase order approval flows                         |
| **5. Invoicing**     | Invoice generation, net-30/60 terms, payment matching                    |
| **6. CFDI (Mexico)** | Electronic invoice emission via a PAC (e.g. Facturapi)                   |
| **7. Ledger**        | Double-entry accounting basics, reconciliation                           |
| **8. Dunning**       | Failed payment retries and notification flows                            |

---

## License

MIT
