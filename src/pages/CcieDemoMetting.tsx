import React, { useState, useEffect } from "react";
import { useThemeStore } from "../store/themeStore";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";

const countryOptions = [
    { code: "+1", name: "United States", short: "US" },
    { code: "+91", name: "India", short: "IN" },
    { code: "+86", name: "China", short: "CN" },
    { code: "+44", name: "United Kingdom", short: "UK" },
    { code: "+49", name: "Germany", short: "GE" },
    { code: "+33", name: "France", short: "FR" },
    { code: "+81", name: "Japan", short: "JP" },
    { code: "+39", name: "Italy", short: "IT" },
    { code: "+7", name: "Russia", short: "RU" },
    { code: "+55", name: "Brazil", short: "BR" },
    { code: "+1", name: "Canada", short: "CA" },
    { code: "+61", name: "Australia", short: "AU" },
    { code: "+82", name: "South Korea", short: "KR" },
    { code: "+34", name: "Spain", short: "ES" },
    { code: "+52", name: "Mexico", short: "MX" },
    { code: "+31", name: "Netherlands", short: "NL" },
    { code: "+46", name: "Sweden", short: "SE" },
    { code: "+41", name: "Switzerland", short: "CH" },
    { code: "+47", name: "Norway", short: "NO" },
    { code: "+45", name: "Denmark", short: "DK" },
    { code: "+60", name: "Malaysia", short: "MY" },
    { code: "+65", name: "Singapore", short: "SG" },
    { code: "+27", name: "South Africa", short: "ZA" },
    { code: "+351", name: "Portugal", short: "PT" },
    { code: "+48", name: "Poland", short: "PL" },
    { code: "+420", name: "Czech Republic", short: "CZ" },
    { code: "+386", name: "Slovenia", short: "SI" },
    { code: "+353", name: "Ireland", short: "IE" },
    { code: "+358", name: "Finland", short: "FI" },
    { code: "+30", name: "Greece", short: "GR" },
    { code: "+63", name: "Philippines", short: "PH" },
    { code: "+64", name: "New Zealand", short: "NZ" },
    { code: "+90", name: "Turkey", short: "TR" },
    { code: "+886", name: "Taiwan", short: "TW" },
    { code: "+971", name: "UAE", short: "AE" },
    { code: "+966", name: "Saudi Arabia", short: "SA" },
    { code: "+98", name: "Iran", short: "IR" },
    { code: "+962", name: "Jordan", short: "JO" },
    { code: "+20", name: "Egypt", short: "EG" },
    { code: "+234", name: "Nigeria", short: "NG" },
    { code: "+254", name: "Kenya", short: "KE" },
    { code: "+880", name: "Bangladesh", short: "BD" },
    { code: "+84", name: "Vietnam", short: "VN" },
    { code: "+66", name: "Thailand", short: "TH" },
    { code: "+92", name: "Pakistan", short: "PK" },
    { code: "+880", name: "Bangladesh", short: "BD" },
    { code: "+95", name: "Myanmar", short: "MM" },
    { code: "+374", name: "Armenia", short: "AM" },
    { code: "+373", name: "Moldova", short: "MD" },
    { code: "+371", name: "Latvia", short: "LV" },
    { code: "+370", name: "Lithuania", short: "LT" },
    { code: "+386", name: "Slovenia", short: "SI" },
    { code: "+423", name: "Liechtenstein", short: "LI" },
    { code: "+352", name: "Luxembourg", short: "LU" },
    { code: "+376", name: "Andorra", short: "AD" },
    { code: "+355", name: "Albania", short: "AL" },
    { code: "+213", name: "Algeria", short: "DZ" },
    { code: "+374", name: "Armenia", short: "AM" },
    { code: "+387", name: "Bosnia and Herzegovina", short: "BA" },
    { code: "+267", name: "Botswana", short: "BW" },
    { code: "+975", name: "Bhutan", short: "BT" },
    { code: "+591", name: "Bolivia", short: "BO" },
    { code: "+55", name: "Brazil", short: "BR" },
    { code: "+673", name: "Brunei", short: "BN" },
    { code: "+359", name: "Bulgaria", short: "BG" },
];

const CCIeDemoMetting = () => {
    const { isDarkMode } = useThemeStore();
    const [openModal, setOpenModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (openModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [openModal]);

    return (
        <>
            <section
                className={cn(
                    "px-4 py-12 space-y-16 transition-colors duration-300",
                    isDarkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
                )}
            >

                {/* Demo Class Call-to-Action Section */}
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
                            onClick={() => setOpenModal(true)}
                            className={cn(
                                "px-6 py-3 rounded-lg font-medium transition",
                                isDarkMode
                                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                                    : "bg-purple-600 hover:bg-purple-700 text-white"
                            )}
                        >
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>
            {openModal && (
                <div
                    className={cn(
                        "fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50",
                        isDarkMode ? "bg-opacity-50" : "bg-opacity-40"
                    )}
                >
                    <div
                        className={cn(
                            "p-6 rounded-lg w-96",
                            isDarkMode ? "bg-gray-800" : "bg-gray-100 border border-gray-400"
                        )}
                    >
                        <h3
                            className={cn(
                                "text-lg font-semibold mb-4",
                                isDarkMode ? "text-white" : "text-blue-600"
                            )}
                        >
                            Reserve Your Meeting Slot
                        </h3>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                window.location.href = "/payment";
                            }}
                            className="flex flex-col gap-4"
                        >
                            {/* Name */}
                            <input
                                type="text"
                                placeholder="Name"
                                className={cn(
                                    "p-2 rounded",
                                    isDarkMode
                                        ? "bg-gray-700 text-white"
                                        : "bg-white text-gray-800 border"
                                )}
                                required
                            />

                            {/* Email */}
                            <input
                                type="email"
                                placeholder="Email"
                                className={cn(
                                    "p-2 rounded",
                                    isDarkMode
                                        ? "bg-gray-700 text-white"
                                        : "bg-white text-gray-800 border"
                                )}
                                required
                            />

                            {/* Phone Input with Country Code */}
                            <div className="flex items-center rounded-lg overflow-hidden w-full max-w-sm shadow-sm">
                                {/* Country Code Dropdown */}
                                <div className="relative w-1/2">
                                    <select
                                        className={cn(
                                            "block w-full p-2 appearance-none outline-none cursor-pointer",
                                            isDarkMode
                                                ? "bg-gray-700 text-white border-none"
                                                : "bg-white text-gray-800 border"
                                        )}
                                        required
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        onBlur={() => setDropdownOpen(false)}
                                    >
                                        {countryOptions.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.code} ({country.short})
                                            </option>
                                        ))}
                                    </select>
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        {dropdownOpen ? (
                                            <ChevronUp
                                                className={cn(
                                                    "w-4 h-4",
                                                    isDarkMode ? "text-gray-300" : "text-gray-800"
                                                )}
                                            />
                                        ) : (
                                            <ChevronDown
                                                className={cn(
                                                    "w-4 h-4",
                                                    isDarkMode ? "text-gray-300" : "text-gray-800"
                                                )}
                                            />
                                        )}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div
                                    className={cn(
                                        "h-6 border-l",
                                        isDarkMode ? "text-gray-300" : "text-gray-800"
                                    )}
                                ></div>

                                {/* Mobile Number Input */}
                                <input
                                    type="tel"
                                    placeholder="91234 56789"
                                    className={cn(
                                        "flex-1 px-3 py-2 outline-none focus:outline-none focus:ring-0",
                                        isDarkMode
                                            ? "bg-gray-700 text-white"
                                            : "bg-white text-gray-800"
                                    )}
                                    maxLength={10}
                                    pattern="[0-9]{8,10}"
                                    required
                                />
                            </div>

                            {/* Course Selection */}
                            <select
                                className={cn(
                                    "p-2 rounded",
                                    isDarkMode
                                        ? "bg-gray-700 text-white"
                                        : "bg-white text-gray-800 border"
                                )}
                            >
                                <option>Choose Course</option>
                                <option>Only CCIE Labs</option>
                                <option>Full CCIE Training</option>
                                <option>Premium CCIE Training</option>
                            </select>

                            {/* Message */}
                            <textarea
                                placeholder="Your Message"
                                className={cn(
                                    "p-2 rounded",
                                    isDarkMode
                                        ? "bg-gray-700 text-white"
                                        : "bg-white text-gray-800 border"
                                )}
                            ></textarea>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-3">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-6 rounded-lg"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className={cn("px-4 py-2 rounded bg-red-500 text-white")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CCIeDemoMetting;
