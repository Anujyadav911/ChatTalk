import { useState } from "react";
import { MessageCircleIcon } from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white"
      data-theme="light"
    >
      <div className="border border-pink-200 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-[#fef6f9] rounded-xl shadow-xl overflow-hidden">
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col text-black">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <MessageCircleIcon className="size-9 text-pink-400" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 tracking-wider">
              BubbleTalk
            </span>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="alert alert-error mb-4 bg-red-600 text-white">
              <span>{error.response?.data?.message || "Signup failed"}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm text-black/70">
                    Join BubbleTalk and start making friends!
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Full Name */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-black">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full bg-white text-black"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({ ...signupData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-black">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      className="input input-bordered w-full bg-white text-black"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-black">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      className="input input-bordered w-full bg-white text-black"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      required
                    />
                    <p className="text-xs text-black/60 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight text-black/80">
                        I agree to the{" "}
                        <span className="text-pink-500 hover:underline">terms of service</span> and{" "}
                        <span className="text-pink-500 hover:underline">privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  className="btn bg-pink-300 hover:bg-pink-400 text-white w-full border-none"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Link to Login */}
                <div className="text-center mt-4">
                  <p className="text-sm text-black">
                    Already have an account?{" "}
                    <Link to="/login" className="text-pink-500 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-[#fdeef3] items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/image.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold text-black">
                Connect with partners worldwide
              </h2>
              <p className="text-black/70">
              Connect instantly through chat and video calls — make conversations more personal, fun, and real with BubbleTalk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
