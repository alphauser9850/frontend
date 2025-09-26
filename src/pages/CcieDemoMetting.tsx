import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";
import { PopupModal } from "react-calendly";
import { useState } from "react";

const CCIeDemoMetting = () => {
    const { isDarkMode } = useThemeStore();
    const [open, setOpen] = useState(false);

    return (
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
                <h3
                    className={cn(
                        "mb-3",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}
                >
                    Want to know more about the instructor or course?
                </h3>
                <p
                    className={cn(
                        "mb-6",
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}
                >
                    Experience our teaching methodology and lab environment firsthand.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setOpen(true)}
                        className={cn(
                            "px-6 py-3 rounded-lg font-medium transition",
                            "bg-purple-600 hover:bg-purple-700 text-white"
                        )}
                    >
                        Schedule Demo
                    </button>
                </div>
            </div>

            {/* Calendly Modal */}
            <PopupModal
                url="https://calendly.com/sparshi-jain-berkut/30min" 
                onModalClose={() => setOpen(false)}
                open={open}
                rootElement={document.getElementById("root")!}
            />
        </section>
    );
};

export default CCIeDemoMetting;
