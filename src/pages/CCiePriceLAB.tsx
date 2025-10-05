import React from "react";
import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";

const plans = [
  {
    duration: "10 hours",
    price: "$199",
  },
  {
    duration: "30 hours",
    price: "$499",
  },
];

const LabAccessOnly: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  const handleChoosePlan = () => {
    window.location.href = "https://ent.ccielab.net/register";
  };

  return (
    <div
      className={cn(
        " flex flex-col items-center justify-center text-center ",
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      )}
    >
      {/* Header */}
      <h1
        className={cn(
          "text-3xl md:text-3xl font-bold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}
      >
        Lab Access Only
      </h1>
      <p
        className={cn(
          "text-lg mb-12",
          isDarkMode ? "text-gray-300" : "text-gray-600"
        )}
      >
        Flexible hours — pay only for what you need
      </p>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full px-4">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={cn(
              "rounded-2xl border p-10 flex flex-col items-center",
              "transition-all duration-300 ",
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                : "bg-white border-gray-200 hover:border-blue-600 shadow-md"
            )}
          >
            <div
              className={cn(
                "px-4 py-1 rounded-full font-medium mb-6",
                isDarkMode
                  ? "bg-white/90 text-blue-600"
                  : "bg-blue-50 text-blue-600"
              )}
            >
              Duration: {plan.duration}
            </div>

            <div
              className={cn(
                "text-3xl font-bold mb-10",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              {plan.price}
            </div>

            <button
              onClick={handleChoosePlan}
              className={cn(
                "w-full py-3 rounded-xl font-semibold transition-all scale-95 hover:scale-100 duration-300",
                "bg-blue-600 hover:bg-blue-700 text-white scale-95 hover:scale-100 "
              )}
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabAccessOnly;
