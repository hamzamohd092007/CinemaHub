import React from "react"
import { Bookmark, Film, Star, Tv } from "lucide-react"

const MediaCard = ({ user, media, handleWatchlist }) => {
  const imageUrl = media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image";

  const mediaType = media.first_air_date ? "tv" : "movie";

  const watchlist = user?.watchlist || [];
  const isWatchlisted = watchlist.some((item) => item.id === media.id);

  return (
    <div className="group w-35 sm:w-45 md:w-55 shrink-0 hover:scale-105 cursor-pointer transition-all duration-300">
      <div className="relative flex flex-col justify-between w-full aspect-2/3 rounded-lg bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${imageUrl})`, }}>
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
        <div className="relative flex justify-end p-2 sm:p-4 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleWatchlist(String(media.id), mediaType);
            }}
            className="p-2 sm:p-3 bg-slate-700/80 hover:bg-slate-900 rounded-full transition cursor-pointer"
          >
            <Bookmark className={`w-3 h-3 sm:w-5 sm:h-5 text-white ${isWatchlisted ? "fill-white" : ""}`} />
          </button>
        </div>
        <div className="relative z-10 p-2 sm:p-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 flex-wrap">
            <div>
              {(media.release_date || media.first_air_date || "").split("-")[0]}
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              {mediaType === "movie" ? (
                <Film className="w-4 h-4" />
              ) : (
                <Tv className="w-4 h-4" />
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
          <h3 className="text-sm sm:text-lg text-white font-semibold mt-2 line-clamp-1 group-hover:line-clamp-none">
            {media.title || media.name}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default MediaCard
