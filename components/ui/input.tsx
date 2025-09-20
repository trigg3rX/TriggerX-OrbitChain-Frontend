import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-white/5 text-white py-3 px-4 rounded-lg border border-white/10 placeholder-gray-400 outline-none focus:border-white/50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
