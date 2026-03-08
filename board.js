// board.js
// Sistema de mural investigativo

const board = document.getElementById("investigation-board");
const uploadInput = document.getElementById("upload-evidence");
const addNoteBtn = document.getElementById("add-note");

let evidenceCount = 0;

/* =========================
   Criar evidência no mural
========================= */

function createEvidence(content, x = 100, y = 100) {

    const evidence = document.createElement("div");
    evidence.classList.add("evidence");
    evidence.style.left = x + "px";
    evidence.style.top = y + "px";

    evidence.dataset.id = evidenceCount++;

    evidence.innerHTML = `
        <div class="evidence-header">
            <span>Pista</span>
            <button class="delete-btn">✕</button>
        </div>
        <div class="evidence-content">
            ${content}
        </div>
    `;

    board.appendChild(evidence);

    enableDrag(evidence);

    evidence.querySelector(".delete-btn").onclick = () => {
        evidence.remove();
    };
}

/* =========================
   Upload de imagem
========================= */

uploadInput.addEventListener("change", function() {

    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        const imgHTML = `
            <img src="${e.target.result}" class="evidence-img"/>
        `;

        createEvidence(imgHTML);

    };

    reader.readAsDataURL(file);
});

/* =========================
   Criar nota de texto
========================= */

addNoteBtn.addEventListener("click", () => {

    const noteHTML = `
        <textarea class="evidence-note" placeholder="Digite sua pista..."></textarea>
    `;

    createEvidence(noteHTML);

});

/* =========================
   Sistema de arrastar
   (mouse + touch)
========================= */

function enableDrag(element) {

    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    const startDrag = (e) => {

        isDragging = true;

        const rect = element.getBoundingClientRect();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;

        element.style.zIndex = 999;
    };

    const drag = (e) => {

        if (!isDragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        element.style.left = (clientX - offsetX) + "px";
        element.style.top = (clientY - offsetY) + "px";
    };

    const stopDrag = () => {

        isDragging = false;
        element.style.zIndex = 1;

    };

    element.addEventListener("mousedown", startDrag);
    element.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);

    element.addEventListener("touchstart", startDrag);
    element.addEventListener("touchmove", drag);
    document.addEventListener("touchend", stopDrag);
}