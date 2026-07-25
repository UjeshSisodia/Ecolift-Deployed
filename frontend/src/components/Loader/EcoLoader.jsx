import React from "react";

const EcoLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-green-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Inline custom keyframes for the driving loop */}
      <style>
        {`
          @keyframes drive {
            0% { transform: translateX(-200%); }
            45% { transform: translateX(0%); }
            55% { transform: translateX(0%); }
            100% { transform: translateX(200%); }
          }
          .animate-drive {
            animation: drive 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `}
      </style>

      {/* Animation Container */}
      <div className="relative w-64 h-24 flex items-end justify-center border-b-4 border-green-800 pb-1 overflow-hidden">
        {/* The Car & Leaf */}
        <div className="animate-drive absolute bottom-1 flex items-center text-green-700">
          <span
            className="material-symbols-outlined text-6xl drop-shadow-md"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            directions_car
          </span>
          {/* Trailing Eco Leaf */}
          <span
            className="material-symbols-outlined absolute -top-3 -left-2 text-2xl text-green-500 animate-bounce"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            eco
          </span>
        </div>
      </div>

      {/* Brand Text */}
      <div className="mt-8 flex items-center gap-2 animate-pulse">
        <span className="material-symbols-outlined text-green-700 text-3xl">
          eco
        </span>
        <h2 className="text-3xl font-bold text-green-800 tracking-wide">
          EcoLift
        </h2>
      </div>

      <p className="text-sm text-green-600 font-medium mt-3 tracking-widest uppercase">
        Starting Engines...
      </p>
    </div>
  );
};

export default EcoLoader;
