import React, { useState, useMemo, useCallback } from "react";
import { ChevronDown, ChevronUp, Loader, CheckCircle, X } from "lucide-react";
import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";
import PayPalCheckout from '../components/PaymentGateways/Paypal';

interface Batch {
  startDate: string;
  instructor: string;
  time: string;
  duration: string;
  seats: number | string;
  type: string;
}

interface FiltersProps {
  onFilterChange: (key: string, value: string) => void;
}

interface TableProps {
  data: Batch[];
  onEnroll: (batch: Batch) => void;
  isDarkMode: boolean;
}

interface EnrollModalProps {
  batch: Batch;
  batches: Batch[];
  onClose: () => void;
  isDarkMode: boolean;
}

interface UpcomingCcieTableProps {
  batches: Batch[];
}

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  planName: string;
  planPrice: string;
}

const countryOptions = [
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

const tableHeaders = ["Class Start Date", "Instructor", "Time Zone", "Duration", "Seats Left", "Action"];

const pricingPlans = [
  { name: "Fast Track", price: "$1,299" },
  { name: "Pro Track", price: "$1,999" },
  { name: "Master Track", price: "$1,999" }
];

type ModalStep = 'form' | 'payment' | 'processing';

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

function Filters({ onFilterChange }: FiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      <select
        className="border p-2 rounded"
        onChange={(e) => onFilterChange("timeZone", e.target.value)}
      >
        <option value="">All Time Zones</option>
        <option value="IST">IST</option>
        <option value="EST">EST</option>
        <option value="GMT">GMT</option>
        <option value="PST">PST</option>
      </select>
    </div>
  );
}

