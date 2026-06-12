import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative px-4">

      {/* HEADER – gornji lijevi kut */}
      <header className="absolute top-0 left-0 px-8 py-6 z-30">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">ABASA</h1>
        <p className="text-sm text-white opacity-90 drop-shadow">
          Welcome to the enterprise platform.
        </p>
      </header>

      {/* LOGIN CARD */}
     <div
  className="
    fade-in
    w-full max-w-[360px]
    rounded-[36px]
    p-10
    border border-[#141414]
    bg-gradient-to-b from-white/5 to-white/[0.02]
    backdrop-blur-xl
    shadow-[0_0_55px_-12px_rgba(0,0,0,0.85)]
    relative
    z-20
  "
>



        {/* Log in */}
        <h1 className="text-lg font-semibold mb-10 text-center text-white tracking-tight">
          Log in
        </h1>

        <div className="flex flex-col items-center gap-[15px]">

          {/* Email input */}
          <div className="w-[calc(50%+50px)] bg-black rounded-lg border border-white/20">
            <input
              type="email"
              placeholder="Email Address"
              className="
                w-full h-[24px] px-3 text-sm
                bg-black text-white
                border-none
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-white/40
                placeholder-gray-400
              "
            />
          </div>

          {/* Continue with Email */}
          <button
            className="
              w-[calc(50%+50px)] h-[48px]
              rounded-[14px] text-[15px] font-medium
              bg-white text-black
              border border-white/20
              hover:border-white hover:border-[3px]
              hover:bg-neutral-200
              transition
              flex items-center justify-center
              mb-[25px]
            "
          >
            Continue with Email
          </button>

          {/* Google */}
          <button
            className="
              w-[calc(50%+50px)] h-[48px]
              rounded-[14px] text-[15px] font-medium
              bg-[rgb(145,145,145)] text-black
              border border-transparent
              hover:bg-[rgb(220,220,220)]
              hover:border-white hover:border-[3px]
              transition
              flex items-center justify-center gap-2
            "
          >
            <FcGoogle size={18} />
            <span>Continue with Google</span>
          </button>

          {/* Apple */}
          <button
            className="
              w-[calc(50%+50px)] h-[48px]
              rounded-[14px] text-[15px] font-medium
              bg-[rgb(145,145,145)] text-black
              border border-transparent
              hover:bg-[rgb(220,220,220)]
              hover:border-white hover:border-[3px]
              transition
              flex items-center justify-center gap-2
            "
          >
            <FaApple size={18} className="text-black" />
            <span>Continue with Apple</span>
          </button>

          {/* Passkey */}
          <button
            className="
              w-[calc(50%+50px)] h-[48px]
              rounded-[14px] text-[15px] font-medium
              bg-[rgb(145,145,145)] text-black
              border border-transparent
              hover:bg-[rgb(220,220,220)]
              hover:border-white hover:border-[3px]
              transition
              flex items-center justify-center
            "
          >
            <span>Continue with Passkey</span>
          </button>

        </div>

        {/* Sign Up */}
        <p className="text-sm text-neutral-500 mt-[100px] text-center">
          Don’t have an account?{" "}
          <a
            href="/auth/register"
            className="text-neutral-400 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>

      {/* Powered by Copilot */}
      <div className="absolute bottom-6 flex items-center gap-2 opacity-80 z-20">
        <span className="text-[10px] text-white tracking-wide opacity-80">
          Powered by Copilot
        </span>
      </div>

    </div>
  );
}
