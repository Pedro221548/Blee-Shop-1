
import React from 'react';

interface BeeLogoProps {
  size?: number;
  className?: string;
}

const BeeLogo: React.FC<BeeLogoProps> = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Motion Lines */}
      <path d="M25 65H35" stroke="black" strokeWidth="4" strokeLinecap="round" />
      <path d="M22 75H32" stroke="black" strokeWidth="4" strokeLinecap="round" />
      
      {/* Wings */}
      <path 
        d="M48 40C40 25 55 15 65 25C75 15 90 25 82 40" 
        fill="white" 
        stroke="black" 
        strokeWidth="3.5" 
        strokeLinejoin="round" 
      />
      
      {/* Stinger */}
      <path d="M38 75L30 82L42 78" fill="black" />

      {/* Body */}
      <ellipse cx="55" cy="65" rx="22" ry="18" fill="#FFC107" stroke="black" strokeWidth="3.5" />
      
      {/* Stripes */}
      <path d="M48 48C45 55 45 75 48 82" stroke="black" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M62 48C59 55 59 75 62 82" stroke="black" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* Box */}
      <rect x="58" y="75" width="22" height="18" rx="2" fill="#A1887F" stroke="black" strokeWidth="3.5" />
      <path d="M69 75V85M58 80H80" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <path d="M69 75L74 79M69 75L64 79" stroke="black" strokeWidth="2" strokeLinecap="round" />

      {/* Head */}
      <circle cx="82" cy="55" r="15" fill="#FFC107" stroke="black" strokeWidth="3.5" />
      
      {/* Eye */}
      <circle cx="88" cy="52" r="2.5" fill="black" />
      
      {/* Antennae */}
      <path d="M85 42C88 35 95 35 98 32" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M78 42C80 32 85 30 85 25" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
};

export default BeeLogo;
