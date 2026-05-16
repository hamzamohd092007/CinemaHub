import React, { useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { validateAuth, formatName, getPasswordStrength } from "../utils/validators";
import { Eye, EyeOff, Upload, Clapperboard, Film, Tv, Bookmark } from "lucide-react";
import { TMDB_LANGUAGES } from "../utils/tmdb";

const AuthPage = ({ setUser }) => {
  const [currentState, setCurrentState] = useState("Sign In");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("");
  const [isSelectingLanguage, setIsSelectingLanguage] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strength = getPasswordStrength(password);

  const filteredLanguages = TMDB_LANGUAGES.filter((option) => option.code.toLowerCase().includes(language.toLowerCase()) || option.name.toLowerCase().includes(language.toLowerCase()));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const { isSubmitValid } = validateAuth({ type: currentState === "Sign Up" ? "signup" : "signin", fullName, email, password, confirmPassword });

  const handleSignUp = async () => {
    const { isValid, errors, formatted } = validateAuth({ type: "signup", fullName, email, password, confirmPassword });
    if (!isValid) {
      return toast.error(Object.values(errors)[0]);
    }
    try {
      const formData = new FormData();
      formData.append("fullName", formatted.fullName);
      formData.append("email", formatted.email);
      formData.append("language", language);
      formData.append("password", password);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      const { data } = await API.post("/user/signup", formData);
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setFullName("");
    setEmail("");
    setLanguage("");
    setPassword("");
    setConfirmPassword("");
    setAvatar(null);
    setAvatarFile(null);
  };

  const handleSignIn = async () => {
    const { isValid, errors, formatted } = validateAuth({ type: "signin", email, password });
    if (!isValid) {
      return toast.error(Object.values(errors)[0]);
    }
    try {
      const { data } = await API.post("/user/signin", { email: formatted.email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute top-0 left-0 h-[45%] w-full bg-linear-to-r from-red-900/40 via-slate-900 to-slate-950" />
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-slate-700/20 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 -rotate-12 scale-125">
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="aspect-2/3 rounded-xl bg-slate-700"
            />
          ))}
        </div>
      </div>
      <div className="relative z-10 flex min-h-screen">
        <div className="hidden lg:flex flex-1 flex-col justify-between p-10 border-r border-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
              <Clapperboard className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide text-white">
                CinemaHub
              </h1>
              <p className="text-sm text-slate-400">
                Track movies & TV series
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-semibold leading-tight text-white">
                Your personal
                <br />
                entertainment hub.
              </h2>
              <p className="mt-5 max-w-md text-slate-400 leading-7">
                Discover trending movies, watchlist favorites and build your
                ultimate watchlist experience.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                <Film className="w-4 h-4" />
                Movies
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                <Tv className="w-4 h-4" />
                Series
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                <Bookmark className="w-4 h-4" />
                Watchlist
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Streamlined cinematic tracking experience.
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center p-2">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-slate-900 bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-black/40 p-8">
              <div className="mb-4">
                <h2 className="text-3xl font-semibold text-white">
                  {currentState === "Sign In" ? "Welcome back" : "Create account"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {currentState === "Sign In" ? "Sign in to continue your watch journey." : "Start building your personalized watchlist."}
                </p>
              </div>
              <div className="space-y-5">
                {currentState === "Sign Up" && (
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Mohd Hamza"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={(e) => setFullName(formatName(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-red-500"
                    />
                  </div>
                )}
                {currentState === "Sign Up" && (
                  <div className="flex items-center gap-4">
                    <label className="group relative cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      {avatar ? (
                        <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-700">
                          <img src={avatar} alt="" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-slate-600 bg-slate-950 text-slate-400 transition group-hover:border-red-500 group-hover:text-red-400">
                          <Upload className="w-5 h-5" />
                        </div>
                      )}
                    </label>
                    <div>
                      <p className="text-sm text-white">
                        Upload profile image
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG supported
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-red-500"
                  />
                </div>
                {currentState === "Sign Up" && (
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
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-red-500 placeholder:text-neutral-400"
                    />
                    {isSelectingLanguage && (
                      <div className="absolute left-0 top-full mt-2 z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
                        <div className="max-h-52 overflow-y-auto">
                          {filteredLanguages.map((option) => (
                            <div key={option.code} onMouseDown={() => setLanguage(option.code)} className="cursor-pointer px-4 py-3 text-sm text-slate-200 transition hover:bg-white hover:text-black">
                              <div className="flex items-center justify-between">
                                <span>{option.code.toUpperCase()}</span>
                                <span className="text-xs opacity-70">{option.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={currentState === "Sign Up" ? "Create password" : "Enter password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 pr-12 text-white outline-none transition focus:border-red-500"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {currentState === "Sign Up" && password && (
                    <p className={`mt-2 text-xs ${strength === "Weak" ? "text-red-400" : strength === "Medium" ? "text-yellow-400" : "text-green-400"}`}>
                      Strength: {strength}
                    </p>
                  )}
                </div>
                {currentState === "Sign Up" && (
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 pr-12 text-white outline-none transition focus:border-red-500"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                <button disabled={!isSubmitValid} onClick={currentState === "Sign Up" ? handleSignUp : handleSignIn} className={`w-full rounded-xl py-3 font-semibold text-white transition-all duration-300 ${isSubmitValid ? "bg-red-500 hover:bg-red-600 cursor-pointer" : "cursor-not-allowed bg-slate-700 opacity-50"}`}>
                  {currentState === "Sign Up" ? "Create Account" : "Sign In"}
                </button>
              </div>
              <div className="mt-8 text-center text-sm text-slate-500">
                {currentState === "Sign Up" ? "Already have an account?" : "Don't have an account?"}
                <button onClick={() => setCurrentState(currentState === "Sign Up" ? "Sign In" : "Sign Up")} className="ml-2 font-medium text-red-400 hover:text-red-300 cursor-pointer">
                  {currentState === "Sign Up" ? "Sign In" : "Create one"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;