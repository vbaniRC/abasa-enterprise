import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0A] px-4">

      <div
        className="
        w-full max-w-[360px]
        rounded-[36px]
        p-10
        border border-[#141414]
        bg-gradient-to-b from-white/5 to-white/[0.02]
        backdrop-blur-xl
        shadow-[0_0_55px_-12px_rgba(0,0,0,0.85)]
        relative
      "
      >

        {/* ABASA - gornji desni kut */}
        <div className="absolute top-6 right-6 text-white/70 text-xs font-medium tracking-wide">
          ABASA
        </div>

        {/* Log in - centrirano */}
        <h1 className="text-lg font-semibold mb-10 text-center text-white tracking-tight">
          Log in
        </h1>

        <div className="flex flex-col items-center gap-[15px]">

          {/* Email wrapper */}
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
            w-[calc(50%+50px)] h-[48px] rounded-xl text-[15px] font-medium
            bg-white text-black
            border border-white/20
            hover:border-white
            transition
            flex items-center justify-center
            mb-[25px] /* ovo + gap daje ukupno 40px razmaka */
          "
          >
            Continue with Email
          </button>

     {/* Google */}
{/* Google */}
<button
  className="
    w-[calc(50%+50px)] h-[48px]
    rounded-full text-[15px] font-medium
    bg-[#E5E5E5] text-black
    border border-white/20
    hover:bg-[#F0F0F0] hover:border-white
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
    rounded-full text-[15px] font-medium
    bg-[#E5E5E5] text-black
    border border-white/20
    hover:bg-[#F0F0F0] hover:border-white
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
    rounded-full text-[15px] font-medium
    bg-[#E5E5E5] text-black
    border border-white/20
    hover:bg-[#F0F0F0] hover:border-white
    transition
    flex items-center justify-center
  "
>
  <span>Continue with Passkey</span>
</button>


          {/* Show other options */}
          <button className="text-sm text-neutral-400 hover:underline mt-1">
            Show other options
          </button>
        </div>

        {/* Sign Up link — spušteno 100px */}
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
      <div className="mt-6 text-[10px] text-white tracking-wide opacity-60">
        Powered by Copilot
      </div>
    </div>
  );
}
