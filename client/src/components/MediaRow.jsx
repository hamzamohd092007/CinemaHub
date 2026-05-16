import React from "react"
import { Link } from "react-router-dom"
import MediaCard from "./MediaCard"

function MediaRow({ title, data, user, handleWatchlist }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl sm:text-3xl text-white font-extralight">
        {title}
      </h2>
      <div className="flex gap-6 overflow-x-auto py-4 xl:pr-28">
        {data?.map((media) => {
          const mediaType = media.first_air_date ? "tv" : "movie";
          return (
            <Link key={media.id} to={mediaType === "movie" ? `/movie/${media.id}` : `/tv/${media.id}`}>
              <MediaCard user={user} media={media} handleWatchlist={handleWatchlist} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MediaRow