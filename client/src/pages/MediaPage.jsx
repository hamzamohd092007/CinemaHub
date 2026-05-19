import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Calendar, Clock, Film, Star, Tv } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { getMovieDetails, getTVDetails, getMovieCredits, getTVCredits, getMovieVideos, getTVVideos } from "../utils/tmdb";

const MediaPage = ({ user, mediaType, handleWatchlist }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [media, setMedia] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true);
        let details;
        let credits;
        let videos;
        if (mediaType === "movie") {
          details = await getMovieDetails(id);
          credits = await getMovieCredits(id);
          videos = await getMovieVideos(id);
        } else {
          details = await getTVDetails(id);
          credits = await getTVCredits(id);
          videos = await getTVVideos(id);
        }
        setMedia(details);
        setCast(credits.cast.slice(0, 10));
        const trailerData = videos.results.find(
          (video) =>
            video.site === "YouTube" &&
            video.type === "Trailer"
        );

        setTrailer(trailerData);

      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadMedia();
  }, [id, mediaType]);

  const backdropUrl = media?.backdrop_path ? `https://image.tmdb.org/t/p/original${media.backdrop_path}` : "";

  const posterUrl = media?.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image";

  const watchlist = user?.watchlist || [];
  const isWatchlisted = watchlist.some((item) => item.id === media?.id);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen text-white overflow-y-auto pb-20 sm:pb-24 xl:pb-0">
      <div className="relative min-h-fit lg:min-h-[70vh] bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/85 to-black/40" />
        <div className="relative z-10 px-4 sm:px-8 lg:px-14 py-20 flex flex-col lg:flex-row gap-8 items-start">
          <button onClick={() => navigate(-1)} className="absolute top-6 left-4 sm:left-8 lg:left-14 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md cursor-pointer transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-full max-w-72 shrink-0 mx-auto lg:mx-0">
            <img src={posterUrl} alt={media.title || media.name} className="w-full rounded-2xl shadow-2xl" />
          </div>
          <div className="flex flex-col gap-6 max-w-4xl pt-4 lg:pt-8">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                {mediaType === "movie" ? (
                  <>
                    <Film className="w-4 h-4" />
                    <span>Movie</span>
                  </>
                ) : (
                  <>
                    <Tv className="w-4 h-4" />
                    <span>TV Series</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-5 h-5 fill-yellow-400" />
                <span className="font-semibold">
                  {media.vote_average?.toFixed(1)}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold">
                {media.title || media.name}
              </h1>
              {media.tagline && (
                <p className="mt-3 text-gray-300 italic text-lg">
                  "{media.tagline}"
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-5 text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {(media.release_date || media.first_air_date || "").split("-")[0]}
                </span>
              </div>
              {media.runtime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{media.runtime} min</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {media.genres?.map((genre) => (
                <span key={genre.id} className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold mb-3">
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {media.overview}
              </p>
            </div>
            <button onClick={() => handleWatchlist(media.id, mediaType)} className={`w-fit flex items-center gap-2 px-6 py-3 rounded-xl font-medium cursor-pointer transition-all duration-300 ${isWatchlisted ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"}`}>
              <Bookmark className={`w-5 h-5 ${isWatchlisted ? "fill-black" : ""}`} />
              {isWatchlisted ? "Added to Watchlist" : "Add to Watchlist"}
            </button>
          </div>
        </div>
      </div>
      {trailer && (
        <div className="p-4 sm:py-10">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Trailer
          </h2>
          <div className="w-full sm:w-1/2 aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
      <div className="p-4 sm:py-10">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
          Top Cast
        </h2>
        <div className="flex gap-5 overflow-x-auto pb-4">
          {cast.map((actor) => {
            const profileUrl = actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : "https://via.placeholder.com/300x450?text=No+Image";
            return (
              <div key={actor.id} className="min-w-35 bg-slate-900 rounded-2xl overflow-hidden border border-white/5">
                <img src={profileUrl} alt={actor.name} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <h3 className="font-semibold line-clamp-1">
                    {actor.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {actor.character}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
