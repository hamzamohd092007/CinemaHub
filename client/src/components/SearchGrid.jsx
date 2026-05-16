import React from 'react'
import SearchResultCard from './SearchResultCard';
import { Link } from 'react-router-dom';

const SearchGrid = ({ user, search, results, searchLoading, handleWatchlist }) => {
  const getSearchHeading = () => {
    if (searchLoading) {
      return `Searching for '${search}'...`;
    }
    switch (results.length) {
      case 0:
        return `No result found '${search}'`;
      case 1:
        return `Found one result for '${search}'`;
      default:
        return `Found ${results.length} results for '${search}'`;
    }
  }

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      <h2 className="text-xl sm:text-3xl text-white font-extralight">
        {getSearchHeading()}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-8 overflow-y-auto flex-1">
        {results.map((media) => {
          const mediaType = media.first_air_date ? "tv" : "movie";
          return (
            <Link key={media.id} to={mediaType === "movie" ? `/movie/${media.id}` : `/tv/${media.id}`}>
              <SearchResultCard user={user} media={media} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default SearchGrid
