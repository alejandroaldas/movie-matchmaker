"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}`,
                    },
                });
                if (error) throw error;
                // Depending on settings, sign up could auto-login or require email verification
                // For simplicity, we just handle errors and show success
            }

            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-sm overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/50 dark:border-gray-800/50 rounded-3xl shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 rounded-full"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-2">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {isLogin
                                ? "Sign in to save your favorite movies"
                                : "Join to start matching with movies"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder:text-gray-400 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder:text-gray-400 dark:text-white"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-lg border border-red-100">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/25 flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                isLogin ? "Sign In" : "Sign Up"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
