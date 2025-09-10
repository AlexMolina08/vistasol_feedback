import { useState, useEffect } from 'react';
import backgroundImage from '../assets/apartamentos-vistasol.jpg';

const API_URL = "https://script.google.com/macros/s/AKfycbzS4HORyZRHaX1ZzjoqvPZzid6FlOWu68PvjGyOov2_IzsJvqyt3QlpfjzmUDpQe-Sx/exec";

const emojis = ['😡', '😕', '😐', '🙂', '😍'];

export default function App() {
  const [showThankYou, setShowThankYou] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pressedButton, setPressedButton] = useState<number | null>(null);

const sendFeedback = (choice: number) => {
  const payload = { choice, ua: navigator.userAgent };

  // Fire-and-forget; no preflight; browser won’t block
  fetch(API_URL, {
    method: "POST",
    mode: "no-cors", // opaque response; that’s fine for our kiosk
    headers: {
      "Content-Type": "text/plain;charset=utf-8", // simple request
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
};

  const handleFeedbackClick = (choice: number) => {
    // Ignore clicks during processing
    if (isProcessing) return;

    // Add immediate visual feedback
    setPressedButton(choice);
    setIsProcessing(true);
    
    // Brief delay to show press feedback before showing thank you
    setTimeout(() => {
      setShowThankYou(true);
      setPressedButton(null);
    }, 150);
    
    // Send feedback immediately
    sendFeedback(choice);

    // Show thank you for exactly 2 seconds
    setTimeout(() => {
      setShowThankYou(false);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/15 backdrop-blur-sm"></div>
      <div className="w-full max-w-5xl relative z-10 px-4">
        {showThankYou ? (
          <div className="bg-gradient-to-r from-emerald-50/95 to-green-50/95 backdrop-blur-md border-2 border-emerald-200/50 rounded-3xl p-12 text-center shadow-2xl transform animate-in fade-in-0 zoom-in-95 duration-500">
            <div className="mb-6">
              <div className="inline-block p-4 bg-emerald-100/80 rounded-full mb-4 animate-in zoom-in-0 duration-700 delay-150">
                <svg className="w-16 h-16 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-emerald-700 mb-4 animate-in slide-in-from-bottom-4 duration-600 delay-300">
              ¡Gracias!
            </h1>
            <p className="text-xl md:text-2xl text-emerald-600 font-medium animate-in slide-in-from-bottom-2 duration-500 delay-500">
              Su opinión es muy importante para nosotros
            </p>
          </div>
        ) : (
          <div className="relative bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
            {/* Apple-style liquid glass header */}
            <div className="relative bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-2xl border-b border-white/30 px-8 py-8 text-center">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
              
              <div className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800 tracking-tight">
                  ¿Cómo fue su experiencia?
                </h1>
                <p className="text-sm md:text-base text-gray-600 font-medium opacity-80">
                  Su opinión nos ayuda a mejorar nuestro servicio
                </p>
              </div>
              
              {/* Liquid glass effect highlights */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              <div className="absolute top-1 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            
            {/* Feedback buttons section */}
            <div className="px-8 py-12">
              <div className="flex justify-center items-center gap-4 md:gap-8 flex-wrap">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleFeedbackClick(index + 1)}
                    className={`
                      relative group
                      w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28
                      rounded-full
                      bg-gradient-to-br from-white to-gray-50
                      border-2 border-gray-200
                      shadow-lg hover:shadow-xl
                      transition-all duration-300 ease-out
                      transform hover:scale-110 active:scale-95
                      touch-manipulation
                      select-none
                      ${pressedButton === index + 1 ? 'scale-95 bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300' : ''}
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-300 active:border-indigo-400 cursor-pointer'}
                    `}
                    disabled={isProcessing}
                    style={{
                      minWidth: '80px',
                      minHeight: '80px',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <span className="text-4xl md:text-5xl lg:text-6xl block leading-none">
                      {emoji}
                    </span>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Ripple effect on press */}
                    {pressedButton === index + 1 && (
                      <div className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping"></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Rating labels */}
              <div className="flex justify-center items-center gap-4 md:gap-8 mt-6 text-sm md:text-base text-gray-600 font-medium flex-wrap">
                {['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'].map((label, index) => (
                  <span 
                    key={index} 
                    className="text-center w-20 md:w-24 lg:w-28"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
