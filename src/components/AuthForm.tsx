import React, { useState } from "react";
import { Sparkles, ArrowLeft, LogIn } from "lucide-react";
import { auth, provider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";

interface AuthFormProps {
  onBack: () => void;
  onAuthSuccess: () => void;
}

export default function AuthForm({ onBack, onAuthSuccess }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

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
            <h2 className="text-xl text-gray-300">Sign in with Google</h2>
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
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
