import React, { useState, useCallback } from 'react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';
import { ChevronDown, ChevronUp, Loader, CheckCircle, X } from 'lucide-react';
import PayPalCheckout from '../components/PaymentGateways/Paypal';
import Stripe from '../components/PaymentGateways/Stripe';
import {  useNavigate } from 'react-router-dom';

interface PricingPlan {
  tierName: string;
  tierSubtitle: string;
  price: string;
  pricePeriod: string;
  durationBadge: string;
  features: string[];
  buttonText: string;
  buttonClass: string;
  popular?: boolean;
  duration?: string;
}

interface PricingPageProps {
  pricingPlans?: PricingPlan[];
}

interface PricingCardProps extends PricingPlan {
  onPlanSelect: (planName: string, planPrice: string, duration?: string) => void;
}

interface CountryOption {
  code: string;
  name: string;
  short: string;
}

const countryOptions: CountryOption[] = [
  { code: "+1", name: "United States", short: "US" },
  { code: "+91", name: "India", short: "IN" },
  { code: "+44", name: "United Kingdom", short: "GB" },
  { code: "+81", name: "Japan", short: "JP" },
  { code: "+86", name: "China", short: "CN" },
  { code: "+49", name: "Germany", short: "DE" },
  { code: "+33", name: "France", short: "FR" },
  { code: "+61", name: "Australia", short: "AU" },
  { code: "+65", name: "Singapore", short: "SG" },
  { code: "+971", name: "UAE", short: "AE" },
];

interface EnrollModalProps {
  selectedPlan: string;
  selectedPlanPrice: string;
  selectedPlanDuration?: string;
  onClose: () => void;
  isDarkMode: boolean;
}

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  planName: string;
  planPrice: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  course: string;
  message?: string;
  price: string;
}

