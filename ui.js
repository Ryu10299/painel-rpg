import { currentRoom } from "./rooms.js"



const recentBtn = document.getElementById("recentBtn")
const recentPanel = document.getElementById("recentPanel")

const playersBtn = document.getElementById("playersBtn")
const playersPanel = document.getElementById("playersPanel")

const chatBtn = document.getElementById("chatBtn")
const chatPanel = document.getElementById("chatPanel")



// ABRIR / FECHAR LISTA

playersBtn.onclick = () => {

if(playersPanel.style.display === "none" || playersPanel.style.display === ""){

playersPanel.style.display = "block"

}else{

playersPanel.style.display = "none"

}

}



// ABRIR / FECHAR CHAT

chatBtn.onclick = () => {

if(chatPanel.style.display === "none" || chatPanel.style.display === ""){

chatPanel.style.display = "flex"

}else{

chatPanel.style.display = "none"

}

}



// ABRIR / FECHAR RECENTES

recentBtn.onclick = () => {

if(recentPanel.style.display === "none" || recentPanel.style.display === ""){

showRecentRooms()

recentPanel.style.display = "block"

}else{

recentPanel.style.display = "none"

}

}



// MOSTRAR SALAS RECENTES

function showRecentRooms(){

recentPanel.innerHTML = "<b>Salas recentes:</b><br>"

let list = JSON.parse(localStorage.getItem("recentRooms") || "[]")

if(list.length === 0){

recentPanel.innerHTML += "Nenhuma sala recente"

return

}

list.reverse().forEach(room => {

let div = document.createElement("div")

div.className = "recentRoom"

div.innerText = room

div.onclick = () => {

document.getElementById("roomCode").value = room

alert("Código da sala colocado no campo")

}

recentPanel.appendChild(div)

})

}