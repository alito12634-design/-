import React from 'react';

interface SchoolLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark-bg' | 'light-bg';
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'md',
  variant = 'light-bg',
}) => {
  const dimensions =
    size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-16 h-16' : 'w-11 h-11';

  const ringBg = variant === 'dark-bg' ? '#162241' : '#111C38';

  return (
    <div
      className={`${dimensions} shrink-0 rounded-full flex items-center justify-center shadow-sm border-2 border-[#EAB308]/80`}
      style={{ backgroundColor: ringBg }}
      aria-label="شعار مدرسة شمس المعارف الأساسية الأهلية"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[82%] h-[82%]"
      >
        {/* Outer subtle sky-blue arc */}
        <circle
          cx="32"
          cy="32"
          r="27"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />

        {/* Three stars above sun */}
        <path
          d="M32 6.5L33.1 9.1L35.9 9.3L33.7 11.1L34.4 13.8L32 12.3L29.6 13.8L30.3 11.1L28.1 9.3L30.9 9.1L32 6.5Z"
          fill="#38BDF8"
        />
        <circle cx="23" cy="11.5" r="1.3" fill="#EAB308" />
        <circle cx="41" cy="11.5" r="1.3" fill="#EAB308" />

        {/* Sun rays */}
        <path
          d="M32 14V19M22.5 17.5L25.2 21.5M41.5 17.5L38.8 21.5M17 24.5L21.5 26.5M47 24.5L42.5 26.5"
          stroke="#FACC15"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Rising Sun */}
        <path
          d="M23 32C23 27.0294 27.0294 23 32 23C36.9706 23 41 27.0294 41 32H23Z"
          fill="#FACC15"
        />

        {/* Open Book in Sky Blue */}
        <path
          d="M15 33.5C21 33.5 27.5 34.8 32 38C36.5 34.8 43 33.5 49 33.5V46.5C43 46.5 36.5 47.8 32 51C27.5 47.8 21 46.5 15 46.5V33.5Z"
          fill="#38BDF8"
          stroke="#EAB308"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* Book center spine */}
        <path
          d="M32 38V51"
          stroke="#0F1A36"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Fountain Pen Nib */}
        <path
          d="M32 35.5L36.5 45.5L34 49.5H30L27.5 45.5L32 35.5Z"
          fill="#111C38"
          stroke="#FACC15"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <circle cx="32" cy="43.5" r="1.2" fill="#FACC15" />
      </svg>
    </div>
  );
};
