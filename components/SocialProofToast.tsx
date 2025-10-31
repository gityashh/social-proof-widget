
import React, { useState, useEffect } from 'react';
import { PurchaseEvent } from '../types';

interface SocialProofToastProps {
  event: PurchaseEvent;
}

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-cyan-400">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);


export const SocialProofToast: React.FC<SocialProofToastProps> = ({ event }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timerIn = setTimeout(() => setVisible(true), 100);
    
    // Animate out and unmount
    const timerOut = setTimeout(() => setVisible(false), 5000);

    return () => {
      clearTimeout(timerIn);
      clearTimeout(timerOut);
    };
  }, []);

  const timeAgo = Math.round((new Date().getTime() - event.timestamp.getTime()) / 1000);

  return (
    <div
      className={`fixed bottom-5 left-5 w-80 p-4 rounded-xl shadow-2xl shadow-black/50 bg-gray-800 border border-gray-700
                  transform transition-all duration-500 ease-in-out
                  ${visible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
            <CheckCircleIcon/>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-bold text-white">
            {event.name} from {event.location}
          </p>
          <p className="mt-1 text-sm text-gray-300">
            Just purchased the {event.productName}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            {timeAgo <= 2 ? 'Just now' : `${timeAgo} seconds ago`}
          </p>
        </div>
      </div>
    </div>
  );
};
