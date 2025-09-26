import React, { useCallback, useMemo } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  PayPalButtonsComponentProps,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

interface PayPalCheckoutProps {
  amount: string;
  course?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

// Separate component to handle the buttons after script loads
const PayPalButtonsWrapper: React.FC<{
  amount: string;
  course?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}> = ({ amount, course, onSuccess, onError }) => {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

  // Memoize the createOrder function to prevent re-renders
  const createOrder = useCallback(async () => {
    try {
      const res = await fetch("/api/payment/paypalCreateOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, course }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create order");
      return data.data.orderId;
    } catch (err) {
      console.error("Error creating PayPal order:", err);
      if (onError) onError(err);
      throw err;
    }
  }, [amount, course, onError]);

  // Memoize the onApprove function
  const handleApprove = useCallback(async (data: any) => {
    try {
      const res = await fetch("/api/payment/paypalcaptureOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderID }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Capture failed");

      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error("Error capturing PayPal order:", err);
      if (onError) onError(err);
    }
  }, [onSuccess, onError]);

  // Memoize the onCancel function
  const handleCancel = useCallback(() => {
    console.log("User cancelled the payment.");
  }, []);

  // Memoize the onError function
  const handleError = useCallback((err: any) => {
    console.error("PayPal error:", err);
    if (onError) onError(err);
  }, [onError]);

  // Memoize button props to prevent re-renders
  const buttonProps: PayPalButtonsComponentProps = useMemo(() => ({
    style: {
      layout: "vertical",
      shape: "rect",
      color: "gold",
      height: 50
    },
    createOrder,
    onApprove: handleApprove,
    onCancel: handleCancel,
    onError: handleError,
  }), [createOrder, handleApprove, handleCancel, handleError]);

  // Show loading state
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading PayPal...</p>
      </div>
    );
  }

  // Show error state
  if (isRejected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="text-red-500 text-xl">⚠️</div>
        <p className="text-red-600 dark:text-red-400 font-medium">Failed to load PayPal</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please refresh the page or try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // Show PayPal buttons when script is loaded successfully
  if (isResolved) {
    // Double check that window.paypal is available
    if (typeof window !== 'undefined' && window.paypal && window.paypal.Buttons) {
      return (
        <div className="paypal-buttons-container w-full">
          <div className="mb-0 text-center">
            {/* <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Complete your payment securely with PayPal
            </p> */}
          </div>
          <PayPalButtons {...buttonProps} key={`paypal-${amount}-${course}`} />
        </div>
      );
    } else {
      // Fallback if window.paypal is still not available
      return (
        // <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
        //   <div className="text-amber-500 text-xl">⚠️</div>
        //   <p className="text-amber-600 dark:text-amber-400 font-medium">PayPal not fully loaded</p>
        //   <p className="text-sm text-gray-600 dark:text-gray-400">
        //     Please wait a moment and try again.
        //   </p>
        //   <button 
        //     onClick={() => window.location.reload()} 
        //     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        //   >
        //     Refresh Page
        //   </button>
        // </div>
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading PayPal...</p>
        </div>
      );
    }
  }

  // Fallback loading state
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-xs"></div>
      <p className="text-gray-600 dark:text-gray-400">Initializing PayPal...</p>
    </div>
  );
};
const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";
const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  amount,
  course,
  onSuccess,
  onError,
}) => {
  // PayPal script provider options - memoized to prevent re-initialization
  const initialOptions = useMemo(() => ({
    clientId: clientId,//ENV
    currency: "USD",
    components: "buttons",
    intent: "capture" as const
  }), []);

  // console.log('PayPalCheckout rendered with:', { amount, course});

  return (
    <div className="w-full min-h-[200px]">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtonsWrapper
          amount={amount}
          course={course}
          onSuccess={onSuccess}
          onError={onError}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalCheckout;