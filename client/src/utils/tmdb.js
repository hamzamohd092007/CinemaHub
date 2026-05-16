const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchFromTMDB = async (endpoint) => {
    const separator = endpoint.includes("?") ? "&" : "?";
    const response = await fetch(`${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`);
    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
    return response.json();
}

export const getTrending = (language, showAdult) => fetchFromTMDB(`/discover/movie?sort_by=popularity.desc&with_original_language=${language}&include_adult=${showAdult}`);

export const getTopMovies = (language, showAdult) => fetchFromTMDB(`/discover/movie?sort_by=vote_average.desc&with_original_language=${language}&vote_count.gte=100&include_adult=${showAdult}`);

export const getTopTV = (language, showAdult) => fetchFromTMDB(`/discover/tv?sort_by=vote_average.desc&with_original_language=${language}&vote_count.gte=100&include_adult=${showAdult}`);

export const getPopularMovies = (language, showAdult) => fetchFromTMDB(`/discover/movie?sort_by=popularity.desc&with_original_language=${language}&include_adult=${showAdult}`);

export const getNowPlayingMovies = (language, showAdult) => fetchFromTMDB(`/discover/movie?sort_by=release_date.desc&with_original_language=${language}&include_adult=${showAdult}`);

export const getUpcomingMovies = (language, showAdult) => fetchFromTMDB(`/discover/movie?sort_by=primary_release_date.desc&with_original_language=${language}&include_adult=${showAdult}`);

export const getMovieGenres = () => fetchFromTMDB(`/genre/movie/list`);

export const getMoviesByGenre = (genreId, language, showAdult) => fetchFromTMDB(`/discover/movie?with_genres=${genreId}&with_original_language=${language}&include_adult=${showAdult}`);

export const getPopularSeries = (language, showAdult) => fetchFromTMDB(`/discover/tv?sort_by=popularity.desc&with_original_language=${language}&include_adult=${showAdult}`);

export const getOnTheAirSeries = (language, showAdult) => fetchFromTMDB(`/discover/tv?with_original_language=${language}&include_adult=${showAdult}`);

export const getAiringTodaySeries = (language, showAdult) => fetchFromTMDB(`/discover/tv?with_original_language=${language}&include_adult=${showAdult}`);

export const getSeriesGenres = () => fetchFromTMDB(`/genre/tv/list`);

export const getSeriesByGenre = (genreId, language, showAdult) => fetchFromTMDB(`/discover/tv?with_genres=${genreId}&with_original_language=${language}&include_adult=${showAdult}`);

export const searchMulti = (query, language, showAdult) => fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}&include_adult=${showAdult}`);

export const getMovieVideos = (id) => fetchFromTMDB(`/movie/${id}/videos`);

export const getTVVideos = (id) => fetchFromTMDB(`/tv/${id}/videos`);

export const getMovieDetails = (id) => fetchFromTMDB(`/movie/${id}`);

export const getTVDetails = (id) => fetchFromTMDB(`/tv/${id}`);

export const getMovieCredits = (id) => fetchFromTMDB(`/movie/${id}/credits`);

export const getTVCredits = (id) => fetchFromTMDB(`/tv/${id}/credits`);

export const TMDB_LANGUAGES = [
    { code: "ar", name: "Arabic" },
    { code: "de", name: "German" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "hi", name: "Hindi" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "nl", name: "Dutch" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "sv", name: "Swedish" },
    { code: "tr", name: "Turkish" },
    { code: "zh", name: "Chinese" },
];