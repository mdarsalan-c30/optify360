"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

export function AnimatedCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(latest);
        },
      });
      return () => controls.stop();
    }
  }, [value, isInView]);

  const isDecimal = value % 1 !== 0;
  const formattedValue = isDecimal ? displayValue.toFixed(1) : Math.round(displayValue);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
      <span className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">
        {formattedValue}{suffix}
      </span>
      <span className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center font-medium">
        {label}
      </span>
    </div>
  );
}
