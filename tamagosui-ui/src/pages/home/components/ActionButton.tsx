import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import type { ReactNode } from "react";

type ActionButtonProps = {
  onClick: () => void;
  disabled: boolean;
  isPending: boolean;
  label: string;
  icon?: ReactNode;
  variant?: "default" | "green" | "blue" | "grey";
};

export function ActionButton({
  onClick,
  disabled,
  isPending,
  label,
  icon,
  variant = "grey",
}: ActionButtonProps) {
  let bgColor = "bg-gray-400 hover:bg-gray-500 text-white";
  if (variant === "green") bgColor = "bg-[#8BC34A] hover:bg-[#7CB342] text-white";
  if (variant === "blue") bgColor = "bg-[#4285F4] hover:bg-[#3367D6] text-white";

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-10 rounded-xl font-medium shadow-sm transition-colors ${bgColor}`}
    >
      {isPending ? (
        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
      ) : icon ? (
        <div className="mr-2 opacity-80">{icon}</div>
      ) : null}
      {label}
    </Button>
  );
}
