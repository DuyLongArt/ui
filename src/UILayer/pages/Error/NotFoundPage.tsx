import React from 'react';

// You can customize the props to pass different error codes and messages
interface ErrorPageProps {
  errorCode?: string;
  errorMessage?: string;
  errorDescription?: string;
  homePath?: string;
}

// A simple SVG icon component for the error illustration
const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="96"
    height="96"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-indigo-400"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);


// Renamed component to 'ErrorPageComponent' to resolve the naming conflict.
// The name 'Error' is a built-in JavaScript constructor and cannot be used as a JSX element name.
const NotFoundPage: React.FC<ErrorPageProps> = ({
  errorCode = '404',
  errorMessage = 'Page Not Found',
  errorDescription = "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or maybe you just mistyped the URL.",
  homePath = '/home', // In a real app, this would be '/'
}) => {
  return (
    <div className="bg-gray-900 font-sans text-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-4xl mx-auto p-8">
          
          {/* Left Side: Illustration and Error Code */}
          <div className="relative flex-shrink-0 mb-8 md:mb-0 md:mr-12 text-center md:text-left">
            <div className="absolute -inset-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full blur-xl opacity-25 animate-pulse"></div>
            <div className="relative z-10 p-6 bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-700">
                <ErrorIcon />
            </div>
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-white/10 select-none z-0">
              {errorCode}
            </h1>
          </div>

          {/* Right Side: Content */}
          <div className="relative z-10 text-center md:text-left">
            <p className="text-2xl md:text-3xl font-bold text-indigo-400 mb-2">
              ERROR {errorCode}
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              {errorMessage}
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-md">
              {errorDescription}
            </p>
            <a
              href={homePath}
              className="inline-block px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Go Back Home
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
