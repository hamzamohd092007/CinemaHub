import React from "react"
import { Bookmark, Film, Star, Tv } from "lucide-react"

const SearchResultCard = ({ user, media }) => {
  const imageUrl = media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image";

  const mediaType = media.first_air_date ? "tv" : "movie"

  const year = (media.release_date || media.first_air_date || "").split("-")[0]

  return (
    <div className="w-full hover:scale-105 cursor-pointer transition-all duration-300">
      <div className="relative w-full aspect-2/3 rounded-lg bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${imageUrl})`, }} >
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 p-1 sm:px-2 flex-wrap">
        <div>{year}</div>
        <span>•</span>
        <div className="flex items-center gap-1">
          {mediaType === "movie" ? (
            <Film className="w-4 h-4 text-gray-400" />
          ) : (
            <Tv className="w-4 h-4 text-gray-400" />
          )}
          <span className="capitalize">
            {mediaType}
          </span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-gray-300" />
          <span>
            {media.vote_average?.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="text-sm sm:text-lg text-white font-semibold px-1 sm:px-2 line-clamp-2">
        {media.title || media.name}
      </div>
    </div>
  )
}

export default SearchResultCard