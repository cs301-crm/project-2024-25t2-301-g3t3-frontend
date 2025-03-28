"use client";
import { Loader2 } from "lucide-react";
import React from "react";

export const ClientLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      <div className="relative">
        {/* Animated spinner */}
        <Loader2 className="h-12 w-12 text-slate-400 animate-spin" />
        
        {/* Subtle pulsing background circle */}
        <div 
          className="absolute inset-0 rounded-full bg-slate-100 animate-pulse opacity-30" 
          style={{
            top: '-0.5rem',
            left: '-0.5rem',
            right: '-0.5rem',
            bottom: '-0.5rem'
          }} 
        />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-slate-800">Loading Client Details</h2>
        <p className="text-slate-500">Just a moment while we gather the information...</p>
      </div>

      {/* Progress indicator with CSS-in-JS */}
      <div className="w-full max-w-xs bg-slate-100 rounded-full h-1.5">
        <div 
          className="bg-slate-400 h-1.5 rounded-full"
          style={{
            animation: 'progress 2s ease-in-out infinite',
            width: '80%'
          }} 
        />
      </div>

      {/* CSS keyframes in a style tag */}
      <style>{`
        @keyframes progress {
          0% { width: 20%; }
          50% { width: 80%; }
          100% { width: 20%; }
        }
      `}</style>
    </div>
  );
};