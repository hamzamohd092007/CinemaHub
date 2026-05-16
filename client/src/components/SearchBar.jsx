import React from 'react'
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react'

const SearchBar = ({ search, setSearch }) => {
  const location = useLocation();
  const currentPage = location.pathname;

  const getPlaceholder = () => {
    switch (currentPage) {
      case "/":
        return "Search for movies or TV series";
      case "/movies":
        return "Search for movies";
      case "/series":
        return "Search for series";
      case "/watchlist":
        return "Search for watch listed shows";
      default:
        break;
    }
  }

  return (
    <div className="flex items-center p-4 sm:p-0">
      <div>
        <Search className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
      </div>
      <input type="text" placeholder={getPlaceholder()} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-3 sm:px-6 sm:py-2 text-md sm:text-xl text-white placeholder:text-gray-400 outline-none" />
    </div>
  )
}

export default SearchBar
