import React, { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const stripeKey = import.meta.env.VITE_STRPE_PUBLIHED_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// ✅ Success Dialog Component
const SuccessDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  paymentIntent: any;
}> = ({ isOpen, onClose, paymentIntent }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/welcome-onboard");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-11/12 text-center shadow-lg border border-gray-200">
        <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-gray-800 text-2xl font-bold mb-2">🎉 Congratulations!</h2>
        <p className="text-green-500 text-lg font-semibold mb-6">Payment Successful!</p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="text-gray-700 font-semibold mb-3 text-base">Transaction Details</h3>
          <div className="text-gray-500 text-sm">
            <div className="mb-2">
              <strong>Amount:</strong> ${(paymentIntent.amount / 100).toFixed(2)}
            </div>
            {paymentIntent.description && (
              <div>
                <strong>Course:</strong> {paymentIntent.description}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 px-8 font-semibold w-full transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// ✅ Checkout Form
const CheckoutForm: React.FC<{
  clientSecret: string;
  email: string;
  onPaymentSuccess: (paymentIntent: any) => void;
}> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage("");

    try {
      // ✅ Construct return URL for redirect-based payment methods
      const baseUrl = window.location.origin;
      const returnUrl = `${baseUrl}/payment-success`;

      // ✅ Allow redirects for Amazon Pay, Cash App Pay, etc.
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        redirect: "if_required", // This allows card payments to work inline
      });

      if (error) {
        setMessage(error.message || "An error occurred");
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // For non-redirect payments (like cards)
        onPaymentSuccess(paymentIntent);
        setIsLoading(false);
      }
      // For redirect payments, user will be redirected automatically
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <PaymentElement />
      {message && <div className="text-red-500 mt-4 text-sm">{message}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`mt-6 py-3 px-4 rounded-lg text-white w-full font-semibold transition-colors ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Processing Payment..." : "Pay Now"}
      </button>
    </form>
  );
};

// ✅ Main Stripe Component
const Stripe: React.FC<any> = ({
  contactId,
  amount,
  course,
  email,
  firstname,
  course_name,
  course_plan,
  form_name,
  utm_url,
  phone,
  message,
  instructor_name,
  course_start_date,
  course_status,
  duration,
  course_start_time,
  course_time_zone,
  onClick
}) => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentIntentData, setPaymentIntentData] = useState<any>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      setLoading(true);
      setError("");

      try {
        // Store enrollment data for use after redirect
        const enrollmentData = {
          contactId,
          email,
          firstname,
          phone,
          course_name,
          course_plan,
          form_name,
          utm_url,
          message,
          course_status,
          course_time_zone,
          course_start_time,
          instructor_name,
          course_start_date,
          duration,
        };
        sessionStorage.setItem("enrollmentData", JSON.stringify(enrollmentData));

        const response = await fetch("/api/payment/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            course,
          }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (data.status === "Success" && data.data.clientSecret) {
          setClientSecret(data.data.clientSecret);
        } else {
          throw new Error(data.message || "Failed to create payment intent");
        }
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (amount && course) createPaymentIntent();
  }, [amount, course, contactId, email, firstname, phone, course_name, course_plan, form_name, utm_url, message, course_status, course_time_zone, course_start_time, instructor_name, course_start_date, duration]);

  const handlePaymentSuccess = useCallback(async (paymentIntent: any) => {
    setPaymentIntentData(paymentIntent);
    setShowSuccessDialog(true);
    if (!contactId) return;

    try {
      await fetch(`/api/hubspot/update-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hubspot: {
            contactId,
            email,
            firstname,
            phone,
            course_name,
            course_plan,
            form_name,
            utm_url,
            message,
            course_status,
            course_time_zone,
            course_start_time,
            leads_status: "ENROLLED",
            hs_lead_status: "Enroll",
            paid_amount: amount,
            payment_status: "Completed",
            payment_id: paymentIntent.id,
            payment_type: "stripe",
            instructor_name,
            course_start_date,
          },
          email: {
            name: firstname,
            email,
            packageName: course_name,
            utm_url,
            course_plan,
            form_name,
            duration,
          },
        }),
      });
    } catch (err) {
      console.error("Error updating enrollment:", err);
      alert(
        "Payment successful but there was an error updating your enrollment. Please contact support."
      );
    }
  }, [contactId, amount, firstname, email, course_name, duration, utm_url, form_name, course_plan, phone, message, course_status, course_time_zone, course_start_time, instructor_name, course_start_date]);

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    setPaymentIntentData(null);
    setClientSecret("");
    if (onClick) onClick();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading Stripe...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <span className="text-red-700 font-semibold">Payment Setup Failed</span>
          </div>
          <p className="text-red-600 text-sm mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!clientSecret)
    return (
      <div className="p-6 text-center text-gray-600">
        Unable to setup payment. Please try again.
      </div>
    );

  return (
    <div className="p-4">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: { colorPrimary: "#2563eb" },
          },
        }}
      >
        <CheckoutForm
          clientSecret={clientSecret}
          onPaymentSuccess={handlePaymentSuccess}
          email={email!}
        />
      </Elements>

      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={handleCloseDialog}
        paymentIntent={paymentIntentData}
      />
    </div>
  );
};

export default Stripe;