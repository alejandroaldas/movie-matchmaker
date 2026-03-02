"use client";

import { motion } from "framer-motion";
import { Movie } from "@/lib/mockMovies";
import { X, Star, Trash2 } from "lucide-react";

interface WatchlistProps {
    movies: Movie[];
    onClose: () => void;
    onRemove: (id: string) => void;
}

export default function Watchlist({ movies, onClose, onRemove }: WatchlistProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="absolute inset-0 bg-gray-50 dark:bg-gray-950 z-50 flex flex-col"
        >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-widest uppercase">My Watchlist</h2>
                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {movies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p className="text-lg">Your watchlist is empty.</p>
                        <p className="text-sm">Swipe right on movies to add them here.</p>
                    </div>
                ) : (
                    movies.map((movie) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={movie.id}
                            className="flex gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl items-center relative"
                        >
                            <img src={movie.posterUrl} alt={movie.title} className="w-20 h-28 object-cover rounded-md shadow-md" />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{movie.title}</h3>
                                <div className="flex items-center gap-1 text-sm text-yellow-500 font-semibold mb-1">
                                    <Star className="w-4 h-4 fill-yellow-500" />
                                    <span>{movie.rating}</span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">{movie.genre.join(", ")}</p>
                                <p className="text-xs text-gray-500 mt-1">{movie.year}</p>
                            </div>

                            <button
                                onClick={() => onRemove(movie.id)}
                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-full transition absolute right-4"
                                title="Remove from Watchlist"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
