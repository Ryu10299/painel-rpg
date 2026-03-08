import { db, ref, push, onChildAdded } from "./firebase.js";
import { onDisconnect, set, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const playersList = document.getElementById("players-list");

let username = localStorage.getItem("username");

if(!username){

username = prompt("Nome do investigador:");
localStorage.setItem("username", username);

}

/* =====================
   ID único do jogador
===================== */

const playerId = "player_" + Math.random().toString(36).substr(2,9);

const playerRef = ref(db, "players/" + playerId);

/* =====================
   Registrar jogador
===================== */

set(playerRef,{

name: username,
online: true

});

/* =====================
   Remover quando sair
===================== */

onDisconnect(playerRef).remove();

/* =====================
   Mostrar jogadores
===================== */

const playersRef = ref(db,"players");

onChildAdded(playersRef,(snapshot)=>{

const data = snapshot.val();

const player = document.createElement("div");

player.classList.add("player");

player.innerHTML = `🟢 ${data.name}`;

playersList.appendChild(player);

});