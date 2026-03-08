// suspects.js

const suspectList = document.getElementById("suspect-list");
const suspectName = document.getElementById("suspect-name");
const suspectDesc = document.getElementById("suspect-desc");
const suspectPhoto = document.getElementById("suspect-photo");
const addSuspectBtn = document.getElementById("add-suspect");

let suspectId = 0;

/* =========================
   Adicionar suspeito
========================= */

addSuspectBtn.addEventListener("click", () => {

    const name = suspectName.value.trim();
    const desc = suspectDesc.value.trim();
    const file = suspectPhoto.files[0];

    if(!name) return;

    const reader = new FileReader();

    reader.onload = function(e){

        const suspect = document.createElement("div");
        suspect.classList.add("suspect-card");

        suspect.dataset.id = suspectId++;

        suspect.innerHTML = `
        
        <img src="${file ? e.target.result : ''}" class="suspect-img">

        <div class="suspect-info">

            <h3>${name}</h3>
            <p>${desc}</p>

        </div>

        <button class="delete-suspect">✕</button>
        
        `;

        suspectList.appendChild(suspect);

        suspect.querySelector(".delete-suspect").onclick = () => {
            suspect.remove();
        };

    };

    if(file){
        reader.readAsDataURL(file);
    }else{
        reader.onload({target:{result:""}});
    }

    suspectName.value = "";
    suspectDesc.value = "";
    suspectPhoto.value = "";
});