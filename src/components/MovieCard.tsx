"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Movie } from "@/lib/mockMovies";
import { Star, Play } from "lucide-react";
import { getMovieTrailer } from "@/lib/tmdb";

interface MovieCardProps {
    movie: Movie;
    onSwipe: (dir: "left" | "right", movie: Movie) => void;
    isFront: boolean;
}

export default function MovieCard({ movie, onSwipe, isFront }: MovieCardProps) {
    const x = useMotionValue(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

    // Fetch trailer when card expands
    useEffect(() => {
        if (isExpanded && !trailerUrl && !isLoadingTrailer) {
            async function fetchTrailer() {
                setIsLoadingTrailer(true);
                const url = await getMovieTrailer(movie.id);
                setTrailerUrl(url);
                setIsLoadingTrailer(false);
            }
            fetchTrailer();
        }
    }, [isExpanded, movie.id, trailerUrl, isLoadingTrailer]);

    // Rotate card as it gets dragged
    const rotateRaw = useTransform(x, [-200, 200], [-10, 10]);
    const rotate = isFront ? rotateRaw : 0;

    // Opacity of "LIKE" or "NOPE" stamp based on drag
    const opacityRight = useTransform(x, [0, 150], [0, 1]);
    const opacityLeft = useTransform(x, [0, -150], [0, 1]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe("right", movie);
        } else if (info.offset.x < -100) {
            onSwipe("left", movie);
        }
    };

    return (
        <motion.div
            className="absolute w-full h-full rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden cursor-grab active:cursor-grabbing bg-white dark:bg-gray-900"
            style={{
                x: isFront ? x : 0,
                rotate,
                boxShadow: isFront ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            onTap={() => setIsExpanded(prev => !prev)}
            animate={{
                scale: isFront ? 1 : 0.95,
                y: isFront ? 0 : 20,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Background Image */}
            <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${movie.posterUrl})` }}
            >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black transition-all duration-300 ${isExpanded ? 'via-black/80 to-black/40' : 'via-black/50 to-transparent'} opacity-90`} />
            </div>

            {/* Swipe Tags */}
            {isFront && (
                <>
                    <motion.div
                        style={{ opacity: opacityRight }}
                        className="absolute top-10 left-10 border-4 border-green-500 rounded-lg px-4 py-2 rotate-[-15deg] z-10"
                    >
                        <span className="text-4xl font-black text-green-500 tracking-wider">LIKE</span>
                    </motion.div>
                    <motion.div
                        style={{ opacity: opacityLeft }}
                        className="absolute top-10 right-10 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg] z-10"
                    >
                        <span className="text-4xl font-black text-red-500 tracking-wider">NOPE</span>
                    </motion.div>
                </>
            )}

            {/* Movie Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-left">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold leading-tight">{movie.title}</h2>
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded text-yellow-500 font-semibold">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <span>{movie.rating}</span>
                    </div>
                </div>
                <p className="text-sm text-gray-300 font-medium mb-2">{movie.year} • {movie.genre.join(", ")}</p>
                <div className={`overflow-y-auto custom-scrollbar transition-all duration-300 ${isExpanded ? 'max-h-60' : 'max-h-16'}`}>
                    <p className={`text-sm text-gray-400 ${isExpanded ? "mb-4" : "line-clamp-3"}`}>{movie.description}</p>

                    {/* Trailer Button */}
                    {isExpanded && (
                        <div className="mt-2 text-center animate-in fade-in duration-300">
                            {isLoadingTrailer ? (
                                <div className="animate-pulse flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-medium w-full max-w-[200px] mx-auto opacity-80 cursor-not-allowed">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-gray-600 border-t-gray-700 dark:border-t-gray-400 animate-spin"></div>
                                    <span>Loading Trailer...</span>
                                </div>
                            ) : trailerUrl ? (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg mt-2 mb-4 bg-black/50">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1&mute=1&controls=1&showinfo=0&rel=0`}
                                        title={`${movie.title} Trailer`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute top-0 left-0 w-full h-full border-0"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
