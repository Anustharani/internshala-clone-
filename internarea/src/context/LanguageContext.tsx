import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import { toast } from "react-toastify";
import axios from "axios";
import { X, Mail, Shield, CheckCircle } from "lucide-react";
import { Language, translations } from "@/utils/translations";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const getApiUrl = (path: string) => {
  const base =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : (process.env.NEXT_PUBLIC_API_URL || "https://internshala-clone-y2p2.onrender.com/api");
  return `${base}${path}`;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useSelector(selectuser);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("site_language") as Language;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    }
  }, []);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const setLanguage = (lang: Language) => {
    if (lang === language) {
      return;
    }
    // Trigger validation flow for all language changes
    setPendingLanguage(lang);
    setIsModalOpen(true);
    // Pre-fill email from current user state again to ensure freshness
    if (currentUser?.email) {
      setEmail(currentUser.email);
    } else {
      setEmail("");
    }
    setOtp("");
    setIsOtpSent(false);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key] || translations["en"]?.[key] || key;
    return translation;
  };

  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(getApiUrl("/otp/send"), { email });
      if (response.data.success) {
        setIsOtpSent(true);
        toast.success("Verification OTP sent successfully!");
        if (response.data.otp) {
          // Dev fallback logging/notification helper
          console.log(`[DEV MODE] OTP generated is: ${response.data.otp}`);
          toast.info(`Dev Mode: OTP is ${response.data.otp} (also logged to console)`);
        }
      } else {
        toast.error(response.data.error || "Failed to send OTP.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Error connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || isNaN(Number(otp))) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(getApiUrl("/otp/verify"), { email, otp });
      if (response.data.success) {
        if (pendingLanguage) {
          setLanguageState(pendingLanguage);
          localStorage.setItem("site_language", pendingLanguage);
          toast.success(`Email verified! Language switched to ${pendingLanguage.toUpperCase()}.`);
        }
        handleCloseModal();
      } else {
        toast.error(response.data.error || "Verification failed.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Incorrect OTP or verification expired.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPendingLanguage(null);
    setOtp("");
    setIsOtpSent(false);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}

      {/* Global OTP Verification Modal for French */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white text-gray-900 rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden transform scale-100 transition-transform duration-300 border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <h3 className="text-xl font-bold">{t("otp_modal_title")}</h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                {t("otp_modal_desc")}
              </p>

              {/* Email Form */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("otp_enter_email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    disabled={isOtpSent || !!currentUser?.email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-400 font-medium text-black"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* OTP Field if sent */}
              {isOtpSent && (
                <div className="space-y-2 animate-fade-in">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t("otp_enter_code")}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center text-2xl tracking-widest font-bold py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="------"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                {!isOtpSent ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span>{t("otp_send_btn")}</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>{t("otp_verify_btn")}</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl transition-all border border-gray-100"
                >
                  {t("otp_cancel_btn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
