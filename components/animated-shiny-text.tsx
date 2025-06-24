"use client";

import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedShinyText({
  children,
  className,
}: AnimatedShinyTextProps) {
  return (
    <div
      className={cn(
        "inline-flex animate-shimmer items-center justify-center px-3 py-1 text-sm transition-colors bg-[linear-gradient(110deg,#ffffff,45%,#e5e7eb,55%,#ffffff)] bg-[length:200%_100%] text-gray-800",
        className
      )}
    >
      {children}
    </div>
  );
}

// Add the shimmer animation to your global CSS
// @keyframes shimmer {
//   from {
//     background-position: 0 0;
//   }
//   to {
//     background-position: -200% 0;
//   }
// }
