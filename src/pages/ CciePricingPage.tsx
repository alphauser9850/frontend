import React, { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PricingPlan {
    tierName: string;
    tierSubtitle: string;
    price: string;
    pricePeriod: string;
    durationBadge: string;
    features: string[];
    buttonText: string;
    buttonClass: string;
    paymentOptions: string;
    popular?: boolean;
}

interface PricingPageProps {
    pricingPlans?: PricingPlan[];
}

interface PricingCardProps extends PricingPlan {
    onPlanSelect: (planName: string, planPrice: string) => void;
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

interface EnrollModalProps {
    selectedPlan: string;
    selectedPlanPrice: string;
    onClose: () => void;
    isDarkMode: boolean;
}

function EnrollModal({ selectedPlan, selectedPlanPrice, onClose, isDarkMode }: EnrollModalProps) {
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryOptions[0].code);
    const [isOpen, setIsOpen] = useState(false);

    React.useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formValues = Object.fromEntries(formData.entries());

        const submissionData: any = {
            ...formValues,
            countryCode: selectedCountryCode,
            selectedPlan: selectedPlan,
            payment_status: "pending",
        };

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
                        course: submissionData.course,
                        message: submissionData.message,
                    },
                }),
            });

            const data = await response.json();
            console.log("Contact created:", data);

            const contactId = data?.data?.id;
            if (!contactId) throw new Error("No contact ID returned from HubSpot");

            // Step 2: Associate contact to course
            await fetch("/api/hubspot/associate-contact-to-course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputs: [
                        {
                            from: { id: "154816229108" }, // course record ID
                            to: { id: contactId },
                            type: "contact_to_course_1",
                        },
                    ],
                }),
            });

            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            // Step 3: Create enrollment
            const enrollmentResponse = await fetch("/api/hubspot/create-enrollment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    properties: {
                        lead_status: 'NEW',
                        course_status: "OnGoing",
                        email: submissionData.email,
                        enrollment_name: submissionData.name,
                        contact_no: submissionData.phone,
                        course_name: submissionData.course,
                        message: submissionData.message,
                        payment_status: "pending",
                        enrollment_date: today.toISOString(),
                    },
                }),
            });

            const enrollmentData = await enrollmentResponse.json();
            console.log("Enrollment created:", enrollmentData);

            const enrollmentId = enrollmentData?.data?.id;
            if (!enrollmentId) throw new Error("No enrollment ID returned from HubSpot");

            // Step 4: Update enrollment after payment
            await fetch(`/api/hubspot/update-enrollment/${enrollmentId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    properties: {
                        lead_status: "ENROLLED",
                        course_status: "OnGoing",
                        email: submissionData.email,
                        enrollment_name: submissionData.name,
                        contact_no: submissionData.phone,
                        course_name: submissionData.course,
                        message: submissionData.message,
                        paid_amount: selectedPlanPrice.replace(/[^0-9.]/g, ""),
                        payment_status: "completed",
                        enrollment_date: today.toISOString(),
                        payment_id: "11124",
                        payment_type: 'paypal',
                    },
                }),
            });
        } catch (err) {
            console.error("Error submitting to HubSpot:", err);
        }
    };

    return (
        <div
            className={cn(
                "fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50",
                isDarkMode ? "bg-opacity-50" : "bg-opacity-40"
            )}
        >
            <div
                className={cn(
                    "p-6 rounded-lg w-96",
                    isDarkMode ? "bg-gray-800 border border-gray-600" : "bg-gray-100 border-gray-400"
                )}
            >
                <h3
                    className={cn(
                        "text-lg font-semibold mb-4 pb-2",
                        isDarkMode ? "text-white" : "text-blue-600"
                    )}
                >
                    Enroll in {selectedPlan}
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                            className="px-4 py-2 rounded bg-red-500 text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const CciePricingPage: React.FC<PricingPageProps> = ({ pricingPlans: propPricingPlans }) => {
    const { isDarkMode } = useThemeStore();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [selectedPlanPrice, setSelectedPlanPrice] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const pricingPlans = propPricingPlans || [];

    const handlePlanSelect = (planName: string, planPrice: string) => {
        setSelectedPlan(planName);
        setSelectedPlanPrice(planPrice);
        setShowModal(true);
    };

    const handleLabAccessSelect = (hours: number, price: string) => {
        setSelectedPlan(`Lab Access only - ${hours}h`);
        setSelectedPlanPrice(price);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPlan(null);
        setSelectedPlanPrice(null);
    };

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
        paymentOptions,
        onPlanSelect
    }) => {
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
                    onClick={() => onPlanSelect(tierName, price)}
                >
                    {buttonText}
                </button>

                <div className={cn("text-center text-sm mt-4", isDarkMode ? "text-gray-400" : "text-gray-600")} dangerouslySetInnerHTML={{ __html: paymentOptions }} />
            </div>
        );
    };

    return (
        <div className={cn("min-h-screen p-4")}>
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center text-white mb-12 ">
                    {/* Success Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className={cn("backdrop-blur-sm rounded-xl p-6 shadow-xl border ", isDarkMode ? "bg-black text-white border-gray-100/20 " : "bg-white text-blue-600")}>
                            <div className="text-2xl font-bold">Highest</div>
                            <div className={cn("text-sm opacity-80 ", isDarkMode ? " text-white" : " text-gray-600")}>Pass Rate</div>
                        </div>
                        <div className={cn("backdrop-blur-sm rounded-xl p-6 shadow-xl border ", isDarkMode ? "bg-black text-white border-gray-100/20 " : "bg-white text-blue-600")}>
                            <div className="text-2xl font-bold">500+</div>
                            <div className={cn("text-sm opacity-80 ", isDarkMode ? " text-white" : " text-gray-600")}>Certified Students</div>
                        </div>
                        <div className={cn("backdrop-blur-sm rounded-xl p-6 shadow-xl border ", isDarkMode ? "bg-black text-white border-gray-100/20 " : "bg-white text-blue-600")}>
                            <div className="text-2xl font-bold">24/7</div>
                            <div className={cn("text-sm opacity-80 ", isDarkMode ? " text-white" : " text-gray-600")}>Expert Support</div>
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
  {/* Title */}
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

  {/* Options */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* 10 Hours */}
    <div
      className={cn(
        "p-6 rounded-xl border shadow-md hover:shadow-lg transition flex flex-col items-center cursor-pointer",
        isDarkMode
          ? "bg-gray-900 border-gray-700 hover:border-blue-500"
          : "bg-gray-50 border-gray-200 hover:border-blue-600"
      )}
      onClick={() => handleLabAccessSelect(10, "200")}
    >
      <span className='bg-blue-100 text-blue-700 px-1 rounded'>Duration: 10 hours</span>
      <div
        className={cn(
          "text-3xl font-bold mt-2",
          isDarkMode ? "text-white" : "text-blue-600"
        )}
      >
        $200
      </div>
      <button className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
        Choose Plan
      </button>
    </div>

    {/* 25 Hours */}
    <div
      className={cn(
        "p-6 rounded-xl border shadow-md hover:shadow-lg transition flex flex-col items-center cursor-pointer",
        isDarkMode
          ? "bg-gray-900 border-gray-700 hover:border-blue-500"
          : "bg-gray-50 border-gray-200 hover:border-blue-600"
      )}
      onClick={() => handleLabAccessSelect(25, "450")}
    >
      <span className='bg-blue-100 text-blue-700 px-1 rounded'>Duration: 25 hours</span>
      <div
        className={cn(
          "text-3xl font-bold mt-2",
          isDarkMode ? "text-white" : "text-blue-600"
        )}
      >
        $450
      </div>
      <button className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
        Choose plan
      </button>
    </div>
  </div>
</div>

                {/* Guarantee Section */}
                <div className={cn("rounded-2xl p-8 text-center shadow-xl mt-12", isDarkMode ? "bg-black text-white border-gray-100/20" : "bg-white text-gray-900")}>
                    <h3 className={cn("text-2xl font-bold mb-4", isDarkMode ? "text-white" : "text-gray-800")}>🛡️ 1-Week Money-Back Guarantee</h3>
                    <p className={cn(isDarkMode ? "text-gray-300" : "text-gray-600")}>
                        Not satisfied with your training? Get a full refund within 1-Week, no questions asked.
                        We're confident in our training quality and your success.
                    </p>
                </div>
            </div>

            {showModal && selectedPlan && selectedPlanPrice && (
                <EnrollModal
                    selectedPlan={selectedPlan}
                    selectedPlanPrice={selectedPlanPrice}
                    onClose={handleCloseModal}
                    isDarkMode={isDarkMode}
                />
            )}
        </div>
    );
};

export default CciePricingPage;
