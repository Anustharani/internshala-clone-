import React, { use, useEffect, useRef, useState } from "react";
import logo from "../Assets/logo.png";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/utils/translations";

interface User {
  name: string;
  email: string;
  photo: string;
}
const Navbar = () => {
  const user = useSelector(selectuser);
  const { language, setLanguage, t } = useLanguage();
  
  const handlelogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("logged in successfully");
    } catch (error) {
      console.error(error);
      toast.error("login failed");
    }
  };
  const handlelogout = () => {
    signOut(auth);
  };
  return (
    <div className="relative text-black">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="text-xl font-bold text-blue-600">
                <img src={"/logo.png"} alt="" className="h-16" />
              </a>
            </div>
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer">
                <Link href={"/internship"}>
                  <span className="font-medium">{t("internships")}</span>
                </Link>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer">
                <Link href={"/job"}>
                  <span className="font-medium">{t("jobs")}</span>
                </Link>
              </button>
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-100">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder={t("search_placeholder")}
                  className="ml-2 bg-transparent focus:outline-none text-sm w-48 text-black placeholder-gray-400"
                />
              </div>
            </div>

            {/* Auth Buttons & Language Selector */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative flex items-center">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 pl-3 pr-8 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer transition-all"
                >
                  <option value="en">🇺🇸 EN</option>
                  <option value="es">🇪🇸 ES</option>
                  <option value="hi">🇮🇳 HI</option>
                  <option value="pt">🇵🇹 PT</option>
                  <option value="zh">🇨🇳 ZH</option>
                  <option value="fr">🇫🇷 FR</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {user ? (
                <div className="relative flex items-center space-x-2">
                  <button className="flex items-center">
                    {" "}
                    <Link href={"/profile"}>
                      <img
                        src={user.photo}
                        alt=""
                        className="w-8 h-8 rounded-full border border-gray-200"
                      />
                    </Link>
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-all border border-gray-200 font-semibold"
                    onClick={handlelogout}
                  >
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={handlelogin}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center space-x-2 hover:bg-gray-50 cursor-pointer transition-all font-semibold"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700 text-sm">{t("login_with_google")}</span>
                  </button>
                  <a
                    href="/adminlogin"
                    className="text-gray-600 hover:text-gray-800 text-sm font-semibold hover:underline"
                  >
                    {t("admin")}
                  </a>
                </>
              )}
            </div>
          </div>{" "}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
