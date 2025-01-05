import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
}

export const OtpInput = ({ 
  length = 6,
  onComplete = () => {}
}: OtpInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusNext = (index: number) => {
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrev = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value) {
      focusNext(index);
      if (newOtp.every(v => v) && newOtp.length === length) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index]) {
      focusPrev(index);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((value, i) => {
      newOtp[i] = value;
    });
    setOtp(newOtp);

    if (newOtp.every(v => v) && newOtp.length === length) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <div className="flex gap-3">
      {otp.map((value, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-14 h-14 text-center text-2xl font-bold rounded-xl
                   bg-white/10 backdrop-blur-md border-2 border-white/20
                   text-white shadow-lg outline-none
                   focus:border-white/40 focus:bg-white/20
                   transition-all duration-300"
        />
      ))}
    </div>
  );
};