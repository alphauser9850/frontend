import { useThemeStore } from "../../store/themeStore";
import { cn } from "../../lib/utils";
import { PopupModal } from "react-calendly";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader, Calendar, Play, BookOpen, Clock, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";

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

const PaymentSuccessful = () => {
    const { isDarkMode } = useThemeStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryOptions[0].code);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const clendely_id = import.meta.env.VITE_CLENDELY_ID || "";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
            // Step 1: Check if contact already exists using get-contact endpoint
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
                                    value: formData.email, // ✅ fixed (was submissionData)
                                }
                            ]
                        }
                    ],
                    properties: ["firstname", "lastname", "email", "phone", "id"]
                }),
            });

            const checkContactData = await checkContactResponse.json();

            let contactId: string | null = null;

            if (checkContactData.data?.results?.length > 0) {
                contactId = checkContactData.data.results[0].id;
                console.log("Contact already exists with ID:", contactId);
            } else {
                // Create new contact
                const fullPhone = `${selectedCountryCode}${formData.phone}`;

                const res = await fetch("/api/hubspot/create-contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        properties: {
                            ...formData,
                            phone: fullPhone,
                        }
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error("HubSpot create contact failed:", errorData);
                    alert("Failed to save contact. Please try again.");
                    return; // exit early if creation fails
                }
            }

            // ✅ Always proceed to Calendly if validation/contact step succeeds
            setIsModalOpen(false);
            setIsCalendlyOpen(true);

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

    const playVideo = () => {
        setVideoPlaying(true);
    };

    // Theme-based styles
    const themeStyles = {
        background: isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
            : "bg-gradient-to-br from-blue-50 via-white to-indigo-100",
        card: isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/90 border-gray-200",
        text: {
            primary: isDarkMode ? "text-white" : "text-gray-900",
            secondary: isDarkMode ? "text-gray-300" : "text-gray-700",
            muted: isDarkMode ? "text-gray-400" : "text-gray-500",
        },
        button: {
            primary: isDarkMode
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-600 hover:to-orange-600"
                : "bg-gradient-to-r from-yellow-400 to-red-500 text-white hover:from-yellow-500 hover:to-red-600",
            secondary: isDarkMode
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                : "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-500 hover:to-purple-600",
            success: isDarkMode
                ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
                : "bg-gradient-to-r from-green-400 to-teal-500 text-white hover:from-green-500 hover:to-teal-600",
        },
        border: isDarkMode ? "border-gray-700" : "border-gray-300",
        input: isDarkMode
            ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
            : "bg-white text-gray-900 border-gray-300 placeholder-gray-500",
        modal: isDarkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-900",
    };

    return (
        <>
            {/* Main Payment Success Page */}
            <div className={cn(
                "min-h-screen transition-colors duration-300",
                themeStyles.background
            )}>
                <div className="container mx-auto px-4 py-12">
                    {/* Header Section */}
                    <div className="text-center mb-16" style={{ animation: 'fadeInDown 0.8s ease-out' }}>
                        {/* <div className={cn(
                            "inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 mb-8 animate-pulse",
                            isDarkMode 
                                ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30" 
                                : "bg-gradient-to-r from-yellow-400/20 to-red-400/20 border-yellow-400/30"
                        )}>
                            <span className="text-2xl">🎉</span>
                            <p className={cn(
                                "text-lg font-semibold bg-clip-text text-transparent",
                                isDarkMode 
                                    ? "bg-gradient-to-r from-yellow-400 to-orange-400" 
                                    : "bg-gradient-to-r from-yellow-500 to-red-500"
                            )}>
                                PAYMENT SUCCESSFUL
                            </p>
                        </div> */}

                        <h1
                            className={cn(
                                "text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent",
                                isDarkMode
                                    ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-400"
                                    : "bg-gradient-to-r from-yellow-500 via-red-500 to-blue-500"
                            )}
                            style={{ animation: 'fadeInUp 1s ease-out' }}
                        >
                            Welcome to CCIELab.net!
                        </h1>

                        <p
                            className={cn(
                                "text-xl max-w-4xl mx-auto leading-relaxed",
                                themeStyles.text.secondary
                            )}
                            style={{ animation: 'fadeInUp 1.2s ease-out' }}
                        >
                            Thank you for signing up and congratulations on taking the first step in your CCIE journey. Our goal is{" "}
                            <strong className={isDarkMode ? "text-yellow-300" : "text-yellow-600"}>
                                to get you exam-ready with the right guidance, tools, and practice.
                            </strong>
                        </p>
                    </div>

                    {/* Benefits Section */}
                    <div
                        className={cn(
                            "rounded-2xl p-8 mb-12 backdrop-blur-sm border transition-colors duration-300",
                            themeStyles.card,
                            themeStyles.border
                        )}
                        style={{ animation: 'fadeIn 1.4s ease-out' }}
                    >
                        <h2 className={cn(
                            "text-3xl font-bold text-center mb-8",
                            isDarkMode ? "text-yellow-400" : "text-yellow-600"
                        )}>
                            What You'll Receive
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Benefit 1 */}
                            <div className={cn(
                                "flex items-start gap-4 p-6 rounded-xl border-l-4 transition-all duration-300 hover:scale-105",
                                isDarkMode
                                    ? "bg-gray-700/50 border-yellow-400 hover:bg-gray-700/80"
                                    : "bg-white/80 border-yellow-500 hover:bg-white"
                            )}>
                                <Users className={cn(
                                    "w-8 h-8 flex-shrink-0",
                                    isDarkMode ? "text-yellow-400" : "text-yellow-500"
                                )} />
                                <div>
                                    <strong className={cn(
                                        "text-lg block mb-2",
                                        isDarkMode ? "text-yellow-300" : "text-yellow-600"
                                    )}>
                                        Live Trainer Sessions
                                    </strong>
                                    <p className={themeStyles.text.secondary}>Learn in real-time from experienced CCIE trainers with hands-on guidance.</p>
                                </div>
                            </div>

                            {/* Benefit 2 */}
                            <div className={cn(
                                "flex items-start gap-4 p-6 rounded-xl border-l-4 transition-all duration-300 hover:scale-105",
                                isDarkMode
                                    ? "bg-gray-700/50 border-blue-400 hover:bg-gray-700/80"
                                    : "bg-white/80 border-blue-500 hover:bg-white"
                            )}>
                                <BookOpen className={cn(
                                    "w-8 h-8 flex-shrink-0",
                                    isDarkMode ? "text-blue-400" : "text-blue-500"
                                )} />
                                <div>
                                    <strong className={cn(
                                        "text-lg block mb-2",
                                        isDarkMode ? "text-blue-300" : "text-blue-600"
                                    )}>
                                        Dedicated Lab Hours
                                    </strong>
                                    <p className={themeStyles.text.secondary}>Practice hands-on labs on our specialized platform with 24/7 access.</p>
                                </div>
                            </div>

                            {/* Benefit 3 */}
                            <div className={cn(
                                "flex items-start gap-4 p-6 rounded-xl border-l-4 transition-all duration-300 hover:scale-105",
                                isDarkMode
                                    ? "bg-gray-700/50 border-pink-400 hover:bg-gray-700/80"
                                    : "bg-white/80 border-pink-500 hover:bg-white"
                            )}>
                                <Clock className={cn(
                                    "w-8 h-8 flex-shrink-0",
                                    isDarkMode ? "text-pink-400" : "text-pink-500"
                                )} />
                                <div>
                                    <strong className={cn(
                                        "text-lg block mb-2",
                                        isDarkMode ? "text-pink-300" : "text-pink-600"
                                    )}>
                                        Self-Study Resources
                                    </strong>
                                    <p className={themeStyles.text.secondary}>Access comprehensive videos and study materials anytime, anywhere.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Steps Section */}
                        <div
                            className={cn(
                                "rounded-2xl p-8 backdrop-blur-sm border transition-colors duration-300",
                                themeStyles.card,
                                themeStyles.border
                            )}
                            style={{ animation: 'slideInLeft 1s ease-out' }}
                        >
                            <h2 className={cn(
                                "text-3xl font-bold mb-8",
                                isDarkMode ? "text-yellow-400" : "text-yellow-600"
                            )}>
                                Next Steps 🚀
                            </h2>

                            {/* Step 1 */}
                            <div className={cn(
                                "mb-8 p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1",
                                themeStyles.card,
                                themeStyles.border
                            )}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                                        isDarkMode
                                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black"
                                            : "bg-gradient-to-r from-yellow-400 to-red-500 text-white"
                                    )}>
                                        1
                                    </div>
                                    <h3 className={cn("text-xl font-semibold", themeStyles.text.primary)}>Schedule Your Onboarding Call</h3>
                                </div>
                                <p className={cn("mb-4", themeStyles.text.secondary)}>
                                    Book a call with your trainer to set up your personalized learning plan and discuss your CCIE goals.
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className={cn(
                                        "px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                                        themeStyles.button.primary
                                    )}
                                >
                                    <Calendar className="w-5 h-5" />
                                    Schedule Onboarding Call
                                    <span>→</span>
                                </button>
                            </div>

                            {/* Step 2 */}
                            <div className={cn(
                                "mb-8 p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1",
                                themeStyles.card,
                                themeStyles.border
                            )}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                                        isDarkMode
                                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                            : "bg-gradient-to-r from-blue-400 to-purple-500 text-white"
                                    )}>
                                        2
                                    </div>
                                    <h3 className={cn("text-xl font-semibold", themeStyles.text.primary)}>Activate Your Lab Access</h3>
                                </div>
                                <p className={cn("mb-2", themeStyles.text.secondary)}>
                                    Create your account on our dashboard to access labs, materials, and training resources.
                                </p>
                                <p className={cn("text-sm mb-4", isDarkMode ? "text-yellow-300" : "text-yellow-600")}>
                                    ⏱️ Your lab hours will be credited within <strong>24 hours</strong> after account creation.
                                </p>
                                <button className={cn(
                                    "px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                                    themeStyles.button.secondary
                                )}>
                                    🔐 Create Lab Account
                                    <span>→</span>
                                </button>
                            </div>

                            {/* Step 3 */}
                            <div className={cn(
                                "p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1",
                                themeStyles.card,
                                themeStyles.border
                            )}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                                        isDarkMode
                                            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white"
                                            : "bg-gradient-to-r from-green-400 to-teal-500 text-white"
                                    )}>
                                        3
                                    </div>
                                    <h3 className={cn("text-xl font-semibold", themeStyles.text.primary)}>Watch the Getting Started Guide</h3>
                                </div>
                                <p className={themeStyles.text.secondary}>
                                    Check out our instruction video to learn how to navigate your dashboard and maximize your training experience.
                                </p>
                            </div>
                        </div>

                        {/* Video Section */}
                        <div
                            className={cn(
                                "rounded-2xl p-8 backdrop-blur-sm border transition-colors duration-300",
                                themeStyles.card,
                                themeStyles.border
                            )}
                            style={{ animation: 'slideInRight 1s ease-out' }}
                        >
                            <h2 className={cn(
                                "text-3xl font-bold mb-6",
                                isDarkMode ? "text-blue-400" : "text-blue-600"
                            )}>
                                📹 Getting Started Guide
                            </h2>

                            <p className={cn("mb-6", themeStyles.text.secondary)}>
                                Watch this quick tutorial to learn how to access your labs, schedule sessions, and make the most of your training.
                            </p>

                            <div className="relative rounded-xl overflow-hidden shadow-2xl mb-6 bg-black">
                                <div className="aspect-video bg-gradient-to-br from-black to-indigo-900 flex items-center justify-center h-72">
                                    {!videoPlaying ? (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                            onClick={playVideo}
                                        >
                                            <div className="relative group">
                                                <div className={cn(
                                                    "w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-3xl",
                                                    isDarkMode
                                                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black"
                                                        : "bg-gradient-to-r from-yellow-400 to-red-500 text-white"
                                                )}>
                                                    <Play className="w-8 h-8 ml-1" />
                                                </div>
                                                <div className={cn(
                                                    "absolute inset-0 rounded-full opacity-50 animate-ping",
                                                    isDarkMode
                                                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                                        : "bg-gradient-to-r from-yellow-400 to-red-500"
                                                )}></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <iframe
                                            className="w-full h-full"
                                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    )}
                                </div>
                            </div>

                            <p className={cn("text-center", themeStyles.text.secondary)}>
                                <strong>Duration:</strong> 5 minutes | Step-by-step walkthrough of your student dashboard and lab platform
                            </p>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div
                        className={cn(
                            "rounded-2xl p-8 text-center backdrop-blur-sm border-2 transition-colors duration-300",
                            isDarkMode
                                ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30"
                                : "bg-gradient-to-r from-yellow-400/10 to-red-400/10 border-yellow-400/30"
                        )}
                        style={{ animation: 'fadeInUp 1.6s ease-out' }}
                    >
                        <h2 className={cn(
                            "text-3xl font-bold mb-4",
                            isDarkMode ? "text-yellow-400" : "text-yellow-600"
                        )}>
                            Need Help? 🤝
                        </h2>
                        <p className={cn("text-lg mb-2", themeStyles.text.secondary)}>
                            If you have any questions or face issues with lab access, our support team is here to help.
                        </p>
                        <p className={cn("text-2xl mt-6", themeStyles.text.primary)}>
                            📧 Email us at:{" "}
                            <a
                                href="mailto:support@ccielab.net"
                                className={cn(
                                    "font-semibold transition-colors",
                                    isDarkMode ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:text-blue-500"
                                )}
                            >
                                support@ccielab.net
                            </a>
                        </p>
                        <p className={cn("mt-4", themeStyles.text.secondary)}>
                            Our support team will respond promptly within 24 hours.
                        </p>
                    </div>
                </div>
            </div>

            {/* Demo Booking Modal */}
            {isModalOpen && (
                <div
                    className={cn(
                        "fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-colors duration-300",
                        isDarkMode ? "bg-opacity-50" : "bg-opacity-40"
                    )}
                >
                    <div
                        className={cn(
                            "p-6 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border transition-colors duration-300",
                            themeStyles.modal,
                            themeStyles.border
                        )}
                    >
                        <h3
                            className={cn(
                                "text-lg font-semibold mb-4 pb-2 border-b",
                                isDarkMode ? "border-gray-600" : "border-gray-300"
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
                                        "p-3 rounded-lg mb-2 text-sm border",
                                        isDarkMode
                                            ? "bg-blue-900/30 border-blue-700 text-blue-300"
                                            : "bg-blue-50 border-blue-200 text-blue-800"
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
                                        "w-full p-2 rounded border transition-colors duration-300",
                                        errors.firstname ? "border-red-500" : "",
                                        themeStyles.input
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
                                        "w-full p-2 rounded border transition-colors duration-300",
                                        errors.lastname ? "border-red-500" : "",
                                        themeStyles.input
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
                                        "w-full p-2 rounded border transition-colors duration-300",
                                        errors.email ? "border-red-500" : "",
                                        themeStyles.input
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
                                                "block w-full p-2 appearance-none outline-none cursor-pointer border transition-colors duration-300",
                                                themeStyles.input
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
                                                <ChevronUp className={cn("w-4 h-4", themeStyles.text.secondary)} />
                                            ) : (
                                                <ChevronDown className={cn("w-4 h-4", themeStyles.text.secondary)} />
                                            )}
                                        </span>
                                    </div>
                                    <div className={cn("h-6 border-l", themeStyles.border)}></div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="91234 56789"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={cn(
                                            "flex-1 px-3 py-2 outline-none border border-l-0 transition-colors duration-300",
                                            errors.phone ? "border-red-500" : "",
                                            themeStyles.input
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
                                        "w-full p-2 rounded border transition-colors duration-300",
                                        errors.course_name ? "border-red-500" : "",
                                        themeStyles.input
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
                                        "w-full p-2 rounded border resize-none transition-colors duration-300",
                                        themeStyles.input
                                    )}
                                />
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
                                    disabled={isProcessing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={cn(
                                        "px-6 py-2 rounded transition-colors duration-300 flex items-center gap-2",
                                        isDarkMode
                                            ? "bg-gray-700 text-white hover:bg-gray-600"
                                            : "bg-gray-800 text-white hover:bg-gray-700"
                                    )}
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

            {/* Add CSS animations */}
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>

            <Helmet>
                <title>Welcome to CCIELab.net - CCIE Lab</title>
                <meta name="description" content="Thank you for signing up and congratulations on taking the first step in your CCIE journey. Our goal is to get you exam-ready with the right guidance, tools, and practice." />
                <meta property="og:title" content="Welcome to CCIELab.net  - CCIE Lab" />
                <meta property="og:description" content="Thank you for signing up and congratulations on taking the first step in your CCIE journey. Our goal is to get you exam-ready with the right guidance, tools, and practice." />
                <meta property="og:type" content="website" />
            </Helmet>
        </>
    );
};

export default PaymentSuccessful;