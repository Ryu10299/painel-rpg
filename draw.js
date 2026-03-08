// draw.js

const canvas = document.getElementById("draw-layer");
const ctx = canvas.getContext("2d");

let drawing = false;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* =====================
   POSIÇÃO DO CURSOR
===================== */

function getPos(e){

    const rect = canvas.getBoundingClientRect();

    if(e.touches){
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        }
    }

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

/* =====================
   COMEÇAR DESENHO
===================== */

function startDraw(e){

    drawing = true;

    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(pos.x,pos.y);

}

/* =====================
   DESENHAR
===================== */

function draw(e){

    if(!drawing) return;

    const pos = getPos(e);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.lineCap = "round";

    ctx.lineTo(pos.x,pos.y);
    ctx.stroke();
}

/* =====================
   PARAR DESENHO
===================== */

function stopDraw(){

    drawing = false;
}

/* =====================
   EVENTOS
===================== */

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDraw);