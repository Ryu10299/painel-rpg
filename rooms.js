import { db } from "./firebase.js"

import { ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"



let playerName = null
let currentRoom = null



// ELEMENTOS

const login = document.getElementById("login")
const topbar = document.getElementById("topbar")

const enterBtn = document.getElementById("enterBtn")
const createRoomBtn = document.getElementById("createRoom")
const joinRoomBtn = document.getElementById("joinRoom")

const nameInput = document.getElementById("nameInput")
const roomInput = document.getElementById("roomCode")



// ENTRAR NO SISTEMA

enterBtn.onclick = () => {

playerName = nameInput.value.trim()

if(playerName === ""){

alert("Digite seu nome")

return

}

login.style.display = "none"

topbar.style.display = "flex"

}



// GERAR CÓDIGO DE SALA

function generateRoomCode(){

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

let code = ""

for(let i=0;i<6;i++){

code += chars[Math.floor(Math.random()*chars.length)]

}

return code

}



// CRIAR SALA

createRoomBtn.onclick = () => {

if(!playerName){

alert("Digite seu nome primeiro")

return

}

currentRoom = generateRoomCode()

connectPlayer()

saveRecentRoom(currentRoom)

alert("Sala criada: " + currentRoom)

}



// ENTRAR EM SALA

joinRoomBtn.onclick = () => {

if(!playerName){

alert("Digite seu nome primeiro")

return

}

let code = roomInput.value.trim()

if(code === ""){

alert("Digite o código da sala")

return

}

currentRoom = code

connectPlayer()

saveRecentRoom(currentRoom)

}



// CONECTAR JOGADOR NO FIREBASE

function connectPlayer(){

set(

ref(db,"rooms/"+currentRoom+"/players/"+playerName),

{

name:playerName

}

)

}



// SALVAR SALA EM RECENTES

function saveRecentRoom(code){

let list = JSON.parse(localStorage.getItem("recentRooms") || "[]")

if(!list.includes(code)){

list.push(code)

}

localStorage.setItem("recentRooms", JSON.stringify(list))

}



// EXPORTAR SALA ATUAL

export { currentRoom, playerName }