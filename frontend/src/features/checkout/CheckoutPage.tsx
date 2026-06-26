import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "../../features/cart/cartStore";
import { useCreateOrder } from "../../api/useCreateOrder";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Inner form — must live inside <Elements> to access useStripe and useElements
function PaymentForm({ orderId }: { orderId: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe redirects here after payment — we pass orderId so the confirmation
        // page knows which order to poll for
        return_url: `${window.location.origin}/order/${orderId}/confirmation`,
      },
    });

    // confirmPayment only returns here if there was an error (e.g. card declined).
    // On success, Stripe redirects the user to return_url before this line runs.
    if (error) {
      setErrorMessage(error.message ?? "Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

// Outer page — creates the order and provides the clientSecret to <Elements>
const CheckoutPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const { mutate: createOrder, isPending, isError } = useCreateOrder();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    // Guard: if the cart is empty, send the user back to the catalog
    if (items.length === 0) {
      navigate("/");
      return;
    }

    createOrder(
      {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: (order) => {
          setClientSecret(order.clientSecret);
          setOrderId(order.orderId);
        },
      },
    );
    // Run once on mount — items won't change while the user is on this page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPending || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Preparing your order...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">
            Something went wrong creating your order.
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-indigo-600 underline"
          >
            Go back to the store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Checkout</h1>

        {/* clientSecret must be set before mounting Elements — Stripe uses it to
            initialise the PaymentIntent and render the correct payment methods */}
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm orderId={orderId!} />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;
