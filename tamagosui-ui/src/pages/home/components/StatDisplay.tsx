
import type { ReactNode } from "react";

type StatDisplayProps = {
  icon: ReactNode;
  label: string;
  value: number;
};

export function StatDisplay({ icon, label, value }: StatDisplayProps) {
  let indicatorColor = "bg-gray-800";
  
  if (label.toLowerCase() === "energy") {
    indicatorColor = "bg-green-500";
  } else if (label.toLowerCase() === "happiness") {
    indicatorColor = "bg-pink-500";
  } else if (label.toLowerCase() === "hunger") {
    indicatorColor = "bg-yellow-500";
  }

  return (
    <div className="flex items-center gap-3 w-full my-2">
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 h-1.5 bg-gray-300 rounded-full overflow-hidden">
        <div 
          className={`h-full ${indicatorColor} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
