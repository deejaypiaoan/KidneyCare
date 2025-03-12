import React, { useState } from "react";
import { Input, InputProps } from "./input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends InputProps {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const togglePassword = () => {
      setShowPassword(true);

      // Clear any existing timer
      if (timer) {
        clearTimeout(timer);
      }

      // Set a new timer to hide password after 2 seconds
      const newTimer = setTimeout(() => {
        setShowPassword(false);
      }, 2000);

      setTimer(newTimer);
    };

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
