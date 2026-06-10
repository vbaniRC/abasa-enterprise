"use client";

import { useState, useRef } from "react";

export default function VerifyPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-semibold mb-6">Enter Verification Code</h1>

      <div className="flex flex-row">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="
              w-[47px]          /* širina smanjena za 3px */
              h-[55px]          /* visina smanjena za 5px */
              mx-[3px]          /* razmak 3px između polja */
              rounded-[10px]
              text-center
              text-[24px]
              bg-black
              text-white
              border border-white/20
              focus:outline-none
              focus:border-white
            "
          />
        ))}
      </div>

      <button
        className="mt-8 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
        onClick={() => console.log("Submitting code:", code.join(""))}
      >
        Verify
      </button>
    </div>
  );
}
