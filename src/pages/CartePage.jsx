// pages/CartePage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, CreditCard, Lock, Eye, EyeOff, Shield, Wifi } from "lucide-react";

export default function CartePage({ navigate }) {
  const { currentUser } = useAuth();
  const [showCvv, setShowCvv] = useState(false);

  if (!currentUser) { navigate("login"); return null; }

  return (
    <div translate="no" className="min-h-screen pb-24 flex flex-col" style={{ backgroundColor: "#f0f4f8" }}>

      <header className="bg-white px-4 py-3 sticky top-0 z-50" style={{ boxShadow: "0 1px 0 #e5e7eb" }}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate("dashboard")}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <img src="images/L1.jpeg" alt="BBVA" className="h-7 w-auto object-contain" />
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 py-6 space-y-5">
        <h1 className="text-xl font-bold text-gray-900">{"Ma carte bancaire"}</h1>

        {/* Carte visuelle premium */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(135deg, #004481 0%, #001f3f 100%)", aspectRatio: "1.586" }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
          <div className="absolute top-1/2 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-8"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />

          <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <span className="text-xl font-bold tracking-wider">{"BBVA"}</span>
              <Wifi size={22} className="text-white opacity-60 rotate-90" />
            </div>

            {/* Puce EMV */}
            <div className="w-10 h-7 rounded-md" style={{ background: "linear-gradient(135deg, #f6d365, #fda085)" }} />

            <div>
              <p className="font-mono tracking-[0.25em] text-base mb-4 text-white/90">
                {"•••• •••• •••• " + (currentUser.carte || "4298")}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/40 text-xs mb-0.5 uppercase tracking-widest">{"Titulaire"}</p>
                  <p className="font-semibold text-sm uppercase tracking-wide">{currentUser.nom}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5 uppercase tracking-widest">{"Expire"}</p>
                  <p className="font-semibold">{currentUser.exp || "12/27"}</p>
                </div>
                <p className="text-2xl font-black italic text-white/80">{"VISA"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Détails */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="font-bold text-gray-800">{"Détails de la carte"}</h2>
          </div>
          {[
            {
              icon: CreditCard, label: "Numéro",
              value: "•••• •••• •••• " + (currentUser.carte || "4298"),
              mono: true
            },
            {
              icon: Shield, label: "CVV",
              custom: (
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-gray-800">{showCvv ? "742" : "•••"}</span>
                  <button onClick={() => setShowCvv(!showCvv)} className="text-gray-400 hover:text-gray-600">
                    {showCvv ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              )
            },
            { icon: Lock, label: "Expiration", value: currentUser.exp || "12/27" },
          ].map(({ icon: Icon, label, value, mono, custom }, i, arr) => (
            <div key={label} className={`flex items-center justify-between px-5 py-4 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#e8f0f8" }}>
                  <Icon size={15} style={{ color: "#004481" }} />
                </div>
                <span className="text-sm text-gray-500">{label}</span>
              </div>
              {custom || (
                <span className={`text-sm font-semibold text-gray-800 ${mono ? "font-mono" : ""}`}>{value}</span>
              )}
            </div>
          ))}

          {/* Statut */}
          <div className="mx-5 mb-5 mt-2 rounded-xl p-3 flex items-center gap-3"
            style={{ backgroundColor: "#fff8f0", border: "1px solid #fed7aa" }}>
            <Lock size={16} style={{ color: "#ea580c" }} />
            <div>
              <p className="text-xs font-bold text-orange-800">{"Carte temporairement bloquée"}</p>
              <p className="text-xs text-orange-600 mt-0.5">{"Contactez votre conseiller BBVA pour la débloquer."}</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav navigate={navigate} active="carte" />
    </div>
  );
}

function BottomNav({ navigate, active }) {
  const items = [
    { id: "dashboard", label: "Accueil", icon: "🏠" },
    { id: "carte", label: "Carte", icon: "💳" },
    { id: "profil", label: "Profil", icon: "👤" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "notifications", label: "Alertes", icon: "🔔" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white z-40"
      style={{ boxShadow: "0 -1px 0 #e5e7eb" }}>
      <div className="max-w-lg mx-auto flex justify-around py-2">
        {items.map((item) => (
          <button key={item.id} onClick={() => navigate(item.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition"
            style={{ color: active === item.id ? "#004481" : "#9ca3af" }}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
            {active === item.id && (
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "#004481" }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export { BottomNav };