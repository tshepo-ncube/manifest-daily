import React, { useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { auth, provider, microsoftProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";

interface AuthFormProps {
  onBack: () => void;
  onAuthSuccess: () => void;
}

export default function AuthForm({ onBack, onAuthSuccess }: AuthFormProps) {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingMicrosoft, setLoadingMicrosoft] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    setMessage("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Store user data in localStorage for compatibility
      const userData = {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        createdAt: user.metadata.creationTime,
      };
      localStorage.setItem("manifesting-user", JSON.stringify(userData));
      onAuthSuccess();
    } catch (error: any) {
      setMessage(error.message || "Google sign-in failed");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setLoadingMicrosoft(true);
    setMessage("");
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      const user = result.user;
      // Store user data in localStorage for compatibility
      const userData = {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        createdAt: user.metadata.creationTime,
      };
      localStorage.setItem("manifesting-user", JSON.stringify(userData));
      onAuthSuccess();
    } catch (error: any) {
      setMessage(error.message || "Microsoft sign-in failed");
    } finally {
      setLoadingMicrosoft(false);
    }
  };

  // Google SVG Icon
  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <g>
        <path
          fill="#4285F4"
          d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.3 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5V20z"
        />
        <path
          fill="#34A853"
          d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.3 5.1 29.4 3 24 3c-7.2 0-13.4 3.1-17.7 8z"
        />
        <path
          fill="#FBBC05"
          d="M24 45c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.8 36 24 36 24 36c-5.8 0-10.7-2.9-13.7-7.2l-7 5.4C7.6 41.9 15.2 45 24 45z"
        />
        <path
          fill="#EA4335"
          d="M44.5 20H24v8.5h11.7c-1.6 4.1-5.6 7-11.7 7-5.8 0-10.7-2.9-13.7-7.2l-7 5.4C7.6 41.9 15.2 45 24 45c10.5 0 19.5-7.6 21-17.5V20z"
        />
      </g>
    </svg>
  );

  // Microsoft SVG Icon
  const MicrosoftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <g>
        <rect fill="#F35325" x="1" y="1" width="10" height="10" />
        <rect fill="#81BC06" x="13" y="1" width="10" height="10" />
        <rect fill="#05A6F0" x="1" y="13" width="10" height="10" />
        <rect fill="#FFBA08" x="13" y="13" width="10" height="10" />
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={onBack}
              className="absolute top-6 left-6 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-300 mr-2" />
              <h1 className="text-2xl font-bold text-white">Manifest Daily</h1>
            </div>
            <h2 className="text-xl text-gray-300">Sign in</h2>
          </div>

          {/* Google Sign-In Button */}
          <div className="space-y-6">
            {message && (
              <div className="p-3 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30">
                {message}
              </div>
            )}
            <button
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle || loadingMicrosoft}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <GoogleIcon />
              {loadingGoogle ? "Signing in..." : "Sign in with Google"}
            </button>
            <button
              onClick={handleMicrosoftSignIn}
              disabled={loadingGoogle || loadingMicrosoft}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4"
            >
              <MicrosoftIcon />
              {loadingMicrosoft ? "Signing in..." : "Sign in with Microsoft"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
