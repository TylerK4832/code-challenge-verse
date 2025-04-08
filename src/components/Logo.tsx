
import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  // Set height and width based on size prop
  let dimensions = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  return (
    <div className={`${dimensions[size]} ${className}`}>
      <img 
        src="/lovable-uploads/ceafdca8-3ac3-4b6e-bb51-49cfa542b3ef.png" 
        alt="CodePrism Logo"
        className="h-full w-auto"
      />
    </div>
  );
};

export default Logo;
