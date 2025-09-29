import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";
import { PopupModal } from "react-calendly";
import { useState } from "react";
import { ChevronDown, ChevronUp, Loader } from "lucide-react";

// Country code options
const countryOptions = [
    { code: "+1", short: "US" },
    { code: "+91", short: "IN" },
    { code: "+44", short: "UK" },
    { code: "+81", short: "JP" },
    { code: "+86", short: "CN" },
    { code: "+49", short: "DE" },
    { code: "+61", short: "AU" },
    { code: "+971", short: "AE" },
    { code: "+65", short: "SG" },
    { code: "+60", short: "MY" },
];

const CCIeDemoMeeting = () => {
    const { isDarkMode } = useThemeStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryOptions[0].code);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const clendely_id = import.meta.env.VITE_CLENDELY_ID || "";

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        message: "",
        course_name: "",
        leads_status: "NEW",
        hs_lead_status: "NEW",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
        if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        if (!formData.course_name) newErrors.course_name = "Course selection is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleScheduleClick = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Save contact to HubSpot with full phone number (country code + number)
            const fullPhone = `${selectedCountryCode}${formData.phone}`;

            const res = await fetch("/api/hubspot/create-contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    properties: {
                        ...formData,
                        phone: fullPhone, // Save with country code
                    }
                }),
            });

            if (res.ok) {
                // Close modal and open Calendly
                setIsModalOpen(false);
                setIsCalendlyOpen(true);
            } else {
                const errorData = await res.json();
                console.error("HubSpot create contact failed:", errorData);
                alert("Failed to save contact. Please try again.");
            }
        } catch (err) {
            console.error("API error:", err);
            alert("An error occurred. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        // Reset form
        setFormData({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            message: "",
            course_name: "",
            leads_status: "NEW",
            hs_lead_status: "NEW",
        });
        setErrors({});
        setSelectedCountryCode(countryOptions[0].code);
    };

    const handleCalendlyClose = () => {
        setIsCalendlyOpen(false);
        // Reset form data after Calendly closes
        setFormData({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            message: "",
            course_name: "",
            leads_status: "NEW",
            hs_lead_status: "NEW",
        });
    };

    return (
        <>
            <section
                className={cn(
                    "px-4 py-12 space-y-16 transition-colors duration-300",
                    isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
                )}
            >
                <div
                    className={cn(
                        "p-8 rounded-xl max-w-6xl mx-auto text-center shadow-md transition-colors duration-300",
                        isDarkMode
                            ? "bg-gray-800 border border-gray-700"
                            : "bg-purple-50 border border-purple-100"
                    )}
                >
                    <h2
                        className={cn(
                            "text-3xl lg:text-4xl font-bold mb-4",
                            isDarkMode ? "text-white" : "text-gray-700"
                        )}
                    >
                        Schedule a Demo Session
                    </h2>
                    <p className={cn("mb-6", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                        Ready to explore our courses? Schedule a personalized demo session with our experts.
                    </p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    >
                        Schedule Demo
                    </button>
                </div>
            </section>

            {/* Demo Booking Modal */}
            {isModalOpen && (
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
                                "text-lg font-semibold mb-4 pb-2 border-b",
                                isDarkMode ? "text-white border-gray-600" : "text-blue-600 border-gray-300"
                            )}
                        >
                            Schedule a Demo Session
                        </h3>

                        <form onSubmit={handleScheduleClick} className="flex flex-col gap-4">
                            {/* Show info banner only when all required fields are filled */}
                            {formData.firstname &&
                                formData.lastname &&
                                formData.email &&
                                formData.phone &&
                                formData.course_name && (
                                    <div className={cn(
                                        "p-3 rounded-lg mb-2 text-sm",
                                        isDarkMode ? "bg-blue-900/30 border border-blue-700 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-800"
                                    )}>
                                        ℹ️ Your details will be prefilled in the scheduling form. Please do not modify them.
                                    </div>
                                )}

                            <div>
                                <input
                                    type="text"
                                    name="firstname"
                                    placeholder="First Name *"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                    className={cn(
                                        "w-full p-2 rounded border",
                                        errors.firstname ? "border-red-500" : "",
                                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                                    )}
                                />
                                {errors.firstname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Last Name *"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                    className={cn(
                                        "w-full p-2 rounded border",
                                        errors.lastname ? "border-red-500" : "",
                                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                                    )}
                                />
                                {errors.lastname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email *"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={cn(
                                        "w-full p-2 rounded border",
                                        errors.email ? "border-red-500" : "",
                                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone with Country Code */}
                            <div>
                                <div className="flex items-center rounded-lg overflow-hidden w-full shadow-sm">
                                    <div className="relative w-1/3">
                                        <select
                                            className={cn(
                                                "block w-full p-2 appearance-none outline-none cursor-pointer border",
                                                isDarkMode ? "bg-gray-700 text-white border-gray-600"
                                                    : "bg-white text-gray-800 border-gray-300"
                                            )}
                                            value={selectedCountryCode}
                                            onChange={(e) => setSelectedCountryCode(e.target.value)}
                                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                            onBlur={() => setIsCountryDropdownOpen(false)}
                                        >
                                            {countryOptions.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.code} ({country.short})
                                                </option>
                                            ))}
                                        </select>
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                            {isCountryDropdownOpen ? (
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
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={cn(
                                            "flex-1 px-3 py-2 outline-none border border-l-0",
                                            errors.phone ? "border-red-500" : "",
                                            isDarkMode ? "bg-gray-700 text-white border-gray-600"
                                                : "bg-white text-gray-800 border-gray-300"
                                        )}
                                        maxLength={10}
                                        pattern="[0-9]{8,10}"
                                        required
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <select
                                    name="course_name"
                                    value={formData.course_name}
                                    onChange={handleChange}
                                    required
                                    className={cn(
                                        "w-full p-2 rounded border",
                                        errors.course_name ? "border-red-500" : "",
                                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                                    )}
                                >
                                    <option value="">Select Course *</option>
                                    <option value="CCIE-Fast Track">CCIE-Fast Track</option>
                                    <option value="CCIE-Pro Track">CCIE-Pro Track</option>
                                    <option value="CCIE-Master Track">CCIE-Master Track</option>
                                </select>
                                {errors.course_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.course_name}</p>
                                )}
                            </div>

                            <div>
                                <textarea
                                    name="message"
                                    placeholder="Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className={cn(
                                        "w-full p-2 rounded border resize-none",
                                        isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                                    )}
                                />
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                                    disabled={isProcessing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition flex items-center gap-2"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Schedule Demo'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Calendly Modal */}
            {isCalendlyOpen && (
                <PopupModal
                    url={clendely_id}
                    open={isCalendlyOpen}
                    onModalClose={handleCalendlyClose}
                    rootElement={document.getElementById("root")!}
                    prefill={{
                        name: `${formData.firstname} ${formData.lastname}`,
                        email: formData.email,
                        customAnswers: {
                            a1: `${selectedCountryCode}${formData.phone}`,
                            a3: formData.course_name,
                            a4: formData.message,
                        },
                    }}
                />
            )}
        </>
    );
};

export default CCIeDemoMeeting;