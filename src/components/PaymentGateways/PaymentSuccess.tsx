import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripeKey = import.meta.env.VITE_STRPE_PUBLIHED_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const clientSecret = searchParams.get("payment_intent_client_secret");
      const paymentIntentId = searchParams.get("payment_intent");

      if (!clientSecret || !paymentIntentId) {
        setStatus("error");
        setMessage("Payment information not found in URL");
        return;
      }

      try {
        const stripe = await stripePromise;
        if (!stripe) {
          setStatus("error");
          setMessage("Failed to load Stripe");
          return;
        }

        // Retrieve the PaymentIntent to check its status
        const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret);

        if (error) {
          setStatus("error");
          setMessage(error.message || "Failed to retrieve payment information");
          return;
        }

        if (!paymentIntent) {
          setStatus("error");
          setMessage("Payment not found");
          return;
        }

        setPaymentDetails(paymentIntent);

        switch (paymentIntent.status) {
          case "succeeded":
            setStatus("success");
            setMessage("Your payment was successful!");
            
            // Update HubSpot and send email
            await updateEnrollment(paymentIntent);
            
            // Redirect after 3 seconds
            setTimeout(() => {
              navigate("/welcome-onboard");
            }, 3000);
            break;

          case "processing":
            setStatus("loading");
            setMessage("Your payment is being processed. Please wait...");
            // Check again after a few seconds
            setTimeout(() => {
              window.location.reload();
            }, 3000);
            break;

          case "requires_payment_method":
            setStatus("error");
            setMessage("Your payment was not successful. Please try again.");
            break;

          default:
            setStatus("error");
            setMessage("Something went wrong with your payment.");
            break;
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        setStatus("error");
        setMessage("An error occurred while verifying your payment");
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  const updateEnrollment = async (paymentIntent: any) => {
    try {
      // Get stored enrollment data from sessionStorage or URL params
      const enrollmentData = sessionStorage.getItem("enrollmentData");
      
      if (!enrollmentData) {
        console.warn("No enrollment data found in sessionStorage");
        return;
      }

      const data = JSON.parse(enrollmentData);

      await fetch("/api/hubspot/update-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hubspot: {
            contactId: data.contactId,
            email: data.email,
            firstname: data.firstname,
            phone: data.phone,
            course_name: data.course_name,
            course_plan: data.course_plan,
            form_name: data.form_name,
            utm_url: data.utm_url,
            message: data.message,
            course_status: data.course_status,
            course_time_zone: data.course_time_zone,
            course_start_time: data.course_start_time,
            leads_status: "ENROLLED",
            hs_lead_status: "Enroll",
            paid_amount: paymentIntent.amount / 100,
            payment_status: "Completed",
            payment_id: paymentIntent.id,
            payment_type: "stripe",
            instructor_name: data.instructor_name,
            course_start_date: data.course_start_date,
          },
          email: {
            name: data.firstname,
            email: data.email,
            packageName: data.course_name,
            utm_url: data.utm_url,
            course_plan: data.course_plan,
            form_name: data.form_name,
            duration: data.duration,
          },
        }),
      });

      // Clear the stored data
      sessionStorage.removeItem("enrollmentData");
    } catch (err) {
      console.error("Error updating enrollment:", err);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">{message || "Please wait while we confirm your payment..."}</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-red-700 text-2xl font-bold mb-2 text-center">Payment Failed</h2>
          <p className="text-red-600 text-center mb-6">{message}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Payment Successful!</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        {paymentDetails && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-gray-700 font-semibold mb-3">Transaction Details</h3>
            <div className="text-gray-600 text-sm space-y-2">
              <div>
                <strong>Amount:</strong> ${(paymentDetails.amount / 100).toFixed(2)}
              </div>
              <div>
                <strong>Payment ID:</strong> {paymentDetails.id}
              </div>
              {paymentDetails.description && (
                <div>
                  <strong>Course:</strong> {paymentDetails.description}
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-gray-500 text-sm">Redirecting you to your course...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;