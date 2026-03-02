const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

import { Movie } from './mockMovies';

export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    genre_ids: number[];
}

export interface TMDBVideo {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
}


export interface TMDBResponse {
    page: number;
    results: TMDBMovie[];
    total_pages: number;
    total_results: number;
}

// Map of TMDB genre IDs to string names
const TMDB_GENRES: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
};

/**
 * Helper function to get the full URL for a TMDB image
 * TMDB API returns relative paths for images, so we need to construct the full URL.
 */
export function getImageUrl(path: string | null, size: string = 'w500') {
    if (!path) return 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2056&auto=format&fit=crop'; // Cinematic fallback
    return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Adapter function to convert a TMDB API movie to our app's internal Movie format
 */
export function mapTMDBToMovie(tmdbMovie: TMDBMovie): Movie {
    return {
        id: tmdbMovie.id.toString(),
        title: tmdbMovie.title,
        posterUrl: getImageUrl(tmdbMovie.poster_path),
        rating: Math.round(tmdbMovie.vote_average * 10) / 10, // Round to 1 decimal place
        year: tmdbMovie.release_date ? parseInt(tmdbMovie.release_date.substring(0, 4)) : new Date().getFullYear(),
        genre: tmdbMovie.genre_ids ? tmdbMovie.genre_ids.map(id => TMDB_GENRES[id] || "Unknown").slice(0, 3) : ["Unknown"], // Take up to 3 genres
        description: tmdbMovie.overview || "No description available.",
    };
}

/**
 * Fetches popular movies from TMDB to feed into the Matchmaker app
 * 
 * @param page - Which page of results to fetch (20 per page)
 * @returns Array of TMDBMovie objects
 */
export async function getPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    if (!apiKey) {
        console.warn("TMDB API key is missing. Ensure NEXT_PUBLIC_TMDB_API_KEY is defined.");
        return [];
    }

    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/popular?language=en-US&page=${page}&api_key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`TMDB API Error: ${response.statusText}`);
        }

        const data: TMDBResponse = await response.json();
        return data.results;
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        return [];
    }
}

/**
 * Fetches the official YouTube trailer URL for a given movie ID.
 * Falls back to any YouTube trailer if an official one isn't found.
 */
export async function getMovieTrailer(movieId: string): Promise<string | null> {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    if (!apiKey) return null;

    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${apiKey}`
        );

        if (!response.ok) return null;

        const data = await response.json();
        const videos: TMDBVideo[] = data.results;

        if (!videos || videos.length === 0) return null;

        // Try to find the official trailer
        let trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.official);

        // If no official trailer, just grab the first YouTube trailer
        if (!trailer) {
            trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        }

        return trailer ? trailer.key : null;
    } catch (error) {
        console.error("Failed to fetch trailer:", error);
        return null;
    }
}
