import React from 'react';

interface WaitingDotsProps {
  width: number;
  height: number;
}

const WaitingDots: React.FC<WaitingDotsProps> = ({ width, height }) => {
  return (
    <span className="inline-flex">
      <span 
        className={`animate-bounce mx-0.5 bg-current rounded-full bg-gradient-to-r from-white to-purple-500`}
        style={{ width: `${width}px`, height: `${height}px` }}
      ></span>
      <span 
        className={`animate-bounce mx-0.5 bg-current rounded-full [animation-delay:200ms] bg-gradient-to-r from-white to-purple-500`}
        style={{ width: `${width}px`, height: `${height}px` }}
      ></span>
      <span 
        className={`animate-bounce mx-0.5 bg-current rounded-full [animation-delay:400ms] bg-gradient-to-r from-white to-purple-500`}
        style={{ width: `${width}px`, height: `${height}px` }}
      ></span>
    </span>
  );
};

export default WaitingDots;