import { Mountain } from "lucide-react";
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
      <Mountain className={cn("w-4 h-4", className)} />
      {showText && <span className={cn("font-medium", textStyle)}>{APP_NAME}</span>}
    </div>
  );
};
