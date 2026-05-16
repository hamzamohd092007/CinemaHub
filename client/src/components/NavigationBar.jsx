import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Book, Bookmark, Clapperboard, Film, Grid2X2, LayoutGrid, Menu, Tv } from 'lucide-react'

const NavigationBar = ({ user }) => {
  const location = useLocation();
  const currentPage = location.pathname;
  return (
    <div className="flex flex-row xl:flex-col items-center justify-between bg-slate-900 p-1 sm:px-4 xl:p-4 rounded-lg">
      <div className="flex flex-1 flex-row xl:flex-col items-center xl:w-full">
        <div className="p-2 sm:p-4">
          <Clapperboard className="text-red-400 w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="flex flex-1 justify-center xl:justify-start sm:py-6">
          <div className="flex flex-row xl:flex-col items-center gap-2 sm:gap-4">
            <Link to="/">
              <div className="px-2 xl:p-3 hover:bg-slate-600 rounded-full">
                <LayoutGrid className={`w-5 h-5 sm:w-6 sm:h-6 ${currentPage === "/" ? "text-white fill-white" : "text-slate-400 fill-slate-400"}`} />
              </div>
            </Link>
            <Link to="/movies">
              <div className="px-2 xl:p-3 hover:bg-slate-600 rounded-full">
                <Film className={`w-5 h-5 sm:w-6 sm:h-6 ${currentPage === "/movies" ? "text-white" : "text-slate-400"}`} />
              </div>
            </Link>
            <Link to="/series">
              <div className="px-2 xl:p-3 hover:bg-slate-600 rounded-full">
                <Tv className={`w-5 h-5 sm:w-6 sm:h-6 ${currentPage === "/series" ? "text-white" : "text-slate-400"}`} />
              </div>
            </Link>
            <Link to="/watchlist">
              <div className="px-2 xl:p-3 hover:bg-slate-600 rounded-full">
                <Bookmark className={`w-5 h-5 sm:w-6 sm:h-6 ${currentPage === "/watchlist" ? "text-white fill-white" : "text-slate-400 fill-slate-400"}`} />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Link to="/profile">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-400">
          <img src={user?.avatar} alt="" className="w-full h-full rounded-full" />
        </div>
      </Link>
    </div>
  )
}

export default NavigationBar
