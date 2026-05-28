import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20know%20about%20Class%2011%2F12%20Commerce%20batch%20admission."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.93 }}
      aria-label="Chat on WhatsApp"
    >
      {/* Outer pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
      {/* Second softer ring */}
      <span className="absolute -inset-1.5 rounded-full bg-green-500/15 animate-pulse" />

      {/* Button */}
      <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20c05c] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.5)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.7)] transition-all duration-300">
        {/* Official WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-8 h-8"
          fill="white"
        >
          <path d="M16.002 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.629 4.609 1.73 6.557L2.667 29.333l6.979-1.698A13.264 13.264 0 0 0 16.002 29.333C23.363 29.333 29.333 23.363 29.333 16S23.363 2.667 16.002 2.667zm0 2.4c5.93 0 10.934 4.937 10.934 10.933 0 5.998-5.004 10.934-10.934 10.934a10.9 10.9 0 0 1-5.55-1.516l-.398-.24-4.14 1.006 1.04-3.994-.265-.414A10.897 10.897 0 0 1 5.069 16c0-5.996 5.004-10.933 10.933-10.933zm-3.02 5.6c-.202 0-.53.075-.809.376-.278.3-1.062 1.038-1.062 2.531 0 1.493 1.087 2.937 1.239 3.139.152.201 2.119 3.39 5.22 4.618 2.578.99 3.1.793 3.66.743.56-.049 1.808-.739 2.063-1.454.254-.715.254-1.328.178-1.454-.076-.126-.278-.202-.58-.352-.303-.151-1.793-.884-2.07-.984-.278-.1-.48-.15-.682.151-.202.3-.78.984-.957 1.186-.176.202-.352.227-.654.076-.302-.152-1.275-.47-2.43-1.499-.898-.8-1.504-1.788-1.68-2.09-.177-.3-.019-.463.133-.612.136-.134.303-.352.454-.528.15-.176.2-.3.301-.503.1-.2.05-.376-.025-.527-.076-.15-.672-1.649-.93-2.254-.238-.567-.486-.493-.673-.502a12.1 12.1 0 0 0-.575-.013z"/>
        </svg>
      </div>
    </motion.a>
  );
}
