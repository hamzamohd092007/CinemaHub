import React, { useEffect, useState } from 'react'
import { getPopularSeries, getOnTheAirSeries, getAiringTodaySeries, getSeriesGenres, getSeriesByGenre, searchMulti } from '../utils/tmdb';
import SearchBar from '../components/SearchBar';
import SearchGrid from '../components/SearchGrid';
import MediaRow from '../components/MediaRow';
import Loading from '../components/Loading';

const SeriesPage = ({ user, handleWatchlist }) => {
  const [popularSeries, setPopularSeries] = useState([]);
  const [onTheAirSeries, setOnTheAirSeries] = useState([]);
  const [airingTodaySeries, setAiringTodaySeries] = useState([]);
  const [genreRows, setGenreRows] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function loadSeries() {
      try {
        setLoading(true);
        const [popularRes, onTheAirRes, airingTodayRes, genresRes] = await Promise.all([
          getPopularSeries(user.language, user.showAdult),
          getOnTheAirSeries(user.language, user.showAdult),
          getAiringTodaySeries(user.language, user.showAdult),
          getSeriesGenres(user.language, user.showAdult),
        ]);
        setPopularSeries(popularRes.results);
        setOnTheAirSeries(onTheAirRes.results);
        setAiringTodaySeries(airingTodayRes.results);
        const selectedGenres = genresRes.genres.slice(0, 5);
        const genreData = await Promise.all(
          selectedGenres.map(async (genre) => {
            const res = await getSeriesByGenre(genre.id, user.language);
            return {
              id: genre.id,
              name: genre.name,
              Series: res.results.filter(result => result.original_language === user.language) || [],
            }
          })
        );
        setGenreRows(genreData);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadSeries();
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
        const filtertedResults = res.results.filter((result) => result.first_air_date && result.poster_path);
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
    }, 1000)
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
            <MediaRow user={user} title="Popular Series" data={popularSeries} handleWatchlist={handleWatchlist} />
            <MediaRow user={user} title="On The Air" data={onTheAirSeries} handleWatchlist={handleWatchlist} />
            <MediaRow user={user} title="Airing Today" data={airingTodaySeries} handleWatchlist={handleWatchlist} />
            {genreRows.map((genre) => (
              <MediaRow key={genre.id} title={genre.name} data={genre.Series?.slice(0, 10) || []} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SeriesPage
