import React, { useEffect, useState } from 'react'
import API from './utils/axios'
import toast, { Toaster } from 'react-hot-toast'
import { Navigate, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import HomePage from './pages/HomePage'
import MoviesPage from './pages/MoviesPage'
import SeriesPage from './pages/SeriesPage'
import WatchlistPage from './pages/WatchlistPage'
import NavigationBar from './components/NavigationBar'
import Loading from './components/Loading'
import MediaPage from './pages/MediaPage'

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyUser = async () => {
    try {
      const { data } = await API.get("/user/me");
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    verifyUser();
  }, []);

  const handleWatchlist = async (id, type) => {
    try {
      const { data } = await API.put("/user/watchlist", { id, type });
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const handleChangeLanguage = async (language) => {
    try {
      const { data } = await API.put("/user/change-language", { language });
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const handleShowAdult = async () => {
    try {
      const { data } = await API.put(`/user/show-adult`);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem("token")
  }

  const handleDelete = async () => {
    try {
      const { data } = await API.delete("/user/delete");
      setUser(null);
      localStorage.removeItem("token");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/auth" element={!user ? <AuthPage setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} setUser={setUser} handleChangeLanguage={handleChangeLanguage} handleShowAdult={handleShowAdult} handleLogout={handleLogout} handleDelete={handleDelete} /> : <Navigate to="/auth" />} />
        <Route path="/*" element={user ? (
          <div className="flex flex-col xl:flex-row p-4 sm:p-8 gap-6 bg-slate-950 w-screen h-screen overflow-hidden">
            <NavigationBar user={user} />
            <Routes>
              <Route path="/" element={<HomePage user={user} handleWatchlist={handleWatchlist} />} />
              <Route path="/movies" element={<MoviesPage user={user} handleWatchlist={handleWatchlist} />} />
              <Route path="/series" element={<SeriesPage user={user} handleWatchlist={handleWatchlist} />} />
              <Route path="/watchlist" element={<WatchlistPage user={user} handleWatchlist={handleWatchlist} />} />
              <Route path="/movie/:id" element={<MediaPage user={user} mediaType="movie" handleWatchlist={handleWatchlist} />} />
              <Route path="/tv/:id" element={<MediaPage user={user} mediaType="tv" handleWatchlist={handleWatchlist} />} />
            </Routes>
          </div>
        ) : (
          <Navigate to="/auth" />
        )} />
      </Routes>
    </>
  )
}

export default App
