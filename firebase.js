// IMPORTAR FIREBASE

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";



// CONFIGURAÇÃO DO SEU FIREBASE

const firebaseConfig = {

apiKey: "AIzaSyCxr1Oa3jh3hzcWma8XWYp6-8H_XW1qDGI",

authDomain: "painel-rpg-73151.firebaseapp.com",

databaseURL: "https://painel-rpg-73151-default-rtdb.firebaseio.com",

projectId: "painel-rpg-73151",

storageBucket: "painel-rpg-73151.firebasestorage.app",

messagingSenderId: "687293811504",

appId: "1:687293811504:web:dee9a98182c2702ad496f5"

};



// INICIAR FIREBASE

const app = initializeApp(firebaseConfig);



// BANCO DE DADOS

const db = getDatabase(app);



// EXPORTAR PARA OUTROS ARQUIVOS

export { db };

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

import { 
getDatabase,
ref,
push,
onChildAdded
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyCxr1Oa3jh3hzcWma8XWYp6-8H_XW1qDGI",
  authDomain: "painel-rpg-73151.firebaseapp.com",
  databaseURL: "https://painel-rpg-73151-default-rtdb.firebaseio.com",
  projectId: "painel-rpg-73151",
  storageBucket: "painel-rpg-73151.firebasestorage.app",
  messagingSenderId: "687293811504",
  appId: "1:687293811504:web:dee9a98182c2702ad496f5"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export { ref, push, onChildAdded };