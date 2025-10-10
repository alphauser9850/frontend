import { useState } from "react";
import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";

const features = [
    {
        title: "Access: Remote Labs with Flexible Scheduling",
        content: (
            <ul className="list-disc pl-5 text-sm md:text-base">
                <li>Remote lab access allows students to practice anytime, anywhere.</li>
                <li>
                    Time-slot booking system ensures everyone gets dedicated lab access, avoiding conflicts
                    and enabling structured practice sessions.
                </li>
                <li>
                    Labs are pre-configured with complex topologies matching CCIE exam scenarios, so you get
                    realistic, career-ready exposure.
                </li>
            </ul>
        ),
        image: "https://ccielab.net/labInf1.png"
    },
    {
        title: "Bootcamp: Intensive Exam Practice",
        content: (
            <ul className="list-disc pl-5 text-sm md:text-base">
                <li>Exam-focused bootcamps simulate real CCIE lab conditions.</li>
                <li>Timed practice sessions help students build speed, accuracy, and confidence.</li>
                <li>
                    Advanced labs cover complex enterprise networks, SD-WAN, DNA Center, automation tasks,
                    and troubleshooting under real exam constraints.
                </li>
                <li>
                    <span className="font-bold">Pro tip: </span> Our bootcamp sessions are designed to push you to think and solve like a certified
                    CCIE professional, ensuring you're exam-ready.
                </li>
            </ul>
        ),
        image: "https://ccielab.net/labInf2.png"
    },
    {
        title: "Support: Expert Guidance During Lab Practice",
        content: (
            <ul className="list-disc pl-5 text-sm md:text-base">
                <li>
                    Lab instructors are available during all practice hours to guide, troubleshoot, and clarify
                    doubts.
                </li>
                <li>
                    Receive personalized tips and corrections while working on advanced scenarios.
                </li>
                <li>
                    This ensures no student is left behind and every concept is reinforced practically.
                </li>
            </ul>
        ),
        image: "https://ccielab.net/labInf3.jpg"
    },
    {
        title: "Why Students Love Our Labs",
        content: (
            <ul className="list-disc pl-5 text-sm md:text-base">
                <li>Convenient: Book labs in one hour increments 24/7.</li>
                <li>Packaged: We have pre-provisioned labs ready to deploy with the click of a button.</li>
                <li>Simple: All you need is a web browser.</li>
                <li>Rich: From DNAC and SDWAN to C8000Vs and vIOS, our labs use exam devices.</li>
                <li>Affordable: Rack rentals as low as $15 per hour.</li>
            </ul>
        ),
        image: "https://ccielab.net/labInf4.png"
    },
];

const CCIELabInfrastructure = () => {
    const { isDarkMode } = useThemeStore();
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section
            className={cn(
                "max-full mx-auto px-4 py-12 transition-colors duration-300",
                isDarkMode ? "bg-gray-900" : "bg-white"
            )}
        >
            <div className="max-w-7xl mx-auto">

                {/* Top Row - Feature Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={cn(
                                "cursor-pointer p-2 md:p-4 border rounded-lg text-center transition-all duration-300",
                                activeIndex === index
                                    ? isDarkMode
                                        ? "bg-purple-600 text-white shadow-lg border-purple-500"
                                        : "bg-purple-600 text-white shadow-lg border-purple-500"
                                    : isDarkMode
                                        ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-purple-800 hover:text-white"
                                        : "bg-white text-gray-800 border-gray-200 hover:bg-purple-100"
                            )}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            <h3 className="font-semibold text-sm sm:text-base lg:text-lg">{feature.title}</h3>
                        </div>
                    ))}
                </div>

                {/* Dynamic Content with Image Inside */}
                <div
                    className={cn(
                        "border rounded-lg transition-colors duration-300 overflow-hidden",
                        isDarkMode
                            ? "bg-gray-800 border-gray-700 text-gray-200"
                            : "bg-gray-50 border-gray-300 text-gray-800"
                    )}
                >
                    <div className="flex flex-col lg:flex-row">
                        {/* Content Section */}
                        <div className="p-6 lg:flex-1">
                            {features[activeIndex].content}
                        </div>

                        {/* Image Section - Fixed */}
                        <div className="lg:w-96 xl:w-1/3 p-6 flex items-center justify-center">
                            <div className="w-full h-64 lg:h-72 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <img
                                    src={features[activeIndex].image}
                                    alt={features[activeIndex].title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CCIELabInfrastructure;
