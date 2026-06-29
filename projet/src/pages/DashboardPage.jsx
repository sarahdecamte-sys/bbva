// pages/DashboardPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Lock, TrendingUp, TrendingDown, Send, Bell, ArrowUpRight, CreditCard, History } from "lucide-react";
import { BottomNav } from "./CartePage";

export default function DashboardPage({ navigate }) {
  const { currentUser, logout } = useAuth();

  if (!currentUser) { navigate("login"); return null; }

  const handleLogout = () => { logout(); navigate("login"); };

  const formatMontant = (m) =>
    new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(m);

  return (
    <div translate="no" className="min-h-screen pb-24 flex flex-col" style={{ backgroundColor: "#f0f4f8" }}>

      {/* Header */}
      <header className="bg-white px-4 py-3 sticky top-0 z-50" style={{ boxShadow: "0 1px 0 #e5e7eb" }}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <img src="images/L1.jpeg" alt="BBVA" className="h-8 w-auto object-contain" />
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("notifications")}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#004481" }} />
            </button>
            <button onClick={handleLogout}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: "#004481" }}>
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 pt-6 pb-4 space-y-4">

        {/* Greeting */}
        <div>
          <p className="text-gray-400 text-sm">{"Bonjour,"}</p>
          <h1 className="text-xl font-bold text-gray-900">{currentUser.nom}</h1>
        </div>

        {/* Carte solde hero */}
        <div className="relative rounded-3xl overflow-hidden text-white p-6 shadow-xl"
          style={{ background: "linear-gradient(135deg, #004481 0%, #001f3f 100%)" }}>
          {/* Cercles décoratifs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />

          <div className="relative z-10">
            <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-3">{"Solde disponible"}</p>
            <p className="text-4xl font-bold tracking-tight mb-1">
              {formatMontant(currentUser.solde)}
              <span className="text-2xl ml-2 text-blue-300">{currentUser.devise}</span>
            </p>
            <p className="text-blue-300 text-xs mt-3 font-mono">{currentUser.numeroCompte}</p>

            {/* Mini actions dans la card */}
            <div className="flex gap-3 mt-5">
              <button onClick={() => navigate("virement")}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}>
                <Send size={14} /> {"Virement"}
              </button>
              <button onClick={() => navigate("carte")}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}>
                <CreditCard size={14} /> {"Ma carte"}
              </button>
            </div>
          </div>
        </div>

        {/* Alerte blocage */}
        {currentUser.compteBloque && (
          <div className="rounded-2xl p-5 shadow-sm border"
            style={{ backgroundColor: "#fff8f0", borderColor: "#fed7aa" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#ffedd5" }}>
                <Lock size={18} style={{ color: "#ea580c" }} />
              </div>
              <div>
                <p className="font-bold text-orange-800">{"Compte bloqué"}</p>
                <p className="text-xs text-orange-500">{"Action requise"}</p>
              </div>
            </div>
            <p className="text-orange-700 text-sm mb-4">{currentUser.blockReason}</p>
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "#ffedd5" }}>
              <p className="text-xs mb-1 font-medium text-orange-700">{"Montant requis pour le déblocage"}</p>
              <p className="text-2xl font-bold text-orange-800">
                {formatMontant(currentUser.montantDeblocage) + " " + currentUser.devise}
              </p>
              <p className="text-xs text-orange-500 mt-2">{"Contactez votre conseiller BBVA."}</p>
            </div>
          </div>
        )}

        {/* Raccourcis */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Virement", icon: Send, page: "virement" },
            { label: "Historique", icon: History, page: "historique" },
            { label: "Carte", icon: CreditCard, page: "carte" },
          ].map(({ label, icon: Icon, page }) => (
            <button key={page} onClick={() => navigate(page)}
              className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#e8f0f8" }}>
                <Icon size={18} style={{ color: "#004481" }} />
              </div>
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </button>
          ))}
        </div>

        {/* Dernières opérations */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-bold text-gray-800">{"Dernières opérations"}</h2>
            <button onClick={() => navigate("historique")}
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: "#004481" }}>
              {"Voir tout"} <ArrowUpRight size={13} />
            </button>
          </div>
          <div>
            {(currentUser.transactions || []).slice(0, 4).map((op, i, arr) => (
              <div key={op.id}
                className={`px-5 py-3.5 flex items-center justify-between ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${op.type === "credit" ? "bg-green-50" : "bg-gray-50"}`}>
                    {op.type === "credit"
                      ? <TrendingUp size={16} className="text-green-500" />
                      : <TrendingDown size={16} className="text-gray-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{op.libelle}</p>
                    <p className="text-xs text-gray-400">{new Date(op.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <p className={`font-bold text-sm ${op.type === "credit" ? "text-green-600" : "text-gray-700"}`}>
                  {(op.montant > 0 ? "+" : "") + formatMontant(op.montant) + " " + currentUser.devise}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav navigate={navigate} active="dashboard" />
    </div>
  );
}