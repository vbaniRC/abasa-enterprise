import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] px-4">

      <div
        className="
        w-full max-w-[360px]   /* smanjeno za ~10% */
        rounded-[36px]         /* još jače zaobljeni rubovi */
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

        <div className="flex flex-col items-center gap-[20px]">

          {/* Email wrapper to force true black background */}
          <div className="w-1/2 bg-black rounded-lg">
            <input
              type="email"
              placeholder="Email Address"
              className="
                w-full h-[52px] px-3 text-sm
                bg-black text-white
                border border-white/10
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-white/40
                placeholder-white/40
              "
            />
          </div>

          {/* Continue with Email */}
          <button
            className="
            w-1/2 h-[48px] rounded-xl text-sm font-medium
            bg-white text-black
            hover:bg-neutral-200
            transition
            flex items-center justify-center
          "
          >
            Continue with Email
          </button>

          {/* Google */}
          <button
            className="
            w-1/2 h-[48px] rounded-xl text-sm font-medium
            bg-white text-black
            hover:bg-neutral-200
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
            w-1/2 h-[48px] rounded-xl text-sm font-medium
            bg-white text-black
            hover:bg-neutral-200
            transition
            flex items-center justify-center gap-2
          "
          >
            <FaApple size={18} />
            <span>Continue with Apple</span>
          </button>

          {/* Passkey */}
          <button
            className="
            w-1/2 h-[48px] rounded-xl text-sm font-medium
            bg-white text-black
            hover:bg-neutral-200
            transition
            flex items-center justify-center
          "
          >
            Continue with Passkey
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
    </div>
  );
}
