"use client";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full max-w-[460px] mx-auto">
        {children}
      </div>
    </div>
  );
}

