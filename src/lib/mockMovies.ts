export interface Movie {
    id: string;
    title: string;
    posterUrl: string;
    rating: number;
    year: number;
    genre: string[];
    description: string;
}

export const mockMovies: Movie[] = [
    {
        id: "1",
        title: "Inception",
        posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop", // Movie poster placeholder
        rating: 8.8,
        year: 2010,
        genre: ["Action", "Sci-Fi", "Thriller"],
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster."
    },
    {
        id: "2",
        title: "Interstellar",
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop", // Space poster placeholder
        rating: 8.6,
        year: 2014,
        genre: ["Adventure", "Drama", "Sci-Fi"],
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
    },
    {
        id: "3",
        title: "The Dark Knight",
        posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop", // City poster placeholder
        rating: 9.0,
        year: 2008,
        genre: ["Action", "Crime", "Drama"],
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
    },
    {
        id: "4",
        title: "Pulp Fiction",
        posterUrl: "https://images.unsplash.com/photo-1596727147705-611529e7c5b1?q=80&w=2070&auto=format&fit=crop", // Retro poster placeholder
        rating: 8.9,
        year: 1994,
        genre: ["Crime", "Drama"],
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
    },
    {
        id: "5",
        title: "The Matrix",
        posterUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop", // Hacker poster placeholder
        rating: 8.7,
        year: 1999,
        genre: ["Action", "Sci-Fi"],
        description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence."
    }
];