function BatchTable({ data, onEnroll, isDarkMode }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn(
        "min-w-full border-collapse",
        isDarkMode ? "border-gray-600" : "border-gray-300"
      )}>
        <thead
          className={cn(
            "pb-2",
            isDarkMode ? "text-white bg-gray-800" : "text-white bg-gray-600"
          )}
        >
          <tr>
            {tableHeaders.map((header) => (
              <th key={header} className={cn(
                "p-2 text-left border whitespace-nowrap",
                isDarkMode ? "border-gray-600" : "border-gray-300"
              )}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((batch, index) => (
            <tr key={index} className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}>
              <td className={cn(
                "p-2 border",
                isDarkMode ? "border-gray-600" : "border-gray-300"
              )}>{batch.startDate}</td>
              <td className={cn(
                "p-2 border",
                isDarkMode ? "border-gray-600" : "border-gray-300"
              )}>{batch.instructor}</td>
              <td className={cn(
                "p-2 border",
                isDarkMode ? "border-gray-600" : "border-gray-300"
              )}>{batch.time}</td>
              <td className={cn(
                "p-2 border",
                isDarkMode ? "border-gray-600" : "border-gray-300"
              )}>{batch.duration}</td>
              <td className={cn(
                "p-2 border",
                isDarkMode ? "border-gray-600" : "border-gray-300"
              )}>{batch.seats}</td>
              <td className={cn(
                "p-2 border",
                isDarkMode ? "border-gray-600" : "border-gray-300"
              )}>
                <button
                  onClick={() => onEnroll(batch)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Enroll Now
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EnrollModal({ batch, batches, onClose, isDarkMode }: EnrollModalProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryOptions[0].code);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(batch.startDate);
  const [currentStep, setCurrentStep] = useState<ModalStep>('form');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'stripe' | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [contactId, setContactId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string, price: string } | null>(null);

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
    const formValues = Object.fromEntries(formData.entries());

    const submissionData: any = {
      ...formValues,
      countryCode: selectedCountryCode,
      classStartDate: selectedStartDate,
      instructor: batch.instructor,
      // timeZone: batch.time,
      payment_status: "pending",
    };

    setFormData(submissionData);

    try {
      // Step 1: Create contact
      const response = await fetch("/api/hubspot/create-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties: {
            email: submissionData.email,
            firstname: submissionData.name,
            phone: submissionData.phone,
            course_name: selectedPlan?.name || submissionData.plan,
            message: submissionData.message,
            leads_status: 'NEW',
            hs_lead_status: "NEW",
            course_status: 'upcoming',
            payment_status: 'Pending',
            course_start_date: selectedStartDate,
            instructor_name: batch.instructor,
            // time_zone: batch.time
          },
        }),
      });
      const data = await response.json();
      const contactId = data?.data?.id;
      if (!contactId) throw new Error("No contact ID returned from HubSpot");

      setContactId(contactId);

      // Move to payment selection step
      setCurrentStep('payment');

    } catch (err) {
      console.error("Error submitting to HubSpot:", err);
      // alert('Error submitting form. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = useCallback(async (paymentData: any) => {
    if (!contactId || !selectedPlan) return;

    try {
      await fetch(`/api/hubspot/update-contact/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties: {
            leads_status: "ENROLLED",
            hs_lead_status: "Enroll",
            paid_amount: selectedPlan.price.replace(/[^0-9.]/g, ""),
            payment_status: "Completed",
            payment_id: paymentData.data.id,
            payment_type: "paypal",
          },
        }),
      });
      // Show success dialog
      setShowSuccessDialog(true);

    } catch (err) {
      console.error("Error updating enrollment:", err);
      alert('Payment successful but there was an error updating your enrollment. Please contact support.');
    }
  }, [contactId, selectedPlan]);

  const handlePaymentError = useCallback((error: any) => {
    console.error('Payment error:', error);
    alert(`Payment failed ❌ Please try again.`);
  }, []);

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    onClose(); // Close the main enrollment modal
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
            onClick={() => setIsOpen(!isOpen)}
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

      <select
        name="plan"
        className={cn(
          "p-2 rounded border",
          isDarkMode ? "bg-gray-700 text-white border-gray-600"
            : "bg-white text-gray-800 border-gray-300"
        )}
        onChange={(e) => {
          const plan = pricingPlans.find(p => p.price === e.target.value);
          setSelectedPlan(plan || null);
        }}
        required
      >
        <option value="">Choose Pricing Plan</option>
        {pricingPlans.map((plan) => (
          <option key={plan.name} value={plan.price}>
            {plan.name} - {plan.price}
          </option>
        ))}
      </select>

      <select
        name="startDate"
        value={selectedStartDate}
        onChange={(e) => setSelectedStartDate(e.target.value)}
        className={cn(
          "p-2 rounded border",
          isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
        )}
        required
      >
        {batches.map((b, index) => (
          <option key={index} value={b.startDate}>
            {b.startDate}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Message"
        name="message"
        className={cn(
          "p-2 rounded border",
          isDarkMode ? "bg-gray-700 text-white border-gray-600"
            : "bg-white text-gray-800 border-gray-300"
        )}
      />

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
          disabled={isProcessing || !selectedPlan}
        >
          {isProcessing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Payment'
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
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Plan:</span>
                <span className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-800")}>{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Price:</span>
                <span className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-800")}>{selectedPlan?.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Start Date:</span>
                <span className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-800")}>{selectedStartDate}</span>
              </div>
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
    if (selectedPaymentMethod === 'paypal' && selectedPlan) {
      return (
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto p-2 rounded-lg">
          <PayPalCheckout
            amount={selectedPlan.price.replace(/[^0-9.]/g, "")}
            course={selectedPlan.name}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      );
    }

    // If Stripe is selected, show only Stripe UI
    if (selectedPaymentMethod === 'stripe') {
      return (
        <div className="flex flex-col gap-6">
          {/* Order Summary */}
          <div className={cn("p-4 rounded-lg border", isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300")}>
            <h4 className={cn("font-semibold mb-2", isDarkMode ? "text-white" : "text-gray-800")}>Order Summary</h4>
            <div className="flex justify-between items-center">
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{selectedPlan?.name}</span>
              <span className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-800")}>{selectedPlan?.price}</span>
            </div>
          </div>

          {/* Stripe Payment */}
          <div className={cn("p-6 text-center border rounded-lg", isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300")}>
            <div className="mb-4">
              <h4 className={cn("font-medium text-lg", isDarkMode ? "text-white" : "text-gray-800")}>
                💳 Pay with Stripe
              </h4>
              <p className={cn("text-sm mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                Secure payment with credit/debit card
              </p>
            </div>

            <div className={cn("p-4 rounded border", isDarkMode ? "bg-gray-600 border-gray-500" : "bg-white border-gray-300")}>
              <p className={cn("text-sm", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                Stripe integration coming soon...
              </p>
              <p className={cn("text-xs mt-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                Please use PayPal for now or contact support for alternative payment methods.
              </p>
            </div>
          </div>
        </div>
      );
    }
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
            "p-6 rounded-lg w-full max-w-md mx-4",
            isDarkMode ? "bg-gray-800 border border-gray-600" : "bg-gray-100 border-gray-400"
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4 pb-2 border-b flex justify-between",
              isDarkMode ? "text-white border-gray-600" : "text-blue-600 border-gray-300"
            )}
          >
            {currentStep === 'form' ? `Enroll for ${selectedStartDate}` : 'Complete Payment'}
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
        planName={selectedPlan?.name || ''}
        planPrice={selectedPlan?.price || ''}
      />
    </>
  );
}

function UpcomingCcieTable({ batches }: UpcomingCcieTableProps) {
  const { isDarkMode } = useThemeStore();
  const [filters, setFilters] = useState({ timeZone: "", type: "" });
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  const filteredData = useMemo(() => {
    return batches.filter((batch) => {
      return (
        (filters.timeZone ? batch.time.includes(filters.timeZone) : true) &&
        (filters.type ? batch.type === filters.type : true)
      );
    });
  }, [batches, filters.timeZone, filters.type]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleEnroll = useCallback((batch: Batch) => {
    setSelectedBatch(batch);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedBatch(null);
  }, []);

  return (
    <div className="pb-6 max-w-6xl mx-auto">
      <Filters onFilterChange={handleFilterChange} />
      <BatchTable
        data={filteredData}
        onEnroll={handleEnroll}
        isDarkMode={isDarkMode}
      />

      {selectedBatch && (
        <EnrollModal
          batch={selectedBatch}
          batches={batches}
          onClose={handleCloseModal}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default UpcomingCcieTable;