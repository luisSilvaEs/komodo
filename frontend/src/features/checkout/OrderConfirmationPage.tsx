import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStatus } from "../../api/useOrderStatus";
import { useCartStore } from "../../features/cart/cartStore";

const OrderConfirmationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const orderId = id ? parseInt(id, 10) : null;

  const { data: order, isError } = useOrderStatus(orderId);

  // Clear the cart as soon as the order is confirmed
  useEffect(() => {
    if (order?.status === "CONFIRMED") {
      clearCart();
    }
  }, [order?.status, clearCart]);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">Could not retrieve your order.</p>
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

  // Polling — waiting for the webhook to confirm the order
  if (!order || order.status === "PENDING_PAYMENT") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (order.status === "CONFIRMED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-md text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Order confirmed!
          </h1>
          <p className="text-gray-500">
            Your order{" "}
            <span className="font-medium text-gray-700">#{order.orderId}</span>{" "}
            has been received and confirmed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 inline-block bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  // CANCELLED or REFUNDED
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-md text-center space-y-4">
        <div className="text-5xl">❌</div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment not completed
        </h1>
        <p className="text-gray-500">
          Your order was not confirmed. No charge was made.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-block bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Go back to the store
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