// Success Dialog Component
function SuccessDialog({ isOpen, onClose, isDarkMode, planName, planPrice }: SuccessDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div
        className={cn(
          "p-8 rounded-2xl w-full max-w-md mx-4 text-center relative",
          isDarkMode ? "bg-gray-800 border border-gray-600" : "bg-white border-gray-200"
        )}
      >
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition",
            isDarkMode ? "hover:bg-gray-700 text-gray-400" : "text-gray-600"
          )}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className={cn("text-2xl font-bold mb-2", isDarkMode ? "text-white" : "text-gray-800")}>
            Payment Successful! 🎉
          </h3>
          <p className={cn("text-lg", isDarkMode ? "text-gray-300" : "text-gray-600")}>
            Welcome to {planName}
          </p>
        </div>

        <div className={cn("p-4 rounded-lg border mb-6", isDarkMode ? "bg-gray-700 border-gray-600" : "bg-green-50 border-green-200")}>
          <div className="flex justify-between items-center">
            <span className={cn("font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>Amount Paid:</span>
            <span className={cn("font-bold text-lg", isDarkMode ? "text-green-400" : "text-green-600")}>{planPrice}</span>
          </div>
        </div>

        <div className={cn("text-sm mb-6", isDarkMode ? "text-gray-400" : "text-gray-600")}>
          <p>✅ Your enrollment has been confirmed</p>
          <p>✅ You will receive access details via email shortly</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

type ModalStep = 'form' | 'payment' | 'processing';

function EnrollModal({ selectedPlan, selectedPlanPrice, selectedPlanDuration, onClose, isDarkMode }: EnrollModalProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(countryOptions[0].code);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>('form');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'stripe' | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData.entries()) as unknown as FormData;

    const submissionData: FormData & { countryCode: string; selectedPlan: string; payment_status: string } = {
      ...formValues,
      countryCode: selectedCountryCode,
      selectedPlan: selectedPlan,
      payment_status: "pending",
    };

    setFormData(formValues);
    const fullPhoneNumber = `${selectedCountryCode}${formValues.phone}`;

    try {
      // Step 1: Check if contact already exists using your existing get-contact endpoint
      const checkContactResponse = await fetch("/api/hubspot/get-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: submissionData.email
                }
              ]
            }
          ],
          properties: ["firstname", "lastname", "email", "phone", "id"]
        }),
      });

      if (!checkContactResponse.ok) {
        throw new Error(`HTTP error! status: ${checkContactResponse.status}`);
      }

      const checkContactData = await checkContactResponse.json();

      let contactId: string;

      // If contact exists, use the existing contact ID
      if (checkContactData.data && checkContactData.data.results && checkContactData.data.results.length > 0) {
        contactId = checkContactData.data.results[0].id;
        console.log("Contact already exists with ID:", contactId);
      } else {
        // If contact doesn't exist, create a new one
        const createContactResponse = await fetch("/api/hubspot/create-contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            properties: {
              email: submissionData.email,
              firstname: submissionData.name,
              phone: fullPhoneNumber,
              course_name: submissionData.course,
              message: submissionData.message || '',
              leads_status: 'NEW',
              hs_lead_status: "NEW",
              course_status: 'ongoing',
              payment_status: 'Pending'
            },
          }),
        });

        if (!createContactResponse.ok) {
          throw new Error(`HTTP error! status: ${createContactResponse.status}`);
        }

        const createContactData = await createContactResponse.json();
        contactId = createContactData?.data?.id;

        if (!contactId) throw new Error("No contact ID returned from HubSpot");
        console.log("New contact created with ID:", contactId);
      }

      setContactId(contactId);

      // Move to payment selection step
      setCurrentStep('payment');

    } catch (err) {
      console.error("Error processing contact:", err);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = useCallback(async (paymentData: any) => {
    if (!contactId || !formData) return;

    try {
      const fullPhoneNumber = `${selectedCountryCode}${formData.phone}`;

      await fetch(`/api/hubspot/update-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hubspot: {
            contactId: contactId,
            email: formData.email,
            firstname: formData.name,
            phone: fullPhoneNumber,
            course_name: formData.course,
            message: formData.message || '',
            course_status: 'ongoing',
            leads_status: "ENROLLED",
            hs_lead_status: "Enroll",
            paid_amount: selectedPlanPrice.replace(/[^0-9.]/g, ""),
            payment_status: "Completed",
            payment_id: paymentData.data?.id || paymentData.id,
            payment_type: selectedPaymentMethod,
          },
          email: {
            name: formData.name,
            email: formData.email,
            packageName: formData.course,
            duration: selectedPlanDuration
          }
        }),
      });
      // Show success dialog
      setShowSuccessDialog(true);

    } catch (err) {
      console.error("Error updating enrollment:", err);
      alert('Payment successful but there was an error updating your enrollment. Please contact support.');
    }
  }, [contactId, selectedPlanPrice, selectedPlanDuration, formData, selectedPaymentMethod, selectedCountryCode]);

  const handlePaymentError = useCallback((error: any) => {
    console.error('Payment error:', error);
    alert(`Payment failed ❌ Please try again.`);
  }, []);

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/welcome-onboard");
    onClose();
  };

  const renderFormStep = () => (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Name"
        className={cn(
          "p-2 rounded border",
          isDarkMode ? "bg-gray-700 text-white border-gray-600"
            : "bg-white text-gray-800 border-gray-300"
        )}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className={cn(
          "p-2 rounded border",
          isDarkMode ? "bg-gray-700 text-white border-gray-600"
            : "bg-white border-gray-300 text-gray-800"
        )}
        required
      />

      {/* Phone with country code */}
      <div className="flex items-center rounded-lg overflow-hidden w-full max-w-sm shadow-sm">
        <div className="relative w-1/2">
          <select
            className={cn(
              "block w-full p-2 appearance-none outline-none cursor-pointer border",
              isDarkMode ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"
            )}
            required
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          >
            {countryOptions.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code} ({country.short})
              </option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            {isOpen ? (
              <ChevronUp className={cn("w-4 h-4", isDarkMode ? "text-gray-300" : "text-gray-800")} />
            ) : (
              <ChevronDown className={cn("w-4 h-4", isDarkMode ? "text-gray-300" : "text-gray-800")} />
            )}
          </span>
        </div>
        <div className={cn("h-6 border-l", isDarkMode ? "border-gray-600" : "border-gray-300")}></div>
        <input
          type="tel"
          name="phone"
          placeholder="91234 56789"
          className={cn(
            "flex-1 px-3 py-2 outline-none border border-l-0",
            isDarkMode ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-800 border-gray-300"
          )}
          maxLength={10}
          pattern="[0-9]{8,10}"
          required
        />
      </div>

      {/* Selected course */}
      <input
        type="text"
        name="course"
        value={selectedPlan}
        className={cn(
          "p-2 rounded border",
          isDarkMode ? "bg-gray-700 text-white border-gray-600"
            : "bg-white text-gray-800 border-gray-300"
        )}
        readOnly
      />

      <input type="hidden" name="price" value={selectedPlanPrice} />

      <textarea
        name="message"
        placeholder="Message"
        className={cn(
          "p-2 rounded border",
          isDarkMode ? "bg-gray-700 text-white border-gray-600"
            : "bg-white text-gray-800 border-gray-300"
        )}
      ></textarea>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed'
          )}
        </button>
      </div>
    </form>
  );

  const renderPaymentStep = () => {
    // If no payment method is selected, show selection
    if (!selectedPaymentMethod) {
      return (
        <div className="flex flex-col gap-6">
          {/* Order Summary */}
          <div className={cn("p-4 rounded-lg border", isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300")}>
            <h4 className={cn("font-semibold mb-2", isDarkMode ? "text-white" : "text-gray-800")}>Order Summary</h4>
            <div className="flex justify-between items-center">
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{selectedPlan}</span>
              <span className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-800")}>{selectedPlanPrice}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h4 className={cn("font-semibold mb-3", isDarkMode ? "text-white" : "text-gray-800")}>Select Payment Method</h4>
            <div className="space-y-3">
              <label className={cn("flex items-center p-3 border rounded-lg cursor-pointer transition",
                isDarkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"
              )}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as 'paypal')}
                  className="mr-3"
                />
                <span className={isDarkMode ? "text-white" : "text-gray-800"}>PayPal</span>
              </label>

              <label className={cn("flex items-center p-3 border rounded-lg cursor-pointer transition",
                isDarkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"
              )}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as 'stripe')}
                  className="mr-3"
                />
                <span className={isDarkMode ? "text-white" : "text-gray-800"}>Stripe</span>
              </label>
            </div>
          </div>
        </div>
      );
    }

    // If PayPal is selected, show only PayPal UI
    if (selectedPaymentMethod === 'paypal') {
      return (
        <div className="flex flex-col gap-6 overflow-y-auto p-2 rounded-lg">
          <PayPalCheckout
            amount={selectedPlanPrice.replace(/[^0-9.]/g, "")}
            course={selectedPlan}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      );
    }

    // If Stripe is selected, show only Stripe UI
    if (selectedPaymentMethod === 'stripe' && formData) {
      const fullPhoneNumber = `${selectedCountryCode}${formData.phone}`;

      return (
        <div className="flex flex-col gap-6 max-h-[30rem] overflow-y-auto p-2 rounded-lg">
          <Stripe
            contactId={Number(contactId)}
            amount={Number(selectedPlanPrice.replace(/[^0-9.]/g, ""))}
            course={selectedPlan}
            course_status='ongoing'
            email={formData.email}
            firstname={formData.name}
            phone={fullPhoneNumber}
            course_name={formData.course}
            message={formData.message || ''}
            onClick={onClose}
            duration={selectedPlanDuration}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50",
          isDarkMode ? "bg-opacity-50" : "bg-opacity-40"
        )}
      >
        <div
          className={cn(
            "p-6 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto",
            isDarkMode ? "bg-gray-800 border border-gray-600" : "bg-gray-100 border-gray-400"
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4 pb-2 border-b flex justify-between",
              isDarkMode ? "text-white border-gray-600" : "text-blue-600 border-gray-300"
            )}
          >
            {currentStep === 'form' ? `Enroll in ${selectedPlan}` : 'Complete Payment'}

            {currentStep === "payment" && !selectedPaymentMethod && (
              <button
                type="button"
                onClick={onClose}
                className="px-2 py-0 text-base rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Cancel
              </button>
            )}
            {currentStep === 'payment' && selectedPaymentMethod && (
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod(null)}
                title='Change payment method'
                className="p-0.5 px-4 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
              >
                <span className='text-xl font-bold'>←</span>
              </button>
            )}
          </h3>
          {currentStep === 'form' && renderFormStep()}
          {currentStep === 'payment' && renderPaymentStep()}
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        isDarkMode={isDarkMode}
        planName={selectedPlan}
        planPrice={selectedPlanPrice}
      />
    </>
  );
}

// Pricing Card Component
const PricingCard: React.FC<PricingCardProps> = ({
  tierName,
  tierSubtitle,
  price,
  pricePeriod,
  durationBadge,
  features,
  buttonText,
  buttonClass,
  popular = false,
  duration,
  onPlanSelect
}) => {
  const { isDarkMode } = useThemeStore();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className={cn(
        "rounded-2xl p-8 md:p-10 shadow-xl relative transition-all duration-300 ease-in-out border",
        isDarkMode ? "bg-black text-white border-gray-100/20" : "bg-white text-gray-900"
      )}
      style={{
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 30px 60px rgba(0,0,0,0.15)' : '0 20px 40px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
          Most Popular
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className={cn("text-2xl font-bold mb-2", isDarkMode ? "text-white" : "text-gray-800")}>{tierName}</h3>
        <p className={cn("mb-4", isDarkMode ? "text-gray-300" : "text-gray-600")}>{tierSubtitle}</p>
        <div className={cn("text-4xl font-bold", isDarkMode ? "text-white" : "text-gray-800")}>{price}</div>
        <div className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-600")}>{pricePeriod}</div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold inline-block mt-5">
          {durationBadge}
        </div>
      </div>

      <ul className="my-8 space-y-4">
        {features.map((feature: string, index: number) => (
          <li key={index} className={cn("flex items-start py-3 border-b last:border-b-0", isDarkMode ? "border-gray-600" : "border-gray-100")}>
            <span className="text-green-500 font-bold mr-3 text-lg">✓</span>
            <span className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")} dangerouslySetInnerHTML={{ __html: feature }} />
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-4 rounded-xl font-semibold text-white uppercase tracking-wider transition-all duration-300 ${buttonClass} hover:shadow-xl hover:-translate-y-1`}
        onClick={() => onPlanSelect(tierName, price, duration)}
      >
        {buttonText}
      </button>
    </div>
  );
};

const CciePricingPage: React.FC<PricingPageProps> = ({ pricingPlans: propPricingPlans }) => {
  const { isDarkMode } = useThemeStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<string | null>(null);
  const [selectedPlanDuration, setSelectedPlanDuration] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const pricingPlans = propPricingPlans || [];

  const handlePlanSelect = (planName: string, planPrice: string, duration?: string) => {
    setSelectedPlan(planName);
    setSelectedPlanPrice(planPrice);
    setSelectedPlanDuration(duration || "Not specified");
    setShowModal(true);
  };

  const handleLabAccessSelect = (hours: number, price: string) => {
    setSelectedPlan(`Lab Access only - ${hours}h`);
    setSelectedPlanPrice(price);
    setSelectedPlanDuration(`${hours} hours`);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setSelectedPlanPrice(null);
    setSelectedPlanDuration(null);
  };

  return (
    <div className={cn("min-h-screen p-4", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Success Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className={cn("backdrop-blur-sm rounded-xl p-6 shadow-xl border", isDarkMode ? "bg-black text-white border-gray-100/20" : "bg-white text-blue-600")}>
              <div className="text-2xl font-bold">Highest</div>
              <div className={cn("text-sm opacity-80", isDarkMode ? "text-white" : "text-gray-600")}>Pass Rate</div>
            </div>
            <div className={cn("backdrop-blur-sm rounded-xl p-6 shadow-xl border", isDarkMode ? "bg-black text-white border-gray-100/20" : "bg-white text-blue-600")}>
              <div className="text-2xl font-bold">500+</div>
              <div className={cn("text-sm opacity-80", isDarkMode ? "text-white" : "text-gray-600")}>Certified Students</div>
            </div>
            <div className={cn("backdrop-blur-sm rounded-xl p-6 shadow-xl border", isDarkMode ? "bg-black text-white border-gray-100/20" : "bg-white text-blue-600")}>
              <div className="text-2xl font-bold">24/7</div>
              <div className={cn("text-sm opacity-80", isDarkMode ? "text-white" : "text-gray-600")}>Expert Support</div>
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan: PricingPlan, index: number) => (
            <PricingCard key={index} {...plan} onPlanSelect={handlePlanSelect} />
          ))}
        </div>

        {/* Lab Access Card */}
        <div
          className={cn(
            "rounded-2xl p-8 text-center shadow-xl border",
            isDarkMode ? "bg-black text-white border-gray-100/20" : "bg-white text-gray-900"
          )}
        >
          <h3
            className={cn(
              "text-3xl font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-800"
            )}
          >
            Lab Access Only
          </h3>
          <p
            className={cn(
              "text-base mb-8",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}
          >
            Flexible hours — pay only for what you need
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              className={cn(
                "p-6 rounded-xl border shadow-md hover:shadow-lg transition flex flex-col items-center cursor-pointer",
                isDarkMode
                  ? "bg-gray-900 border-gray-700 hover:border-blue-500"
                  : "bg-gray-50 border-gray-200 hover:border-blue-600"
              )}
              onClick={() => handleLabAccessSelect(10, "$199")}
            >
              <span className='bg-blue-100 text-blue-700 px-1 rounded'>Duration: 10 hours</span>
              <div
                className={cn(
                  "text-3xl font-bold mt-2",
                  isDarkMode ? "text-white" : "text-blue-600"
                )}
              >
                $199
              </div>
              <button className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                Choose Plan
              </button>
            </div>

            <div
              className={cn(
                "p-6 rounded-xl border shadow-md hover:shadow-lg transition flex flex-col items-center cursor-pointer",
                isDarkMode
                  ? "bg-gray-900 border-gray-700 hover:border-blue-500"
                  : "bg-gray-50 border-gray-200 hover:border-blue-600"
              )}
              onClick={() => handleLabAccessSelect(25, "$499")}
            >
              <span className='bg-blue-100 text-blue-700 px-1 rounded'>Duration: 30 hours</span>
              <div
                className={cn(
                  "text-3xl font-bold mt-2",
                  isDarkMode ? "text-white" : "text-blue-600"
                )}
              >
                $499
              </div>
              <button className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                Choose plan
              </button>
            </div>
          </div>
        </div>
      </div>

      

      {showModal && selectedPlan && selectedPlanPrice && (
        <EnrollModal
          selectedPlan={selectedPlan}
          selectedPlanPrice={selectedPlanPrice}
          selectedPlanDuration={selectedPlanDuration || undefined}
          onClose={handleCloseModal}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default CciePricingPage;