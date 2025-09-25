import { cn } from "../lib/utils";
import { useThemeStore } from "../store/themeStore";

interface Batch {
  aspect: string;
  details: string;
}

interface TableProps {
  data: Batch[];
}

const tableHeaders = ["Aspect", "Details"];

function CCIEExamDetail({ data }: TableProps) {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="overflow-x-auto">
      <table className={cn(
        "min-w-full border-collapse",
        isDarkMode ? "border-white" : "border-gray-300",
        "border"
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
                "p-2 text-left",
                isDarkMode ? "border-white/40" : "border-gray-300",
                "border"
              )}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((batch, index) => (
            <tr key={index}>
              <td className={cn(
                "p-2 md:w-44 lg:w-64",
                isDarkMode ? "border-white/40" : "border-gray-300",
                "border"
              )}>
                {batch.aspect}
              </td>
              <td className={cn(
                "p-2",
                isDarkMode ? "border-white/40" : "border-gray-300",
                "border"
              )}>
                {batch.details}
              </td>        
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CCIEExamDetail;