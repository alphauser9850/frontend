import React, { useState, useMemo, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";

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
  onClose: () => void;
  isDarkMode: boolean;
}

interface UpcomingCcieTableProps {
  batches: Batch[];
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

      {/* <select
        className="border p-2 rounded"
        onChange={(e) => onFilterChange("type", e.target.value)}
      >
        <option value="">All Types</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
      </select> */}
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
                "p-2 text-left border",
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

function EnrollModal({ batch, onClose, isDarkMode }: EnrollModalProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryOptions[0].code);
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (batch) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [batch]);

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const values = Object.fromEntries(formData.entries());

  const submissionData = {
    ...values,
    countryCode: selectedCountryCode, // override with state
    classStartDate: batch.startDate,
    instructor: batch.instructor,
    timeZone: batch.time,
  };

  console.log("Form submission data:", submissionData);
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
          isDarkMode ? "bg-gray-800 border border-gray-600" : "bg-gray-100 border border-gray-400"
        )}
      >
        <h3
          className={cn(
            "text-lg font-semibold mb-4 pb-2",
            isDarkMode ? "text-white" : "text-blue-600"
          )}
        >
          Enroll in {batch.startDate}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className={cn(
              "p-2 rounded border",
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
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
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white border-gray-300 text-gray-800"
            )}
            required
          />

          <div className="flex items-center rounded-lg overflow-hidden w-full max-w-sm shadow-sm">
            <div className="relative w-1/2">
              <select
                className={cn(
                  "block w-full p-2 appearance-none outline-none cursor-pointer border",
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
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

            <div
              className={cn(
                "h-6 border-l",
                isDarkMode ? "border-gray-600" : "border-gray-300"
              )}
            ></div>

            <input
              type="tel"
              name="phone"
              placeholder="91234 56789"
              className={cn(
                "flex-1 px-3 py-2 outline-none focus:outline-none focus:ring-0 border border-l-0",
                isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
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
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-800 border-gray-300"
            )}
            required
          >
            <option value="">Choose Pricing Plan</option>
            <option value="Fast Track">Fast Track</option>
            <option value="Pro Track">Pro Track</option>
            <option value="Master Track">Master Track</option>

          </select>
          <textarea
            placeholder="Message"
            name="message"
            className={cn(
              "p-2 rounded border",
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
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
          onClose={handleCloseModal}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default UpcomingCcieTable;