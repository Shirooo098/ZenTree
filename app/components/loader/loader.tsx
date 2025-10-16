import React from "react";

interface LoaderProps {
  size?: number; 
  thickness?: number; 
  center?: boolean;
}

export const Loader = ({ size = 5, thickness = 3, center = false }: LoaderProps) => {
  const sizeClass = `w-${size} h-${size}`;
  const borderClass = `border-${thickness}`;

  return (
    <div className={center ? "flex justify-center items-center min-h-screen" : ""}>
      <div
        className={`${sizeClass} ${borderClass} border-t-[#A89F94] border-[#ECE8DD] rounded-full animate-spin`}
      />
    </div>
  );
};
