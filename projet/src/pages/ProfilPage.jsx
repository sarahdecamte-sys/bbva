// pages/ProfilPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, User, Mail, Phone, MapPin, LogOut, ChevronRight } from "lucide-react";
import { BottomNav } from "./CartePage";

export default function ProfilPage({ navigate }) {
  const { currentUser, logout } = useAuth();

  if (!currentUser) { navigate("login"); return null; }

  const handleLogout = () => { logout(); navigate("login"); };

  const infos = [
    { icon: User, label: "Nom complet", value: currentUser.nom },
    { icon: Mail, label: "Email", value: currentUser.email },
    { icon: Phone, label: "Téléphone", value: currentUser.telephone },
    { icon: MapPin, label: "Adresse", value: currentUser.adresse },
  ];

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

      <main className="max-w-lg mx-auto w-full px-4 py-6 space-y-4">

        {/* Hero profil */}
        <div className="relative rounded-3xl overflow-hidden p-6 text-white shadow-xl"
          style={{ background: "linear-gradient(135deg, #004481 0%, #001f3f 100%)" }}>
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              {currentUser.nom?.charAt(0) || "G"}
            </div>
            <div>
              <p className="font-bold text-lg">{currentUser.nom}</p>
              <p className="text-blue-200 text-sm">{"Client BBVA"}</p>
              <span className="inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(234,88,12,0.3)", color: "#fed7aa" }}>
                {"Compte bloqué"}
              </span>
            </div>
          </div>
        </div>

        {/* Infos personnelles */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="font-bold text-gray-800">{"Informations personnelles"}</h2>
          </div>
          {infos.map(({ icon: Icon, label, value }, i) => (
            <div key={label}
              className={`flex items-center gap-4 px-5 py-3.5 ${i < infos.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#e8f0f8" }}>
                <Icon size={15} style={{ color: "#004481" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{value || "—"}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </div>
          ))}
        </div>

        {/* Infos bancaires */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-2">
            <h2 className="font-bold text-gray-800">{"Informations bancaires"}</h2>
          </div>
          {[
            { label: "IBAN", value: currentUser.numeroCompte },
            { label: "BIC / SWIFT", value: currentUser.bic },
          ].map(({ label, value }, i) => (
            <div key={label}
              className={`px-5 py-3.5 ${i === 0 ? "border-b border-gray-50" : ""}`}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-mono font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Déconnexion */}
        <button onClick={handleLogout}
          className="w-full bg-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:bg-red-50 transition active:scale-95"
          style={{ border: "1.5px solid #fecaca", color: "#dc2626" }}>
          <LogOut size={18} />
          {"Se déconnecter"}
        </button>
      </main>

      <BottomNav navigate={navigate} active="profil" />
    </div>
  );
}