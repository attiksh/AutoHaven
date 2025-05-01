// Icons used throughout the application

// DirectionsCar icon (used in header and footer)
import React from "react";
export function DirectionsCar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  );
}

// Menu icon (from header)
export function Menu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// Close icon (from header)
export function Close(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// AccountCircle icon (from header)
export function AccountCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  );
}

// Social media icons (from footer)
export function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M9.4 12H12V23.7C5.7 22.8 1 17.5 1 11V11C1 5.1 5.9 0.3 11.8 0.3C17.7 0.3 22.6 5.1 22.6 11V11C22.6 17 17.8 22.2 11.5 23C11.2 23 11 22.7 11 22.4V16.7H13.5C13.8 16.7 14 16.5 14.1 16.2L14.5 14.2C14.6 13.9 14.4 13.6 14 13.6H11V10.8C11 10.3 11.4 9.9 11.9 9.9H14.2C14.5 9.9 14.7 9.7 14.7 9.4V7.4C14.7 7.1 14.5 6.9 14.2 6.9C13.1 6.8 12 6.7 10.9 6.7C9.9 6.7 9.4 7.2 9.4 8.2V13.7C9.3 13.7 9.4 12 9.4 12Z" />
    </svg>
  );
}

export function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M22.5 5.8c-.7.3-1.5.5-2.4.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.8-4.1 4.1 0 .3 0 .6.1.9-3.4-.2-6.4-1.8-8.4-4.3-.4.6-.6 1.3-.6 2.1 0 1.4.7 2.7 1.8 3.4-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.8-5.1 1.8-.3 0-.7 0-1-.1 1.8 1.2 4 1.8 6.3 1.8 7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1Z" />
    </svg>
  );
}

export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4 1.3-.1 1.6-.1 4.9-.1M12 0C8.7 0 8.3 0 7.1.1c-1.3.1-2.2.2-3 .5C3.2.9 2.5 1.2 1.8 1.8 1.2 2.5.8 3.2.6 4.1c-.3.8-.5 1.7-.5 3-.1 1.3-.1 1.6-.1 4.9s0 3.6.1 4.9c.1 1.3.2 2.2.5 3 .3.9.6 1.6 1.3 2.3.7.6 1.4 1.1 2.3 1.3.8.3 1.7.5 3 .5 1.2.1 1.6.1 4.9.1s3.6 0 4.9-.1c1.3-.1 2.2-.2 3-.5.9-.3 1.6-.6 2.3-1.3.6-.7 1.1-1.4 1.3-2.3.3-.8.5-1.7.5-3 .1-1.2.1-1.6.1-4.9s0-3.6-.1-4.9c-.1-1.3-.2-2.2-.5-3-.3-.9-.6-1.6-1.3-2.3-.7-.6-1.4-1.1-2.3-1.3-.8-.3-1.7-.5-3-.5-1.2-.1-1.6-.1-4.9-.1Z" />
      <path d="M12 5.8c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2-2.8-6.2-6.2-6.2Zm0 10.3c-2.2 0-4.1-1.8-4.1-4.1 0-2.2 1.8-4.1 4.1-4.1 2.2 0 4.1 1.8 4.1 4.1 0 2.3-1.8 4.1-4.1 4.1ZM19.8 5.6c0 .8-.6 1.4-1.4 1.4-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4c.8 0 1.4.6 1.4 1.4Z" />
    </svg>
  );
}

export function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M23 8c-.2-1.2-.9-2.2-2.1-2.4-1.8-.3-9-.3-9-.3s-7.1 0-8.9.3C1.7 5.8 1 6.8.8 8c-.3 1.8-.3 5.5-.3 5.5s0 3.7.3 5.5c.2 1.2.9 2.2 2.1 2.4 1.8.3 9 .3 9 .3s7.1 0 8.9-.3c1.2-.2 1.9-1.2 2.1-2.4.3-1.8.3-5.5.3-5.5s0-3.7-.2-5.5ZM8.2 14.3V9.2l6 2.6-6 2.5Z" />
    </svg>
  );
}

// Icon for Star - used in ratings
export function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export function StarBorder(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
    </svg>
  );
}

export function StarHalf(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
    </svg>
  );
}

export function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function HeartFilled(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function MessageCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function Verified(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
  );
}

export function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  );
}

export function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
    </svg>
  );
}

export function Handshake(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a.9959.9959 0 0 1 0-1.42c.39-.38 1.03-.39 1.42 0zm2.83-2.83c.39.39.39 1.03 0 1.42-.39.39-1.03.39-1.42 0a.9959.9959 0 0 1 0-1.42c.39-.38 1.03-.39 1.42 0zm3.36.71c.39-.39 1.03-.39 1.42 0 .39.39.39 1.03 0 1.42-.39.39-1.03.39-1.42 0a.9959.9959 0 0 1 0-1.42zm-8.49-5.66a.9959.9959 0 0 1 1.42 0c.39.39.39 1.03 0 1.42-.39.39-1.03.39-1.42 0a.9959.9959 0 0 1 0-1.42zm2.83 2.83c.39.39.39 1.03 0 1.42-.39.39-1.03.39-1.42 0a.9959.9959 0 0 1 0-1.42c.39-.39 1.03-.39 1.42 0zm14.08 4.93c-.33.48-.79.86-1.34 1.05l-4.23 1.45-.29.1c-.27.09-.56.14-.84.14-.48 0-.96-.12-1.39-.35l-3.2-1.74a.608.608 0 0 0-.65.04c-.34.26-.32.73.03 1l2.5 2.1c.3.25.22.69-.15.8l-2.96.99c-.33.11-.71.02-.97-.23l-6.37-6.15a5.295 5.295 0 0 1-1.3-2.23L2 9.7c-.37-.93.01-1.99.88-2.48L5.05 6.2c1.16-.64 2.58-.12 3.17 1.08l.36.73c.17.34.53.54.91.54l5.39-.01c.39 0 .71-.32.71-.71a.714.714 0 0 0-.35-.61l-3.35-2.02h-.09c-.32 0-.64.11-.91.31l-1.39 1.02a.61.61 0 0 1-.82-.17l-.3-.4c-.65-.87-.9-1.92-.69-2.98.21-1.05.86-1.99 1.78-2.61 1.39-.93 3.07-1.05 4.58-.31l4.09 2.04a3.957 3.957 0 0 1 1.94 2.7l.19 1.29c.16 1.02.04 2.07-.37 3.01zM2.07 11.97l-1 2c-.37.73-.09 1.62.63 1.98l9.65 4.83c.34.17.75.15 1.05-.06l2.78-1.86c.5-.33.72-.93.49-1.5l-1.14-2.84c-.16-.39-.15-.82.01-1.2l.5-1.18c.36-.84.18-1.8-.44-2.43l-6.38-6.43a.998.998 0 0 0-1.41.01l-4.43 4.44c-.39.39-.39 1.03 0 1.42.39.4 1.03.4 1.42 0l3.45-3.45L13.18 9c.33.34.24.89-.19 1.1l-1.65.79c-.35.17-.52.59-.36.95l.4.93c.2.45.06.99-.34 1.31l-.97.8c-.4.33-.98.33-1.39.01l-1.84-1.47c-.39-.31-.96-.29-1.31.08l-4.46 4.56c-.49.5-.49 1.31 0 1.81" />
    </svg>
  );
}
