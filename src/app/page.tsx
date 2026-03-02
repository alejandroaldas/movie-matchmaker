"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/lib/mockMovies";
import { getPopularMovies, mapTMDBToMovie } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Watchlist from "@/components/Watchlist";
import AuthModal from "@/components/AuthModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { ListVideo, Loader2, User, LogOut } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchWatchlistFromDB(session.user.id);
      } else {
        setWatchlist([]); // Clear if logged out
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchWatchlistFromDB(session.user.id);
        } else {
          setWatchlist([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchWatchlistFromDB = async (userId: string) => {
    const { data, error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data && !error) {
      // Map DB schema to our local Movie interface
      const dbMovies: Movie[] = data.map((d: any) => ({
        id: d.movie_id,
        title: d.title,
        posterUrl: d.poster_url || "",
        rating: 0, // Not saving this explicitly yet
        year: 0,
        genre: [],
        description: "" // Simplified for watchlist view
      }));
      setWatchlist(dbMovies);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      const tmdbMovies = await getPopularMovies(page);
      const mappedMovies = tmdbMovies.map(mapTMDBToMovie);
      setMovies(mappedMovies);
      setLoading(false);
    }
    fetchMovies();
  }, [page]);

  const handleSwipe = async (direction: "left" | "right", movie: Movie) => {
    if (direction === "right") {
      setWatchlist((prev) => [...prev, movie]);

      // Sync to DB if logged in
      if (user) {
        await supabase.from("watchlist").insert({
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title,
          poster_url: movie.posterUrl
        });
      }
    }
    setMovies((prev) => prev.filter((m) => m.id !== movie.id));
  };

  const handleRemoveFromWatchlist = async (id: string) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== id));

    // Remove from DB if logged in
    if (user) {
      await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", id);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent flex items-center justify-center overflow-hidden font-sans selection:bg-pink-500/30">

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Main UI */}
      <main className="z-10 flex flex-col items-center w-full max-w-md h-[100dvh]">

        {/* Header */}
        <header className="w-full flex justify-between items-center p-6 mb-4">
          <div className="flex items-center gap-3 z-10">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-pink-500/20 border border-gray-200 bg-white">
              <Image src="/logo.png" alt="Movie Swiping Logo" fill className="object-cover" sizes="40px" />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 tracking-tight">
              Movie Swiping
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <button
                onClick={handleLogout}
                className="p-3 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-500 rounded-full backdrop-blur-md transition border border-gray-200 dark:border-gray-700 shadow-sm relative group"
                title="Log out"
              >
                <LogOut className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-3 bg-white dark:bg-gray-800 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-700 dark:text-gray-300 hover:text-pink-500 rounded-full backdrop-blur-md transition border border-gray-200 dark:border-gray-700 shadow-sm relative group"
                title="Sign in"
              >
                <User className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={() => setShowWatchlist(true)}
              className="p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full backdrop-blur-md transition border border-gray-200 dark:border-gray-700 shadow-sm relative"
            >
              <ListVideo className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {watchlist.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Deck Area */}
        <div className="flex-1 w-full px-4 pb-8 flex items-center justify-center relative">
          <div className="relative w-full aspect-[2/3] max-h-[70vh]">
            <AnimatePresence>
              {movies.map((movie, index) => {
                const isFront = index === movies.length - 1;
                return (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSwipe={handleSwipe}
                    isFront={isFront}
                  />
                );
              })}
            </AnimatePresence>

            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80 rounded-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm shadow-sm">
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading Movies...</h3>
              </div>
            ) : movies.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80 rounded-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm shadow-sm">
                <span className="text-6xl mb-4">🎬</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're all caught up!</h3>
                <p className="text-sm max-w-[80%] mx-auto">Check back later for more movies to discover.</p>
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold rounded-full hover:opacity-90 transition shadow-lg shadow-pink-500/20"
                >
                  Load More Movies
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* Watchlist Overlay */}
      <AnimatePresence>
        {showWatchlist && (
          <Watchlist
            movies={watchlist}
            onClose={() => setShowWatchlist(false)}
            onRemove={handleRemoveFromWatchlist}
          />
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
