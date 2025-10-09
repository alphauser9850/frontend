import { useThemeStore } from "../../store/themeStore";
import { cn } from "../../lib/utils";
import { useState, useEffect, useRef } from "react";
import { Calendar, Play, BookOpen, Clock, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";

const PaymentSuccessful = () => {
    const { isDarkMode } = useThemeStore();
    const [isHubSpotOpen, setIsHubSpotOpen] = useState(false);
    // States for controlling iframe reload and loading status
    const [iframeKey, setIframeKey] = useState(0);
    const [isIframeLoading, setIsIframeLoading] = useState(false);
    const hubspotScriptLoaded = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [videoPlaying, setVideoPlaying] = useState(false);

    // HubSpot meetings URL
    const hubspotMeetingsUrl = `${import.meta.env.VITE_HUBSPOT_MEETING_ID}?embed=true`;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Load HubSpot script when modal opens
    useEffect(() => {
        if (isHubSpotOpen && !hubspotScriptLoaded.current) {
            const existingScript = document.querySelector(
                'script[src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"]'
            );

            if (!existingScript) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
                script.async = true;

                script.onload = () => {
                    hubspotScriptLoaded.current = true;
                };

                script.onerror = () => {
                    console.error('Failed to load HubSpot Meetings script');
                };

                document.body.appendChild(script);
            } else {
                hubspotScriptLoaded.current = true;
            }
        }
    }, [isHubSpotOpen]);

    const handleHubSpotOpen = () => {
        // Reset loading state and generate a new key to force iframe remount
        setIsIframeLoading(true);
        setIframeKey(prevKey => prevKey + 1);
        setIsHubSpotOpen(true);
    };

    const handleHubSpotClose = () => {
        setIsHubSpotOpen(false);
    };

    const handleIframeLoad = () => {
        // Hide loading indicator when iframe fully loads
        setIsIframeLoading(false);
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
                                    onClick={handleHubSpotOpen} // Updated to use new handler
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

                                <button
                                    onClick={() => window.open("https://ent.ccielab.net/register", "_blank", "noopener,noreferrer")}
                                    className={cn(
                                        "px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                                        themeStyles.button.secondary
                                    )}
                                >
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
                                        <video
                                            className="w-full h-full"
                                            controls
                                            autoPlay
                                            src="/Welcome-onboard.mp4"
                                        >
                                            Your browser does not support the video tag.
                                        </video>
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
                                    "font-semibold transition-colors underline",
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

            {/* HubSpot Meetings Modal */}
            {isHubSpotOpen && (
                <div
                    className={cn(
                        "fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4",
                        isDarkMode ? "bg-opacity-50" : "bg-opacity-40"
                    )}
                    onClick={handleHubSpotClose}
                >
                    <div
                        className={cn(
                            "p-4 sm:p-6 rounded-lg w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col",
                            isDarkMode ? "bg-gray-800 border border-gray-600" : "bg-white border-gray-400"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-3 sm:mb-4 pb-2 border-b flex-shrink-0">
                            <h3
                                className={cn(
                                    "text-base sm:text-lg font-semibold",
                                    isDarkMode ? "text-white border-gray-600" : "text-blue-600 border-gray-300"
                                )}
                            >
                                Schedule Your Onboarding Call
                            </h3>
                            <button
                                type="button"
                                onClick={handleHubSpotClose}
                                className="px-2 sm:px-3 py-1 text-sm sm:text-base rounded bg-red-500 text-white hover:bg-red-600 transition flex-shrink-0"
                            >
                                Close
                            </button>
                        </div>

                        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
                            {/* Loading indicator */}
                            {isIframeLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                        <p className="mt-2 text-gray-600">Loading scheduler...</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Iframe with key to force reload and onLoad handler */}
                            <iframe
                                key={iframeKey}
                                src={hubspotMeetingsUrl}
                                width="100%"
                                height="100%"
                                style={{ minHeight: '700px' }}
                                onLoad={handleIframeLoad}
                                frameBorder="0"
                                title="HubSpot Meetings Scheduler"
                            />
                        </div>
                    </div>
                </div>
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