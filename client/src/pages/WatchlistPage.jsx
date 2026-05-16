import React, { useEffect, useState } from 'react'
import MediaRow from '../components/MediaRow'
import { getMovieDetails, getTVDetails } from '../utils/tmdb'
import toast from 'react-hot-toast'
import SearchBar from '../components/SearchBar'
import SearchGrid from '../components/SearchGrid'
import Loading from '../components/Loading'
import { Link } from 'react-router-dom'
import { Telescope } from 'lucide-react'

const WatchlistPage = ({ user, handleWatchlist }) => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        setLoading(true);
        const movieItems = user.watchlist.filter((watchlist) => watchlist.type === "movie");
        const tvItems = user.watchlist.filter((watchlist) => watchlist.type === "tv");
        const movieResults = await Promise.all(
          movieItems.map((movie) => getMovieDetails(movie.id))
        )
        const tvResults = await Promise.all(
          tvItems.map((tv) => getTVDetails(tv.id))
        )
        setMovies(movieResults);
        setTVShows(tvResults);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    if (user?.watchlist?.length) {
      loadWatchlist();
    }
  }, [user]);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    const query = search.toLowerCase();
    const filteredMovies = movies.filter((movie) => movie.title?.toLowerCase().includes(query));
    const filteredTVShows = tvShows.filter((show) => show.name?.toLowerCase().includes(query));
    setSearchResults([...filteredMovies, ...filteredTVShows]);
    setSearchLoading(false);
  }, [search, movies, tvShows]);

  if (loading) {
    return <Loading />
  }

  return (
    <div className="w-full flex flex-col sm:gap-6 min-h-0">
      {!(movies.length === 0 && tvShows.length === 0) && (
        <SearchBar search={search} setSearch={setSearch} />
      )}
      <div className="flex flex-col h-full min-h-0">
        {search.trim() ? (
          <SearchGrid user={user} search={search} searchLoading={searchLoading} results={searchResults} />
        ) : (
          <div className="flex flex-col gap-8 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            {movies.length > 0 && (
              <MediaRow title="Watchlisted Movies" data={movies} user={user} handleWatchlist={handleWatchlist} />
            )}
            {tvShows.length > 0 && (
              <MediaRow title="Watchlisted TV Shows" data={tvShows} user={user} handleWatchlist={handleWatchlist} />
            )}
            {(movies.length === 0 && tvShows.length === 0) && (
              <div className="flex flex-col items-center gap-2 sm:gap-4 w-full p-12 sm:p-30">
                <span className="text-slate-300">You have not saved any movie or TV show in watchlist</span>
                <Link to="/">
                  <button className="flex items-center gap-2 px-3 py-1 sm:p-6 sm:py-2 bg-red-500 text-white rounded-lg hover:opacity-90 cursor-pointer">
                    <Telescope className="w-5 h-5" />
                    <span>Explore now</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WatchlistPage