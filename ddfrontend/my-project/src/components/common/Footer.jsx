import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-8">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-400 text-lg">
            &copy; {new Date().getFullYear()} DoubtDesk. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center md:justify-end space-y-2 md:space-y-0 md:space-x-8">
          <a
            href="#"
            className="text-gray-300 hover:text-white text-lg transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white text-lg transition-colors duration-200"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white text-lg transition-colors duration-200"
          >
            FAQ
          </a>
        </div>

        <div className="flex space-x-6">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <path d="M23.498 6.186a2.998 2.998 0 00-2.11-2.116C19.762 3.5 12 3.5 12 3.5s-7.762 0-9.388.57A2.998 2.998 0 00.502 6.186C0 7.817 0 12 0 12s0 4.183.502 5.814a2.998 2.998 0 002.11 2.116C4.238 20.5 12 20.5 12 20.5s7.762 0 9.388-.57a2.998 2.998 0 002.11-2.116C24 16.183 24 12 24 12s0-4.183-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777-7 2.476v6.759z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
