import { Shrimp } from "lucide-react";
import { APP_NAME } from "@/lib/constant";
import { cn } from "@/lib/utils";

export const Logo = ({
  className,
  showText,
  textStyle,
}: {
  className?: string;
  showText?: boolean;
  textStyle?: string;
}) => {
  return (
    <div className="flex items-center gap-1">
      <Shrimp className={cn("w-6 h-6", className)} />
      {showText && <span className={cn("font-medium", textStyle)}>{APP_NAME}</span>}
    </div>
  );
};
