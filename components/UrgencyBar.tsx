
import React, { useState, useEffect } from 'react';

interface UrgencyBarProps {
  stock: number;
  saleEndTime: Date;
}

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const formatTime = (time: number) => time.toString().padStart(2, '0');

export const UrgencyBar: React.FC<UrgencyBarProps> = ({ stock, saleEndTime }) => {
  const calculateTimeLeft = () => {
    const difference = +saleEndTime - +new Date();
    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60))),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const stockPercentage = Math.min((stock / 15) * 100, 100); // Assuming max stock was 15 for percentage

  return (
    <div className="space-y-4">
      {/* Stock message */}
      <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg">
        <div className="flex justify-between items-center mb-1 text-sm font-semibold">
          <span>Hurry! Only <span className="font-bold text-white">{stock}</span> left in stock.</span>
          <span>{stock > 0 ? 'High demand' : 'Sold out'}</span>
        </div>
        <div className="w-full bg-red-900/50 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-red-500 to-orange-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${stockPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Sale Countdown */}
      <div className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-200 p-3 rounded-lg flex items-center">
        <ClockIcon />
        <span className="font-semibold text-sm mr-4">Flash sale ends in:</span>
        <div className="flex items-center space-x-2 font-mono text-lg font-bold text-white">
            <span>{formatTime(timeLeft.hours)}</span>
            <span>:</span>
            <span>{formatTime(timeLeft.minutes)}</span>
            <span>:</span>
            <span>{formatTime(timeLeft.seconds)}</span>
        </div>
      </div>
    </div>
  );
};
