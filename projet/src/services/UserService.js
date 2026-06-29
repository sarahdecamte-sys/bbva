// services/UserService.js

export const usersDB = {
  "07893516": {
    id: 1,
    code: "07893516",
    password: "260826",
    nom: "Gabriel Mologne",
    email: "guttierezgemasanchez@gmail.com",
    telephone: "+54 112 43 19 64",
    adresse: "SANCHEZ 11 28025 Buenos Aires, Argentine",
    solde:1500000,
    devise: "£",
    compteBloque: true,
    montantDeblocage: 25000,
    blockReason: 'votre compte a été temporairement bloqué pour des raisons de securité. Contactez votre conseiller BBVA',
    numeroCompte: "ES76 0049 2234 5678 9012 3456",
    bic: "BBCHESMMXXX",
    carte: "4298",
    exp: "12/27",
    decouvertAutorise: 0,
    decouvertUtilise: 0,
    transactions: [
     
      { id: 2, date: "2026-04-15", libelle: "Achat en ligne - Amazon", montant: -89.99, type: "debit", categorie: "Achat" },
      { id: 3, date: "2026-04-10", libelle: "Retrait DAB", montant: -200, type: "debit", categorie: "Retrait" },
      { id: 4, date: "2026-03-28", libelle: "Virement reçu", montant: 3500, type: "credit", categorie: "Virement" },
      { id: 5, date: "2026-03-05", libelle: "Prélèvement loyer", montant: -850, type: "debit", categorie: "Logement" },
    ]
  }
};

export const loginUser = (code, password) => {
  const user = usersDB[code];
  if (!user) return { success: false, message: "Code client incorrect" };
  if (user.password !== password) return { success: false, message: "Mot de passe incorrect" };
  const { password: _, ...userSafe } = user;
  return { success: true, user: userSafe };
};