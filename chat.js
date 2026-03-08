import { db, ref, push, onChildAdded } from "./firebase.js";

const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-msg");

let username = prompt("Nome do investigador:");

const chatRef = ref(db, "chat");

/* enviar mensagem */

sendBtn.onclick = () => {

const msg = chatInput.value;

if(msg === "") return;

push(chatRef,{

user: username,
text: msg,
time: Date.now()

});

chatInput.value = "";

};

/* receber mensagens */

onChildAdded(chatRef,(snapshot)=>{

const data = snapshot.val();

const msg = document.createElement("div");

msg.classList.add("chat-message");

msg.innerHTML = `<b>${data.user}:</b> ${data.text}`;

chatBox.appendChild(msg);

chatBox.scrollTop = chatBox.scrollHeight;

});