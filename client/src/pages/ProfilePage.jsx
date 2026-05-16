import React, { useState } from "react";
import API from "../utils/axios.js";
import { formatName, normalizeEmail, getPasswordStrength, validateProfileUpdate } from "../utils/validators.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Pencil, LogOut, Trash2, Camera, Film, Clock3, Bookmark, TriangleAlert } from "lucide-react";
import { TMDB_LANGUAGES } from "../utils/tmdb.js";

const ProfilePage = ({ user, setUser, verifyUser, handleChangeLanguage, handleShowAdult, handleLogout, handleDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOldPasswordVerified, setIsOldPasswordVerified] = useState(false);

  const [language, setLanguage] = useState(user?.language);
  const [isSelectingLanguage, setIsSelectingLanguage] = useState(false);

  const filteredLanguages = TMDB_LANGUAGES.filter((option) => option.code.toLowerCase().includes(language.toLowerCase()) || option.name.toLowerCase().includes(language.toLowerCase()));

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [togglingAdult, setTogglingAdult] = useState(false);

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const { isValid, formatted, isEmailInvalid } = validateProfileUpdate({ fullName, email, avatar, oldPassword, newPassword, confirmPassword, user });

  const resetState = () => {
    setFullName("");
    setEmail("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setAvatar(user?.avatar);
    setAvatarFile(null);
    setIsOldPasswordVerified(false);
    setIsUpdating(false);
  };

  const handleUpdate = async () => {
    try {
      if (!isValid) {
        return toast.error("Fix validation errors first");
      }
      const formData = new FormData();
      if (
        formatted.fullName &&
        formatted.fullName !== user?.fullName
      ) {
        formData.append("fullName", formatted.fullName);
      }
      if (
        formatted.email &&
        formatted.email !== user?.email
      ) {
        formData.append("email", formatted.email);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if ([...formData.keys()].length > 0) {
        await API.post("/user/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      if (newPassword) {
        if (!isOldPasswordVerified) {
          return toast.error("Verify old password first");
        }
        await API.post("/user/change-password", {
          newPassword: newPassword.trim(),
        });
      }
      toast.success("Profile updated");
      resetState();
      verifyUser();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  const verifyOldPassword = async () => {
    if (!oldPassword || isOldPasswordVerified) return;
    try {
      const { data } = await API.post(
        "/user/verify-old-password",
        { oldPassword }
      );
      setIsOldPasswordVerified(data.success);
    } catch {
      setIsOldPasswordVerified(false);
    }
  };

  const handleToggleAdult = () => {
    if (user?.showAdult) {
      handleShowAdult();
    } else {
      setTogglingAdult(true);
    }
  }

  console.log(user)
  if (togglingAdult) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-zinc-900/90 p-8 backdrop-blur-xl">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mx-auto mb-5">
            <TriangleAlert className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            Show 18+ content
          </h2>
          <p className="text-zinc-400 text-center mt-3">
            You must be adult to perform this action.
          </p>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setTogglingAdult(false)} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition cursor-pointer">
              Cancel
            </button>
            <button
              onClick={() => {
                handleShowAdult();
                setTogglingAdult(false);
              }}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition cursor-pointer"
            >
              Show
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isDeletingAccount) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-zinc-900/90 p-8 backdrop-blur-xl">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mx-auto mb-5">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            Delete Account
          </h2>
          <p className="text-zinc-400 text-center mt-3">
            This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setIsDeletingAccount(false)} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition cursor-pointer">
              Cancel
            </button>
            <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition cursor-pointer">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-linear(circle_at_top,rgba(15,23,42,0.95),rgba(2,6,23,0.98),transparent_70%)]"></div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <Link to="/">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </div>
        </Link>
        {!isUpdating ? (
          <div className="mt-8 grid lg:grid-cols-[340px_1fr] gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img src={user?.avatar} alt="avatar" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600 shadow-2xl shadow-indigo-600/30" />
                  <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Film className="w-4 h-4" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mt-5">
                  {user?.fullName}
                </h1>
                <p className="text-zinc-400 mt-1">
                  {user?.email}
                </p>
                <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-300 text-sm">
                  <Clock3 className="w-4 h-4" />
                  Joined {formatDate(user?.createdAt)}
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-zinc-900/70 border border-white/5 p-4">
                  <div className="flex items-center gap-2 text-indigo-400 mb-2">
                    <Bookmark className="w-4 h-4" />
                    <span className="text-sm">
                      Watchlist
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {user?.watchlist.length}
                  </h2>
                </div>
                <div className="rounded-2xl bg-zinc-900/70 border border-white/5 p-4">
                  <div className="flex items-center gap-2 text-pink-400 mb-2">
                    <Film className="w-4 h-4" />
                    <span className="text-sm">
                      Streaming
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    Pro
                  </h2>
                </div>
              </div>
              <div className="space-y-3 mt-8">
                <button onClick={() => setIsUpdating(true)} className="w-full py-3 rounded-2xl bg-indigo-600 hover:opacity-90 transition font-semibold flex items-center justify-center gap-2 cursor-pointer">
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition font-semibold flex items-center justify-center gap-2 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
                <button onClick={() => setIsDeletingAccount(true)} className="w-full py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition font-semibold cursor-pointer">
                  Delete Account
                </button>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    User Options
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Customize your viewing experience
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="relative w-full">
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Language Preference
                  </label>
                  <input
                    type="text"
                    placeholder={isSelectingLanguage ? "Search language" : "Select language"}
                    value={language}
                    onFocus={() => setIsSelectingLanguage(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setIsSelectingLanguage(false);
                      }, 200);
                    }}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-brand transition placeholder:text-slate-500"
                  />
                  {isSelectingLanguage && (
                    <div className="absolute left-0 top-full mt-2 z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
                      <div className="max-h-52 overflow-y-auto">
                        {filteredLanguages.length > 0 ? (
                          filteredLanguages.map((option) => (
                            <div
                              key={option.code}
                              onMouseDown={() => {
                                setLanguage(option.code);
                                handleChangeLanguage(option.code);
                              }}
                              className="group cursor-pointer px-4 py-3 transition"
                            >
                              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/3 px-4 py-3 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all">
                                <div className="flex flex-col">
                                  <span className="text-sm font-semibold text-white">
                                    {option.name}
                                  </span>
                                  <span className="text-xs text-slate-400 uppercase">
                                    {option.code}
                                  </span>
                                </div>
                                {language === option.code && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-slate-500">
                            No language found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-5 py-4 hover:bg-white/10 transition-all duration-300">
                  <div className="max-w-[75%]">
                    <h3 className="text-lg font-medium text-white">
                      18+ Content
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {user?.showAdult ? "Adult movies and TV shows are visible" : "Adult movies and TV shows are hidden"}
                    </p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user?.showAdult}
                      onChange={handleToggleAdult}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-slate-700 rounded-full transition peer-checked:bg-brand after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-5">
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h1 className="text-4xl font-bold text-center">
              Edit Profile
            </h1>
            <p className="text-zinc-400 text-center mt-2">
              Update your streaming identity
            </p>
            <div className="mt-10 space-y-6">
              <div className="flex justify-center">
                <label className="relative group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <img src={avatar} alt="avatar" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600" />
                  <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Camera className="w-7 h-7" />
                  </div>
                </label>
              </div>
              <div>
                <label className="text-sm text-zinc-400 block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder={user?.fullName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => setFullName(formatName(fullName))}
                  className="w-full bg-black/40 border border-white/10 focus:border-indigo-600 rounded-2xl px-5 py-4 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder={user?.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmail(normalizeEmail(email))}
                  className="w-full bg-black/40 border border-white/10 focus:border-indigo-600 rounded-2xl px-5 py-4 outline-none"
                />
                {isEmailInvalid && (
                  <p className="text-red-400 text-sm mt-2">
                    Invalid email
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    placeholder="Current password"
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      setIsOldPasswordVerified(false);
                    }}
                    onBlur={verifyOldPassword}
                    className="w-full bg-black/40 border border-white/10 focus:border-indigo-600 rounded-2xl px-5 py-4 outline-none"
                  />
                  <span onClick={() => setShowOld(!showOld)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 cursor-pointer">
                    {showOld ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </span>
                </div>
                {oldPassword &&
                  !isOldPasswordVerified && (
                    <p className="text-red-400 text-sm">
                      Incorrect password
                    </p>
                  )}
                {isOldPasswordVerified && (
                  <>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"} placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-indigo-600 rounded-2xl px-5 py-4 outline-none"
                      />
                      <span onClick={() => setShowNew(!showNew)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 cursor-pointer">
                        {showNew ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </span>
                    </div>
                    {newPassword && (
                      <p className={`text-sm ${getPasswordStrength(newPassword) === "Weak" ? "text-red-400" : getPasswordStrength(newPassword) === "Medium" ? "text-yellow-400" : "text-green-400"}`}>
                        Strength:{" "} {getPasswordStrength(newPassword)}
                      </p>
                    )}
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"} placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-indigo-600 rounded-2xl px-5 py-4 outline-none"
                      />
                      <span onClick={() => setShowConfirm(!showConfirm)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 cursor-pointer">
                        {showConfirm ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={resetState} className="flex-1 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-semibold cursor-pointer">
                  Cancel
                </button>
                <button disabled={!isValid} onClick={handleUpdate} className={`flex-1 py-4 rounded-2xl font-semibold transition ${isValid ? "bg-linear-to-r from-indigo-600 via-indigo-600 to-purple-500 hover:opacity-90" : "bg-zinc-700 opacity-50 cursor-not-allowed"}`}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;