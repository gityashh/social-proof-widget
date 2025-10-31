
import React from 'react';

interface ViewerCountProps {
  count: number;
}

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-cyan-400">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);


export const ViewerCount: React.FC<ViewerCountProps> = ({ count }) => {
  return (
    <div className="inline-flex items-center bg-gray-700/50 text-gray-200 text-sm font-medium px-4 py-2 rounded-full">
      <EyeIcon />
      <span><span className="font-bold text-white">{count}</span> people are viewing this right now</span>
    </div>
  );
};
