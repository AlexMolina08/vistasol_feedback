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
      {/* Blurred overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div>
      <div className="w-full max-w-4xl relative z-10">
        {showThankYou ? (
          <div className="bg-green-50/90 backdrop-blur-sm border border-green-200 rounded-xl p-6 text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-indigo-600 animate-pulse">
              Thank you!
            </h1>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-4xl w-full text-center mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
               How was your experience?
             </h1>
            <div className="flex justify-center gap-8 mb-8">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleFeedbackClick(index + 1)}
                  className="text-8xl hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
                  disabled={isProcessing}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
