"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { cn } from "../../lib/utils";

interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  iconMagnification?: number;
  iconDistance?: number;
}

interface DockContextType {
  iconMagnification: number;
  iconDistance: number;
  mouseX: number | null;
}

const DockContext = createContext<DockContextType>({
  iconMagnification: 40,
  iconDistance: 80,
  mouseX: null,
});

export function Dock({
  children,
  className,
  iconMagnification = 40,
  iconDistance = 80,
  ...props
}: DockProps) {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  return (
    <DockContext.Provider
      value={{
        iconMagnification,
        iconDistance,
        mouseX,
      }}
    >
      <div
        ref={ref}
        className={cn("flex h-16 items-end justify-center gap-4 px-4", className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    </DockContext.Provider>
  );
}

interface DockIconProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DockIcon({ className, children, ...props }: DockIconProps) {
  const { iconMagnification, iconDistance, mouseX } = useContext(DockContext);
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(0);

  React.useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setWidth(rect.width);
    setLeft(rect.left);
  }, []);

  const calculateScale = () => {
    if (mouseX === null) return 1;
    const centerX = left + width / 2;
    const distance = Math.abs(mouseX - centerX);
    const scale = 1 + (iconMagnification / 100) * Math.max(0, 1 - distance / iconDistance);
    return scale;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "aspect-square h-12 rounded-xl bg-white/10 p-2 text-white transition-all duration-100",
        className
      )}
      style={{
        transform: `scale(${calculateScale()})`,
        transformOrigin: "bottom",
      }}
      {...props}
    >
      {children}
    </div>
  );
} 