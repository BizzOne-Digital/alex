/**
 * Payment provider interface (not wired to a live gateway).
 *
 * The shop currently supports catalogue browsing, cart, and product quote
 * requests stored in MongoDB. When Stripe or Square credentials are available,
 * implement this interface and call it from a checkout route — do not add a
 * fake “payment successful” page until a real provider is connected.
 *
 * Suggested integration steps:
 * 1. Add STRIPE_SECRET_KEY / SQUARE_ACCESS_TOKEN to .env
 * 2. Implement createCheckoutSession() for purchasable products
 * 3. Add webhook route to mark orders paid
 * 4. Keep requestQuote products on the quote-request workflow
 */

export type CheckoutLineItem = {
  productId: string;
  name: string;
  quantity: number;
  unitAmountCents: number;
  image?: string;
};

export type CheckoutSessionInput = {
  items: CheckoutLineItem[];
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

export type CheckoutSessionResult = {
  provider: "stripe" | "square" | "none";
  sessionId: string;
  url: string;
};

export interface PaymentProvider {
  readonly name: "stripe" | "square" | "none";
  isEnabled(): boolean;
  createCheckoutSession(
    input: CheckoutSessionInput,
  ): Promise<CheckoutSessionResult>;
}

/** Placeholder provider — quote workflow remains the default. */
export const nullPaymentProvider: PaymentProvider = {
  name: "none",
  isEnabled: () => false,
  async createCheckoutSession() {
    throw new Error(
      "No payment provider configured. Use the product quote-request workflow or implement Stripe/Square.",
    );
  },
};
