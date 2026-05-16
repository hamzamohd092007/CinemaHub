import React, { useEffect, useState } from 'react'
import { getTopMovies, getTopTV, getTrending, searchMulti } from '../utils/tmdb';
import SearchBar from '../components/SearchBar';
import SearchGrid from '../components/SearchGrid';
import MediaRow from '../components/MediaRow';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const HomePage = ({ user, handleWatchlist }) => {

  const [trending, setTrending] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topTV, setTopTV] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [trendRes, movieRes, tvRes] =
          await Promise.all([
            getTrending(user.language, user.showAdult),
            getTopMovies(user.language, user.showAdult),
            getTopTV(user.language, user.showAdult),
          ]);
        setTrending(trendRes.results);
        setTopMovies(movieRes.results);
        setTopTV(tvRes.results);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }
      try {
        const res = await searchMulti(search);
        const filtertedResults = res.results.filter(
          (result) => result.media_type !== "person" && result.poster_path
        );
        setSearchResults(filtertedResults || []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setSearchLoading(false);
      }
    }
    setSearchLoading(true);
    const timeout = setTimeout(() => {
      fetchSearch();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  if (loading) {
    return <Loading />
  }

  return (
    <div className="w-full flex flex-col sm:gap-6 min-h-0">
      <SearchBar search={search} setSearch={setSearch} />
      <div className="flex flex-col h-full min-h-0">
        {search.trim() ? (
          <SearchGrid user={user} search={search} searchLoading={searchLoading} results={searchResults} handleWatchlist={handleWatchlist} />
        ) : (
          <div className="flex flex-col gap-8 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            <MediaRow user={user} title="Trending" data={trending} handleWatchlist={handleWatchlist} />
            <MediaRow user={user} title="Top Rated Movies" data={topMovies} handleWatchlist={handleWatchlist} />
            <MediaRow user={user} title="Top Rated TV" data={topTV} handleWatchlist={handleWatchlist} />
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
