import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const CCIeDemoMeeting = () => {
    const { isDarkMode } = useThemeStore();
    const [isHubSpotOpen, setIsHubSpotOpen] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);
    const [isIframeLoading, setIsIframeLoading] = useState(false);
    const hubspotScriptLoaded = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // HubSpot meetings URL
    const hubspotMeetingsUrl = `${import.meta.env.VITE_HUBSPOT_MEETING_ID}?embed=true`;

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
        setIsIframeLoading(true);
        setIframeKey(prevKey => prevKey + 1);
        setIsHubSpotOpen(true);
    };

    const handleHubSpotClose = () => {
        setIsHubSpotOpen(false);
    };

    const handleIframeLoad = () => {
        setIsIframeLoading(false);
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
                        onClick={handleHubSpotOpen}
                        className="px-8 py-3 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    >
                        Schedule Demo
                    </button>
                </div>
            </section>

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
                                Schedule Your Meeting
                            </h3>
                            <button
                                type="button"
                                onClick={handleHubSpotClose}
                                className={cn(
                                    "p-2 rounded-full transition-colors flex-shrink-0",
                                    isDarkMode
                                        ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                                        : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                                )}
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
                            {/* Loading indicator */}
                            {isIframeLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                                        <p className="mt-2 text-gray-600">Loading scheduling calendar...</p>
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
        </>
    );
};


export default CCIeDemoMeeting;