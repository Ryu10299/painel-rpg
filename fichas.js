/* ==========================================================================
   MÓDULO: fichas.js (Versão 4.0.0 - A Forja dos Deuses Completa)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("activeUser") || typeof currentUser !== "undefined") {
        initFichasModule();
    }
});

// Inicialização do módulo injetando o container principal
window.initFichasModule = function() {
    const fichasContainer = document.getElementById('fichas');
    if (!fichasContainer) return;

    fichasContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h2 style="font-family: 'Cinzel', serif; letter-spacing: 2px; text-transform: uppercase; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.1);">Forja de Heróis</h2>
            <div style="display: flex; gap: 10px;">
                <button class="btn-gow" onclick="abrirForjaEtapa1()"><i class="fa-solid fa-hammer"></i> Forjar Novo Arquétipo</button>
                <button class="btn-gow" id="btnModoExclusaoFicha" style="background: #2a2a2a; border-color: #444; color: #aaa;" onclick="toggleModoExclusaoFicha()"><i class="fa-solid fa-skull"></i> Apagar Ficha</button>
            </div>
        </div>
        <hr style="border: 0; height: 1px; background: linear-gradient(to right, #8b0000, #2a2a2a, transparent); margin: 15px 0 25px 0;">
        
        <div id="fichasConteudoDinamico"></div>
    `;

    listarFichasSalvas();
};

// Banco de dados simulado no LocalStorage por usuário ativo
function obterChaveFichas() {
    const usuario = localStorage.getItem("activeUser") || window.currentUser || "comum";
    return `gow_rpg_fichas_v4_${usuario}`;
}

function calcularNivelPorCasa(casaString) {
    const mapa = {
        "Sétima Casa": 1, "Sexta Casa": 2, "Quinta Casa": 3,
        "Quarta Casa": 4, "Terceira Casa": 5, "Segunda Casa": 6, "Primeira Casa": 7
    };
    return mapa[casaString] || 1;
}

function calcularModificador(valorBase) {
    return Math.floor((valorBase || 0) / 2);
}

// Lista os cards prontos
window.listarFichasSalvas = function() {
    const container = document.getElementById('fichasConteudoDinamico');
    if (!container) return;

    const dadosBrutos = localStorage.getItem(obterChaveFichas());
    const fichas = dadosBrutos ? JSON.parse(dadosBrutos) : [];

    if (fichas.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; background: #0b0b0b; border: 1px dashed #222; color: #555; border-radius: 4px;">
                <i class="fa-solid fa-scroll" style="font-size: 32px; margin-bottom: 10px; color: #333;"></i>
                <p style="font-style: italic; font-size: 15px;">Nenhum herói ou divindade foi forjado neste reino ainda.</p>
            </div>
        `;
        return;
    }

    let html = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">`;
    
    fichas.forEach(ficha => {
        const mostraFuria = (ficha.arquetipo === "Deuses" || ficha.arquetipo === "Semi-Deuses");
        const fPoints = parseInt(ficha.furiaPorcentagem) || 0;
        
        // Determinação (Calculada Base Mod Forca + Mod Const + Level)
        const nivel = calcularNivelPorCasa(ficha.casaLevel);
        const modForca = calcularModificador(ficha.atributos.forca);
        const modConst = calcularModificador(ficha.atributos.constituicao);
        const determinacao = modForca + modConst + (nivel * 4);
        
        // Vida Base
        const vida = ficha.vidaAtual || (ficha.atributos.forca + ficha.atributos.constituicao);

        html += `
            <div class="card-ficha-pronta" onclick="handleCardClick('${ficha.id}', '${ficha.nome.replace(/'/g, "\\'")}')" style="background: radial-gradient(circle at top, #141414 0%, #0f0f0f 100%); border: 1px solid #251010; padding: 20px; border-radius: 4px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 15px; position: relative; border-left: 3px solid #8b0000; cursor: pointer; transition: all 0.2s;">
                
                <div style="display: flex; gap: 15px; align-items: center;">
                    <div style="width: 65px; height: 65px; border-radius: 50%; border: 2px solid #8b0000; overflow: hidden; background: #000; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 10px rgba(139, 0, 0, 0.4); flex-shrink: 0;">
                        <img src="${ficha.foto || 'https://i.imgur.com/v8bXN9s.png'}" style="width: 100%; height: 100%; object-fit: cover; transform: scale(${ficha.imgZoom || 1}) translate(${ficha.imgX || 0}px, ${ficha.imgY || 0}px);">
                    </div>
                    <div style="overflow: hidden;">
                        <h3 style="font-size: 18px; color: #fff; margin: 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; font-family: 'Cinzel', serif;">${ficha.nome}</h3>
                        <p style="font-size: 12px; color: #d4af37; font-style: italic; margin: 2px 0 0 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${ficha.titulo || 'Sem Título Divino'}</p>
                        <span style="display: inline-block; background: #2a0808; color: #ff3333; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px; margin-top: 5px; border: 1px solid #551111; text-transform: uppercase; font-family: 'Cinzel', serif;">${ficha.arquetipo}</span>
                        <span style="display: inline-block; background: #1a1505; color: #d4af37; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px; margin-left: 5px; border: 1px solid #443605; text-transform: uppercase; font-family: 'Cinzel', serif;">${ficha.casaLevel}</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                     <div style="background: rgba(139,0,0,0.1); padding: 5px; border-radius: 4px; border: 1px solid #330000; text-align: center;">
                        <span style="display: block; font-size: 10px; color: #ff3333; font-weight: bold;">VIDA (HP)</span>
                        <strong style="color: #fff; font-size: 14px; font-family: 'Cinzel', serif;">${vida}</strong>
                    </div>
                     <div style="background: rgba(0,0,139,0.1); padding: 5px; border-radius: 4px; border: 1px solid #000033; text-align: center;">
                        <span style="display: block; font-size: 10px; color: #3388ff; font-weight: bold;">DETERMINAÇÃO (DET)</span>
                        <strong style="color: #fff; font-size: 14px; font-family: 'Cinzel', serif;">${determinacao}</strong>
                    </div>
                </div>

                ${mostraFuria ? `
                <div style="background: #090909; border: 1px solid #112211; padding: 10px; border-radius: 4px;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:5px; font-family:'Cinzel', serif;">
                        <span style="color:#22ff22; font-weight:bold;"><i class="fa-solid fa-fire"></i> FÚRIA: ${ficha.modoFuriaTipo}</span>
                        <span style="color:#fff;">${fPoints}%</span>
                    </div>
                    <div style="width:100%; height:6px; background:#051f05; border-radius:3px; overflow:hidden; border:1px solid #0a3d0a;">
                        <div style="width: ${Math.min(100, Math.max(0, fPoints))}%; height:100%; background: linear-gradient(to right, #006600, #00ff00); box-shadow: 0 0 8px #00ff00;"></div>
                    </div>
                </div>
                ` : ''}

            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
};

// ==========================================================================
// MODO EXCLUSÃO GLOBAL E SELEÇÃO
// ==========================================================================
window.modoExclusaoFicha = false;

window.toggleModoExclusaoFicha = function() {
    window.modoExclusaoFicha = !window.modoExclusaoFicha;
    const btn = document.getElementById('btnModoExclusaoFicha');
    const cards = document.querySelectorAll('.card-ficha-pronta');
    
    if (window.modoExclusaoFicha) {
        btn.style.background = '#8b0000';
        btn.style.color = '#fff';
        btn.style.borderColor = '#ff3333';
        btn.innerHTML = `<i class="fa-solid fa-crosshairs"></i> Selecione o Alvo...`;
        cards.forEach(c => {
            c.style.border = "1px dashed #ff3333";
            c.style.boxShadow = "0 0 15px rgba(255, 51, 51, 0.2)";
        });
    } else {
        btn.style.background = '#2a2a2a';
        btn.style.color = '#aaa';
        btn.style.borderColor = '#444';
        btn.innerHTML = `<i class="fa-solid fa-skull"></i> Apagar Ficha`;
        cards.forEach(c => {
            c.style.border = "1px solid #251010";
            c.style.boxShadow = "0 5px 15px rgba(0,0,0,0.5)";
        });
    }
};

window.handleCardClick = function(id, nome) {
    if (window.modoExclusaoFicha) {
        abrirConfirmacaoExclusao(id, nome);
    } else {
        abrirVisaoFichaCompleta(id);
    }
};

window.abrirConfirmacaoExclusao = function(id, nome) {
    let overlay = document.getElementById('confirmFichaDeleteModal');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'confirmFichaDeleteModal';
        overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(4px); z-index: 3000; display: flex; justify-content: center; align-items: center; transition: opacity 0.2s ease-in-out;";
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div style="background: #0f0f0f; border: 1px solid #8b0000; padding: 30px; width: 85%; max-width: 400px; text-align: center; border-radius: 6px; box-shadow: 0px 0px 35px rgba(139, 0, 0, 0.4);">
            <h3 style="color: #ff3333; font-size: 18px; margin-bottom: 12px;"><i class="fa-solid fa-triangle-exclamation"></i> Sacrifício de Registro</h3>
            <p style="color: #bbb; font-size: 15px; margin-bottom: 25px; font-family: 'Marcellus', serif;">Deseja queimar o registro de "${nome}" nas chamas de Muspelheim permanentemente?</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button class="btn-gow" onclick="deletarFichaDefinitivo('${id}')" style="margin: 0; flex: 1; padding: 12px 0; background: #8b0000;">Sim</button>
                <button class="btn-gow btn-secondary" onclick="document.getElementById('confirmFichaDeleteModal').remove(); window.toggleModoExclusaoFicha();" style="margin: 0; flex: 1; padding: 12px 0;">Não</button>
            </div>
        </div>
    `;
};

window.deletarFichaDefinitivo = function(id) {
    const chave = obterChaveFichas();
    let fichas = JSON.parse(localStorage.getItem(chave) || "[]");
    fichas = fichas.filter(f => f.id !== id);
    localStorage.setItem(chave, JSON.stringify(fichas));
    
    const overlay = document.getElementById('confirmFichaDeleteModal');
    if (overlay) overlay.remove();
    
    window.modoExclusaoFicha = false;
    listarFichasSalvas();
    
    // Reseta o botão visualmente
    const btn = document.getElementById('btnModoExclusaoFicha');
    if (btn) {
        btn.style.background = '#2a2a2a';
        btn.style.color = '#aaa';
        btn.style.borderColor = '#444';
        btn.innerHTML = `<i class="fa-solid fa-skull"></i> Apagar Ficha`;
    }
};

// ==========================================================================
// ETAPA 1 E MANIPULAÇÃO DE IMAGEM
// ==========================================================================
window.fichaRascunho = null;
let imgZoom = 1;
let imgX = 0;
let imgY = 0;
let isDragging = false;
let startX, startY;

window.abrirForjaEtapa1 = function(fichaExistente = null) {
    const container = document.getElementById('fichasConteudoDinamico');
    if (!container) return;

    if (fichaExistente) {
        window.fichaRascunho = JSON.parse(JSON.stringify(fichaExistente));
        imgZoom = fichaExistente.imgZoom || 1;
        imgX = fichaExistente.imgX || 0;
        imgY = fichaExistente.imgY || 0;
    } else {
        window.fichaRascunho = {
            id: 'ficha_' + Date.now(),
            nome: '',
            titulo: '',
            arquetipo: 'Humanos',
            foto: '',
            imgZoom: 1, imgX: 0, imgY: 0,
            casaLevel: 'Sétima Casa',
            modoFuriaTipo: 'Puro',
            furiaPorcentagem: 0,
            vidaAtual: 0,
            atributos: { forca: 0, intelecto: 0, constituicao: 0, sabedoria: 0, carisma: 0, destreza: 0 },
            habilidades: []
        };
        imgZoom = 1; imgX = 0; imgY = 0;
    }

    const f = window.fichaRascunho;

    container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; background: #0d0d0d; border: 1px solid #222; padding: 30px; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.7);">
            <h3 style="font-family: 'Cinzel', serif; color: #d4af37; font-size: 18px; margin-bottom: 20px; text-align: center; border-bottom: 1px solid #222; padding-bottom: 10px;">Etapa 1: Linhagem e Identidade</h3>
            
            <div id="avisoAzulZeus" style="display: none; background: #02111a; border: 1px solid #00d9ff; color: #00d9ff; padding: 12px; font-size: 14px; border-radius: 4px; margin-bottom: 20px; box-shadow: 0 0 15px rgba(0, 217, 255, 0.2); font-family: 'Marcellus', serif;">
                <i class="fa-solid fa-bolt-lightning" style="text-shadow: 0 0 5px #00d9ff;"></i> <span id="avisoAzulTexto">O Panteão exige que você preencha este campo sagrado!</span>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; gap: 10px;">
                <div style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #8b0000; overflow: hidden; background: #050505; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 15px rgba(139,0,0,0.3); position: relative; cursor: grab;" onmousedown="ativarArrastoImagem(event)">
                    <img id="previewFotoCirculo" src="${f.foto || 'https://i.imgur.com/v8bXN9s.png'}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none; transform: scale(${imgZoom}) translate(${imgX}px, ${imgY}px);">
                </div>
                <div style="display: flex; gap: 5px;">
                     <button class="btn-gow btn-secondary" onclick="document.getElementById('inputFotoFicha').click()" style="padding: 4px 10px; font-size: 11px; margin: 0;"><i class="fa-solid fa-image"></i> Imagem</button>
                     <button class="btn-gow btn-secondary" onclick="ajustarZoomImagem(0.1)" style="padding: 4px 10px; font-size: 11px; margin: 0;"><i class="fa-solid fa-plus"></i></button>
                     <button class="btn-gow btn-secondary" onclick="ajustarZoomImagem(-0.1)" style="padding: 4px 10px; font-size: 11px; margin: 0;"><i class="fa-solid fa-minus"></i></button>
                </div>
                <input type="file" id="inputFotoFicha" accept="image/*" style="display: none;" onchange="processarFotoPerfil(this)">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; font-family: 'Cinzel', serif; font-size: 12px; color: #aaa; margin-bottom: 8px; letter-spacing: 1px;">Nome do Personagem <span style="color:#8b0000;">*</span></label>
                <input type="text" id="forjaNome" value="${f.nome}" placeholder="Ex: Kratos, Baldur, Thor..." style="width: 100%; padding: 12px; background: #050505; border: 1px solid #222; color: #fff; font-family: 'Marcellus', serif; font-size: 15px; border-radius: 4px;" onfocus="esconderAvisoAzul()">
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; font-family: 'Cinzel', serif; font-size: 12px; color: #aaa; margin-bottom: 8px; letter-spacing: 1px;">Título do Personagem</label>
                <input type="text" id="forjaTitulo" value="${f.titulo}" placeholder="Ex: O Fantasma de Esparta, O Rei dos Mares..." style="width: 100%; padding: 12px; background: #050505; border: 1px solid #222; color: #fff; font-family: 'Marcellus', serif; font-size: 15px; border-radius: 4px;">
            </div>

            <div style="margin-bottom: 30px;">
                <label style="display: block; font-family: 'Cinzel', serif; font-size: 12px; color: #aaa; margin-bottom: 8px; letter-spacing: 1px;">Arquétipo</label>
                <select id="forjaArquetipo" style="width: 100%; padding: 12px; background: #050505; border: 1px solid #222; color: #fff; font-family: 'Marcellus', serif; font-size: 15px; border-radius: 4px; cursor: pointer;">
                    <option value="Deuses" ${f.arquetipo === 'Deuses' ? 'selected' : ''}>Deuses</option>
                    <option value="Semi-Deuses" ${f.arquetipo === 'Semi-Deuses' ? 'selected' : ''}>Semi-Deuses</option>
                    <option value="Humanos" ${f.arquetipo === 'Humanos' ? 'selected' : ''}>Humanos</option>
                    <option value="Anões" ${f.arquetipo === 'Anões' ? 'selected' : ''}>Anões</option>
                    <option value="Gigantes" ${f.arquetipo === 'Gigantes' ? 'selected' : ''}>Gigantes</option>
                </select>
            </div>

            <div style="display: flex; justify-content: space-between; border-top: 1px solid #222; padding-top: 20px; margin-top: 20px;">
                <button class="btn-gow btn-secondary" onclick="cancelarForja()"><i class="fa-solid fa-xmark"></i> Cancelar</button>
                <button class="btn-gow" onclick="avancarParaEtapa2()"><i class="fa-solid fa-arrow-right"></i> Continuar</button>
            </div>
        </div>
    `;
};

window.ajustarZoomImagem = function(delta) {
    const img = document.getElementById('previewFotoCirculo');
    if (!img) return;
    imgZoom += delta;
    if (imgZoom < 0.5) imgZoom = 0.5;
    if (imgZoom > 3) imgZoom = 3;
    img.style.transform = `scale(${imgZoom}) translate(${imgX}px, ${imgY}px)`;
}

window.ativarArrastoImagem = function(e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    document.addEventListener('mousemove', arrastarImagem);
    document.addEventListener('mouseup', desativarArrastoImagem);
}

function arrastarImagem(e) {
    if (!isDragging) return;
    const dx = (e.clientX - startX) / imgZoom;
    const dy = (e.clientY - startY) / imgZoom;
    imgX += dx;
    imgY += dy;
    startX = e.clientX;
    startY = e.clientY;
    
    const img = document.getElementById('previewFotoCirculo');
    if (img) img.style.transform = `scale(${imgZoom}) translate(${imgX}px, ${imgY}px)`;
}

function desativarArrastoImagem() {
    isDragging = false;
    document.removeEventListener('mousemove', arrastarImagem);
    document.removeEventListener('mouseup', desativarArrastoImagem);
}


window.processarFotoPerfil = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewFotoCirculo').src = e.target.result;
            if (window.fichaRascunho) window.fichaRascunho.foto = e.target.result;
            imgZoom = 1; imgX = 0; imgY = 0;
            document.getElementById('previewFotoCirculo').style.transform = `scale(1) translate(0px, 0px)`;
        };
        reader.readAsDataURL(input.files[0]);
    }
};

function mostrarAvisoAzul(mensagem) {
    const aviso = document.getElementById('avisoAzulZeus');
    const texto = document.getElementById('avisoAzulTexto');
    if (aviso && texto) {
        texto.innerText = mensagem;
        aviso.style.display = 'block';
    }
}

window.esconderAvisoAzul = function() {
    const aviso = document.getElementById('avisoAzulZeus');
    if (aviso) aviso.style.display = 'none';
};

function sincronizarInputsEtapa1() {
    if (!window.fichaRascunho) return false;
    const nomeInput = document.getElementById('forjaNome');
    const tituloInput = document.getElementById('forjaTitulo');
    const arquetipoInput = document.getElementById('forjaArquetipo');
    if (nomeInput) window.fichaRascunho.nome = nomeInput.value.trim();
    if (tituloInput) window.fichaRascunho.titulo = tituloInput.value.trim();
    if (arquetipoInput) window.fichaRascunho.arquetipo = arquetipoInput.value;
    window.fichaRascunho.imgZoom = imgZoom;
    window.fichaRascunho.imgX = imgX;
    window.fichaRascunho.imgY = imgY;
    return true;
}

window.avancarParaEtapa2 = function() {
    sincronizarInputsEtapa1();
    if (!window.fichaRascunho.nome) {
        mostrarAvisoAzul("O Nome do Personagem é obrigatório para prosseguir a jornada!");
        document.getElementById('forjaNome').focus();
        return;
    }
    abrirForjaEtapa2();
};


// ==========================================================================
// ETAPA 2: Atributos, Vida, Determinação
// ==========================================================================
window.abrirForjaEtapa2 = function() {
    const container = document.getElementById('fichasConteudoDinamico');
    if (!container) return;

    const f = window.fichaRascunho;
    const temModoFuria = (f.arquetipo === "Deuses" || f.arquetipo === "Semi-Deuses");
    
    // Todos tem casa level agora, de Sétima a Primeira
    const vidaBase = (f.atributos.forca || 0) + (f.atributos.constituicao || 0);
    f.vidaAtual = f.vidaAtual || vidaBase;
    
    const nivel = calcularNivelPorCasa(f.casaLevel);
    const mForca = calcularModificador(f.atributos.forca);
    const mConst = calcularModificador(f.atributos.constituicao);
    const detAtual = mForca + mConst + (nivel * 4);

    container.innerHTML = `
        <div style="max-width: 650px; margin: 0 auto; background: #0d0d0d; border: 1px solid #222; padding: 30px; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.7);">
            <h3 style="font-family: 'Cinzel', serif; color: #d4af37; font-size: 18px; margin-bottom: 5px; text-align: center;">Etapa 2: Valores e Atributos Pessoais</h3>
            <p style="text-align: center; color: #666; font-size: 12px; margin-bottom: 25px; font-style: italic;">Valores vitais e distribuição de poder.</p>

            <div style="background: #141108; border: 1px solid #3d310a; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
                <label style="display: block; font-family: 'Cinzel', serif; font-size: 12px; color: #d4af37; margin-bottom: 8px; letter-spacing: 1px; font-weight: bold;"><i class="fa-solid fa-gopuram"></i> Grau de Ascensão (Casa / Level)</label>
                <select id="forjaCasaLevel" style="width: 100%; padding: 10px; background: #050505; border: 1px solid #3d310a; color: #fff; font-family: 'Marcellus', serif; font-size: 14px; border-radius: 4px; cursor: pointer;" onchange="recalcularValoresDerivados()">
                    <option value="Sétima Casa" ${f.casaLevel === 'Sétima Casa' ? 'selected' : ''}>Sétima Casa (Início / Level 1)</option>
                    <option value="Sexta Casa" ${f.casaLevel === 'Sexta Casa' ? 'selected' : ''}>Sexta Casa (Level 2)</option>
                    <option value="Quinta Casa" ${f.casaLevel === 'Quinta Casa' ? 'selected' : ''}>Quinta Casa (Level 3)</option>
                    <option value="Quarta Casa" ${f.casaLevel === 'Quarta Casa' ? 'selected' : ''}>Quarta Casa (Level 4)</option>
                    <option value="Terceira Casa" ${f.casaLevel === 'Terceira Casa' ? 'selected' : ''}>Terceira Casa (Level 5)</option>
                    <option value="Segunda Casa" ${f.casaLevel === 'Segunda Casa' ? 'selected' : ''}>Segunda Casa (Level 6)</option>
                    <option value="Primeira Casa" ${f.casaLevel === 'Primeira Casa' ? 'selected' : ''}>Primeira Casa (Ápice / Level 7)</option>
                </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                
                <div style="background: rgba(139,0,0,0.1); border: 1px solid #550000; padding: 15px; border-radius: 4px;">
                    <label style="display: block; font-size: 12px; color: #ff3333; margin-bottom: 6px; font-weight: bold;"><i class="fa-solid fa-heart"></i> VIDA (HP)</label>
                    <input type="number" id="forjaVida" value="${f.vidaAtual}" style="width: 100%; padding: 8px; background: #111; border: 1px solid #440000; color: #fff; font-size: 16px; font-family: 'Cinzel', serif;" oninput="atualizarBarraVida(this.value)">
                    <p style="font-size: 10px; color: #888; margin-top: 5px;">(Soma de Força + Constituição)</p>
                    
                    <div style="width: 100%; height: 8px; background: #220000; border-radius: 4px; overflow: hidden; margin-top: 10px;">
                        <div id="barraVidaEfeito" style="width: 100%; height: 100%; background: linear-gradient(to right, #8b0000, #ff3333); box-shadow: 0 0 8px #ff0000;"></div>
                    </div>
                </div>

                <div style="background: rgba(0,0,139,0.1); border: 1px solid #000055; padding: 15px; border-radius: 4px;">
                    <label style="display: block; font-size: 12px; color: #3388ff; margin-bottom: 6px; font-weight: bold;"><i class="fa-solid fa-shield-cat"></i> DETERMINAÇÃO (DET)</label>
                    <div style="font-size: 24px; color: #fff; font-family: 'Cinzel', serif; text-align: center; padding: 5px;" id="displayDeterminacao">${detAtual}</div>
                    <p style="font-size: 10px; color: #888; margin-top: 5px; text-align: center;">(Fixo: Mod FOR + Mod CON + Lvl*4)</p>
                </div>

            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
                ${['forca', 'intelecto', 'constituicao', 'sabedoria', 'carisma', 'destreza'].map(attr => {
                    const labelAttr = attr.charAt(0).toUpperCase() + attr.slice(1);
                    const val = f.atributos[attr] || 0;
                    const mod = calcularModificador(val);
                    return `
                        <div style="display: flex; align-items: center; background: #080808; border: 1px solid #1f1f1f; padding: 12px 20px; border-radius: 4px; gap: 15px;">
                            <div style="flex: 1;">
                                <strong style="font-family: 'Cinzel', serif; font-size: 14px; color: #fff; text-transform: uppercase;">${labelAttr}</strong>
                            </div>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <span style="font-size: 11px; color: #555;">Pontos:</span>
                                <input type="number" id="attr_${attr}" value="${val}" style="width: 65px; padding: 6px; background: #111; border: 1px solid #333; color: #fff; text-align: center; border-radius: 4px; font-family: 'Marcellus', serif;" oninput="recalcularAtributos('${attr}')">
                            </div>
                            <div style="width: 90px; text-align: right;">
                                <span style="font-size: 11px; color: #777; display:block;">Modificador</span>
                                <strong id="mod_display_${attr}" style="font-size: 16px; color: #ff3333; font-family: 'Cinzel', serif;">${mod >= 0 ? '+' : ''}${mod}</strong>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            ${temModoFuria ? `
            <div style="background: #051a05; border: 1px solid #115511; padding: 20px; border-radius: 4px; margin-bottom: 30px; box-shadow: inset 0 0 15px rgba(0,139,0,0.15);">
                <h4 style="font-family: 'Cinzel', serif; color: #22ff22; font-size: 14px; margin-bottom: 15px; letter-spacing: 1px; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-fire-burner"></i> Despertar da Fúria Divina</h4>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; color: #aaa; margin-bottom: 6px;">Tipo de Modo Fúria</label>
                    <select id="forjaModoFuriaTipo" style="width: 100%; padding: 10px; background: #050505; border: 1px solid #115511; color: #fff; font-family: 'Marcellus', serif; font-size: 14px; border-radius: 4px; cursor: pointer;">
                        <option value="Espartano" ${f.modoFuriaTipo === 'Espartano' ? 'selected' : ''}>Espartano</option>
                        <option value="Ateniense" ${f.modoFuriaTipo === 'Ateniense' ? 'selected' : ''}>Ateniense</option>
                        <option value="Grego" ${f.modoFuriaTipo === 'Grego' ? 'selected' : ''}>Grego</option>
                        <option value="Puro" ${f.modoFuriaTipo === 'Puro' ? 'selected' : ''}>Puro</option>
                    </select>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <label style="font-size: 12px; color: #aaa;">Intensidade da Fúria (%):</label>
                        <strong id="furiaPorcentagemTexto" style="color: #fff; font-family: 'Cinzel', serif; font-size: 15px;">${f.furiaPorcentagem}%</strong>
                    </div>
                    <input type="range" id="forjaSliderFuria" min="0" max="100" value="${f.furiaPorcentagem}" style="width: 100%; cursor: pointer; accent-color: #22ff22; margin-bottom: 10px;" oninput="atualizarBarraFuriaVerde(this.value)">
                    
                    <div style="width: 100%; height: 10px; background: #000; border: 1px solid #114411; border-radius: 5px; overflow: hidden;">
                        <div id="barraFuriaVerdeEfeito" style="width: ${f.furiaPorcentagem}%; height: 100%; background: linear-gradient(to right, #006600, #00ff00); box-shadow: 0 0 10px #00ff00; transition: width 0.05s ease-out;"></div>
                    </div>
                </div>
            </div>
            ` : ''}

            <div style="display: flex; justify-content: space-between; border-top: 1px solid #222; padding-top: 20px;">
                <button class="btn-gow btn-secondary" onclick="voltarParaEtapa1()"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
                <button class="btn-gow" onclick="salvarFichaFinal()"><i class="fa-solid fa-floppy-disk"></i> Salvar Ficha</button>
            </div>
        </div>
    `;
};

window.atualizarBarraVida = function(valor) {
    if (window.fichaRascunho) window.fichaRascunho.vidaAtual = parseInt(valor);
};

window.atualizarBarraFuriaVerde = function(valor) {
    const texto = document.getElementById('furiaPorcentagemTexto');
    const barra = document.getElementById('barraFuriaVerdeEfeito');
    if (texto) texto.innerText = `${valor}%`;
    if (barra) barra.style.width = `${valor}%`;
    if (window.fichaRascunho) window.fichaRascunho.furiaPorcentagem = parseInt(valor);
};

window.recalcularAtributos = function(attr) {
    const input = document.getElementById(`attr_${attr}`);
    const display = document.getElementById(`mod_display_${attr}`);
    if (!input || !display) return;

    const valorBase = parseInt(input.value) || 0;
    const modificador = calcularModificador(valorBase);

    display.innerText = (modificador >= 0 ? '+' : '') + modificador;

    if (window.fichaRascunho) {
        window.fichaRascunho.atributos[attr] = valorBase;
    }

    if(attr === 'forca' || attr === 'constituicao') {
        recalcularValoresDerivados();
    }
};

window.recalcularValoresDerivados = function() {
    if(!window.fichaRascunho) return;
    
    const nivel = calcularNivelPorCasa(document.getElementById('forjaCasaLevel').value);
    const forca = parseInt(document.getElementById('attr_forca').value) || 0;
    const consti = parseInt(document.getElementById('attr_constituicao').value) || 0;
    
    // Atualiza Determinação
    const det = calcularModificador(forca) + calcularModificador(consti) + (nivel * 4);
    const detDisplay = document.getElementById('displayDeterminacao');
    if(detDisplay) detDisplay.innerText = det;

    // Atualiza a Vida Base automaticamente somando os valores brutos (Forca + Const)
    const vidaBaseNova = forca + consti;
    const inputVida = document.getElementById('forjaVida');
    if (inputVida) {
        inputVida.value = vidaBaseNova;
        window.fichaRascunho.vidaAtual = vidaBaseNova;
    }
};


function sincronizarInputsEtapa2() {
    if (!window.fichaRascunho) return;
    const f = window.fichaRascunho;

    const casaInput = document.getElementById('forjaCasaLevel');
    if (casaInput) f.casaLevel = casaInput.value;

    const tipoFuriaInput = document.getElementById('forjaModoFuriaTipo');
    if (tipoFuriaInput) f.modoFuriaTipo = tipoFuriaInput.value;
    
    const vidaInput = document.getElementById('forjaVida');
    if (vidaInput) f.vidaAtual = parseInt(vidaInput.value) || 0;

    ['forca', 'intelecto', 'constituicao', 'sabedoria', 'carisma', 'destreza'].forEach(attr => {
        const input = document.getElementById(`attr_${attr}`);
        if (input) {
            const val = parseInt(input.value) || 0;
            f.atributos[attr] = val;
        }
    });
}

window.voltarParaEtapa1 = function() {
    sincronizarInputsEtapa2();
    abrirForjaEtapa1(window.fichaRascunho); // Repassa o rascunho pra manter os dados
};

window.cancelarForja = function() {
    window.fichaRascunho = null;
    listarFichasSalvas();
};

window.salvarFichaFinal = function() {
    sincronizarInputsEtapa2();
    armazenarFichaNoBanco();
    
    // Alerta de sucesso ao salvar (Aba azul com estilo)
    let overlay = document.getElementById('successSaveFichaModal');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'successSaveFichaModal';
        overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(4px); z-index: 9999; display: flex; justify-content: center; align-items: center; transition: opacity 0.2s ease-in-out;";
        document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
        <div style="background: #020b14; border: 2px solid #00d9ff; padding: 35px; width: 85%; max-width: 420px; text-align: center; border-radius: 8px; box-shadow: 0 0 35px #00a2ff, inset 0 0 15px rgba(0, 217, 255, 0.2);">
            <h3 style="color: #00d9ff; font-size: 22px; margin-bottom: 15px; text-shadow: 0 0 10px #00a2ff;"><i class="fa-solid fa-bolt-lightning"></i> Registo Concluído</h3>
            <p style="color: #e1f5fe; font-size: 16px; margin-bottom: 25px; font-family: 'Marcellus', serif;">A ficha do seu herói foi guardada com sucesso nos pilares do Olimpo.</p>
            <button class="btn-gow" onclick="document.getElementById('successSaveFichaModal').remove()" style="background: #0088cc; border-color: #00d9ff;">Prosseguir</button>
        </div>
    `;

    cancelarForja();
};

function armazenarFichaNoBanco() {
    const chave = obterChaveFichas();
    const dadosBrutos = localStorage.getItem(chave);
    let fichas = dadosBrutos ? JSON.parse(dadosBrutos) : [];

    const idAlvo = window.fichaRascunho.id;
    const indexExistente = fichas.findIndex(item => item.id === idAlvo);

    if (indexExistente !== -1) {
        fichas[indexExistente] = window.fichaRascunho;
    } else {
        fichas.push(window.fichaRascunho);
    }

    localStorage.setItem(chave, JSON.stringify(fichas));
}


/* ==========================================================================
   VISUALIZAÇÃO COMPLETA DA FICHA (TAB DADOS, ATRIBUTOS, HABILIDADES)
   ========================================================================== */

window.abrirVisaoFichaCompleta = function(id) {
    const dadosBrutos = localStorage.getItem(obterChaveFichas());
    const fichas = dadosBrutos ? JSON.parse(dadosBrutos) : [];
    const ficha = fichas.find(f => f.id === id);
    if(!ficha) return;

    window.fichaVisualizacaoAtual = ficha; // Salva global pra acessar facilmente

    const container = document.getElementById('fichasConteudoDinamico');
    
    // Injeta a estrutura de visualização
    container.innerHTML = `
        <div style="background: #0a0a0a; border: 1px solid #333; border-radius: 6px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); overflow: hidden;">
            
            <div style="background: #111; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #8b0000;">
                <div style="display: flex; gap: 20px; align-items: center;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #8b0000; overflow: hidden; background: #000; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 15px rgba(139,0,0,0.5);">
                        <img src="${ficha.foto || 'https://i.imgur.com/v8bXN9s.png'}" style="width: 100%; height: 100%; object-fit: cover; transform: scale(${ficha.imgZoom || 1}) translate(${ficha.imgX || 0}px, ${ficha.imgY || 0}px);">
                    </div>
                    <div>
                        <h2 style="margin: 0; color: #fff; font-family: 'Cinzel', serif; font-size: 24px;">${ficha.nome}</h2>
                        <span style="color: #d4af37; font-style: italic; font-size: 14px;">${ficha.titulo || 'Sem Título'}</span>
                        <div style="margin-top: 8px;">
                            <span style="display: inline-block; background: #2a0808; color: #ff3333; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 3px; border: 1px solid #551111; text-transform: uppercase; font-family: 'Cinzel', serif;">${ficha.arquetipo}</span>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                     <button class="btn-gow btn-secondary" onclick="window.abrirForjaEtapa1(window.fichaVisualizacaoAtual)"><i class="fa-solid fa-pen"></i> Editar Info</button>
                     <button class="btn-gow" style="background: #333; border-color: #111;" onclick="listarFichasSalvas()"><i class="fa-solid fa-xmark"></i> Fechar</button>
                </div>
            </div>

            <div style="display: flex; background: #141414; border-bottom: 1px solid #222;">
                <button class="ficha-tab-btn active" onclick="trocarAbaFichaInterna('dados-pessoais', this)">Dados Pessoais</button>
                <button class="ficha-tab-btn" onclick="trocarAbaFichaInterna('atributos', this)">Atributos</button>
                <button class="ficha-tab-btn" onclick="trocarAbaFichaInterna('habilidades', this)">Habilidades</button>
            </div>

            <div style="padding: 25px;">
                
                <div id="tab-dados-pessoais" class="ficha-tab-content" style="display: block;">
                    ${renderTabDadosPessoais(ficha)}
                </div>

                <div id="tab-atributos" class="ficha-tab-content" style="display: none;">
                    ${renderTabAtributos(ficha)}
                </div>

                <div id="tab-habilidades" class="ficha-tab-content" style="display: none;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <h3 style="color: #fff; font-family: 'Cinzel', serif; font-size: 18px;">Poderes & Habilidades</h3>
                        <button class="btn-gow" onclick="criarHabilidade()"><i class="fa-solid fa-plus"></i> Nova Habilidade</button>
                    </div>
                    
                    <div id="containerHabilidadesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
                        ${renderHabilidades(ficha.habilidades)}
                    </div>
                </div>

            </div>
        </div>

        <style>
            .ficha-tab-btn {
                flex: 1; padding: 15px; background: transparent; border: none; color: #888; font-family: 'Cinzel', serif; font-weight: bold; font-size: 14px; cursor: pointer; text-transform: uppercase; transition: 0.3s;
                border-bottom: 3px solid transparent;
            }
            .ficha-tab-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
            .ficha-tab-btn.active { color: #d4af37; border-bottom-color: #8b0000; background: rgba(139,0,0,0.1); }
            
            .hab-card {
                background: #141414; border: 1px solid #333; padding: 20px; border-radius: 4px; display: flex; flex-direction: column; gap: 10px; position: relative; transition: transform 0.2s, box-shadow 0.2s;
            }
            .hab-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
            .hab-card input, .hab-card select, .hab-card textarea {
                background: #080808; border: 1px solid #222; color: #fff; padding: 8px; border-radius: 3px; font-family: 'Marcellus', serif; width: 100%;
            }
            .hab-card textarea { resize: vertical; min-height: 80px; }
            .dano-badge {
                background: #2a0808; border: 1px solid #551111; color: #ff3333; padding: 4px 8px; border-radius: 3px; font-weight: bold; cursor: pointer; display: inline-block; font-size: 12px; transition: 0.3s;
            }
            .dano-badge:hover { background: #551111; }
        </style>
    `;
};

window.trocarAbaFichaInterna = function(idAlvo, btn) {
    document.querySelectorAll('.ficha-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.querySelectorAll('.ficha-tab-content').forEach(c => c.style.display = 'none');
    document.getElementById('tab-' + idAlvo).style.display = 'block';
};

function renderTabDadosPessoais(ficha) {
    const mostraFuria = (ficha.arquetipo === "Deuses" || ficha.arquetipo === "Semi-Deuses");
    const nivel = calcularNivelPorCasa(ficha.casaLevel);
    const modForca = calcularModificador(ficha.atributos.forca);
    const modConst = calcularModificador(ficha.atributos.constituicao);
    const det = modForca + modConst + (nivel * 4);

    let html = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div>
                <h4 style="color: #666; font-family: 'Cinzel', serif; font-size: 12px; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">Vitalidade</h4>
                <div style="background: rgba(139,0,0,0.1); border: 1px solid #550000; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
                    <span style="color: #ff3333; font-weight: bold; font-size: 12px; display: block; margin-bottom: 5px;">VIDA (HP)</span>
                    <strong style="color: #fff; font-size: 24px; font-family: 'Cinzel', serif;">${ficha.vidaAtual}</strong>
                    <div style="width: 100%; height: 8px; background: #220000; border-radius: 4px; overflow: hidden; margin-top: 10px;">
                        <div style="width: 100%; height: 100%; background: linear-gradient(to right, #8b0000, #ff3333); box-shadow: 0 0 8px #ff0000;"></div>
                    </div>
                </div>
                
                <div style="background: rgba(0,0,139,0.1); border: 1px solid #000055; padding: 15px; border-radius: 4px;">
                    <span style="color: #3388ff; font-weight: bold; font-size: 12px; display: block; margin-bottom: 5px;">DETERMINAÇÃO (DET)</span>
                    <strong style="color: #fff; font-size: 24px; font-family: 'Cinzel', serif;">${det}</strong>
                </div>
            </div>

            <div>
                 <h4 style="color: #666; font-family: 'Cinzel', serif; font-size: 12px; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">Especial</h4>
                 ${mostraFuria ? `
                    <div style="background: #051a05; border: 1px solid #115511; padding: 15px; border-radius: 4px;">
                        <span style="color: #22ff22; font-weight: bold; font-size: 12px; display: block; margin-bottom: 5px;">FÚRIA: ${ficha.modoFuriaTipo}</span>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong style="color: #fff; font-size: 18px; font-family: 'Cinzel', serif;">${ficha.furiaPorcentagem}%</strong>
                        </div>
                        <div style="width: 100%; height: 8px; background: #000; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${ficha.furiaPorcentagem}%; height: 100%; background: linear-gradient(to right, #006600, #00ff00); box-shadow: 0 0 8px #00ff00;"></div>
                        </div>
                    </div>
                 ` : '<p style="color: #555; font-style: italic;">Este arquétipo não possui poderes fúria especiais.</p>'}
            </div>
        </div>
    `;
    return html;
}

function renderTabAtributos(ficha) {
    let html = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">`;
    
    ['forca', 'intelecto', 'constituicao', 'sabedoria', 'carisma', 'destreza'].forEach(attr => {
        const val = ficha.atributos[attr] || 0;
        const mod = calcularModificador(val);
        const modFormatado = (mod >= 0 ? '+' : '') + mod;
        const label = attr.charAt(0).toUpperCase() + attr.slice(1);

        html += `
            <div style="background: #111; border: 1px solid #222; padding: 15px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="display: block; color: #888; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">${label}</span>
                    <strong style="color: #fff; font-size: 20px; font-family: 'Cinzel', serif;">${val}</strong>
                </div>
                <div style="text-align: right;">
                    <span style="display: block; color: #777; font-size: 10px; margin-bottom: 4px;">MODIFICADOR</span>
                    <strong style="color: #ff3333; font-size: 18px; font-family: 'Cinzel', serif;">${modFormatado}</strong>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    return html;
}

/* ==========================================================================
   SISTEMA DE HABILIDADES
   ========================================================================== */

function renderHabilidades(habilidadesArray) {
    if(!habilidadesArray || habilidadesArray.length === 0) {
        return `<p style="color: #555; grid-column: 1 / -1; text-align: center; font-style: italic; padding: 20px;">Nenhuma habilidade registrada.</p>`;
    }

    let html = '';
    habilidadesArray.forEach((hab, index) => {
        const danoValue = hab.dano || '1d10';
        html += `
            <div class="hab-card" id="hab_card_${index}">
                <div style="display: flex; justify-content: space-between;">
                    <input type="text" value="${hab.nome || ''}" placeholder="Nome da Habilidade" onchange="atualizarHab(${index}, 'nome', this.value)" style="font-family: 'Cinzel', serif; font-size: 16px; color: #d4af37; font-weight: bold; width: 70%; background: transparent !important; border: none !important; border-bottom: 1px solid rgba(255,255,255,0.2) !important;">
                    <input type="number" value="${hab.level || 1}" placeholder="Lvl" title="Level" onchange="atualizarHab(${index}, 'level', this.value)" style="width: 25%; text-align: center; background: transparent !important; border: none !important; border-bottom: 1px solid rgba(255,255,255,0.2) !important; font-family: 'Cinzel', serif; color: #d4af37;">
                </div>

                <select onchange="atualizarHab(${index}, 'controle', this.value)" style="background: transparent !important; border: none !important; border-bottom: 1px solid rgba(255,255,255,0.2) !important; color: #888;">
                    <option value="Pequeno" ${hab.controle === 'Pequeno' ? 'selected' : ''}>Controle: Pequeno</option>
                    <option value="Médio" ${hab.controle === 'Médio' ? 'selected' : ''}>Controle: Médio</option>
                    <option value="Bom" ${hab.controle === 'Bom' ? 'selected' : ''}>Controle: Bom</option>
                    <option value="Absoluto" ${hab.controle === 'Absoluto' ? 'selected' : ''}>Controle: Absoluto</option>
                </select>

                <div style="display: flex; align-items: center; gap: 10px; background: #080808; padding: 8px; border: 1px solid #222; border-radius: 3px;">
                    <span style="color: #888; font-size: 12px; width: 40px;">Dano:</span>
                    
                    <div id="dano_display_area_${index}" style="flex: 1; display: flex; align-items: center; gap: 5px;">
                        <span class="dano-badge" onclick="rolarDanoHabilidade('${danoValue}', '${hab.nome}')"><i class="fa-solid fa-dice-d20"></i> ${danoValue}</span>
                    </div>

                    <div id="dano_edit_area_${index}" style="display: none; flex: 1;">
                        <input type="text" value="${danoValue}" id="input_dano_${index}" style="width: 100%;">
                    </div>

                    <button class="btn-gow btn-secondary" style="padding: 4px 8px; font-size: 10px; margin: 0;" onclick="toggleEditarDano(${index})"><i class="fa-solid fa-pen"></i> Editar</button>
                </div>

                <textarea placeholder="Descrição da habilidade..." onchange="atualizarHab(${index}, 'descricao', this.value)" style="background: transparent !important; border: none !important; color: #fff !important;">${hab.descricao || ''}</textarea>

                <button class="btn-gow" style="background: transparent; color: #ff3333; border: 1px solid #ff3333; padding: 5px; font-size: 11px; margin-top: auto; transition: 0.3s;" onmouseover="this.style.background='#550000'" onmouseout="this.style.background='transparent'" onclick="apagarHabilidade(${index})"><i class="fa-solid fa-trash"></i> Apagar Habilidade</button>
            </div>
        `;
    });
    return html;
}

window.criarHabilidade = function() {
    if(!window.fichaVisualizacaoAtual.habilidades) {
        window.fichaVisualizacaoAtual.habilidades = [];
    }
    window.fichaVisualizacaoAtual.habilidades.push({
        nome: 'Nova Habilidade',
        level: 1,
        controle: 'Pequeno',
        dano: '1d10',
        descricao: ''
    });
    salvarFichaGlobalmenteEAtualizar();
};

window.apagarHabilidade = function(index) {
    if(confirm("Apagar esta habilidade?")) {
        window.fichaVisualizacaoAtual.habilidades.splice(index, 1);
        salvarFichaGlobalmenteEAtualizar();
    }
};

window.atualizarHab = function(index, campo, valor) {
    window.fichaVisualizacaoAtual.habilidades[index][campo] = valor;
    salvarFichaGlobalmenteEAtualizar();
};

window.toggleEditarDano = function(index) {
    const displayArea = document.getElementById(`dano_display_area_${index}`);
    const editArea = document.getElementById(`dano_edit_area_${index}`);
    const input = document.getElementById(`input_dano_${index}`);
    const btn = document.querySelector(`#hab_card_${index} .btn-secondary i`);

    if (displayArea.style.display === 'none') {
        // Estava editando, salvar
        displayArea.style.display = 'flex';
        editArea.style.display = 'none';
        btn.className = "fa-solid fa-pen";
        atualizarHab(index, 'dano', input.value);
    } else {
        // Entrar em modo de edição
        displayArea.style.display = 'none';
        editArea.style.display = 'flex';
        btn.className = "fa-solid fa-check";
        input.focus();
    }
}

function salvarFichaGlobalmenteEAtualizar() {
    // Atualiza no banco principal
    const chave = obterChaveFichas();
    const dadosBrutos = localStorage.getItem(chave);
    let fichas = dadosBrutos ? JSON.parse(dadosBrutos) : [];
    
    const index = fichas.findIndex(f => f.id === window.fichaVisualizacaoAtual.id);
    if(index !== -1) {
        fichas[index] = window.fichaVisualizacaoAtual;
        localStorage.setItem(chave, JSON.stringify(fichas));
    }

    // Re-renderiza a grid de habilidades
    const container = document.getElementById('containerHabilidadesGrid');
    if(container) {
        container.innerHTML = renderHabilidades(window.fichaVisualizacaoAtual.habilidades);
    }
}

/* ==========================================================================
   SISTEMA DE ROLAGEM DE DADOS NA TELA
   ========================================================================== */

window.rolarDanoHabilidade = function(expressaoDano, nomeHabilidade) {
    // Parse da expressão Ex: 3d10
    const expressaoLimpa = expressaoDano.toLowerCase().trim();
    const partes = expressaoLimpa.split('d');
    
    if(partes.length !== 2) {
        alert("Formato de dano inválido. Use algo como '1d10' ou '3d6'.");
        return;
    }

    const quantidade = parseInt(partes[0]);
    const faces = parseInt(partes[1]);

    if(isNaN(quantidade) || isNaN(faces) || quantidade < 1 || faces <= 2) {
        alert("Valores inválidos. A quantidade deve ser >= 1 e as faces > 2.");
        return;
    }

    let soma = 0;
    let resultados = [];

    for(let i=0; i < quantidade; i++) {
        const roleta = Math.floor(Math.random() * faces) + 1;
        soma += roleta;
        resultados.push(roleta);
    }

    mostrarResultadoDadoNaTela(nomeHabilidade, soma, resultados, expressaoLimpa);
};

function mostrarResultadoDadoNaTela(titulo, total, rolagens, expressao) {
    // Cria um overlay centralizado para exibir o resultado em verde
    let divOverlay = document.getElementById('rolagemDanoOverlay');
    if (!divOverlay) {
        divOverlay = document.createElement('div');
        divOverlay.id = 'rolagemDanoOverlay';
        divOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.85); z-index: 9999; display: flex; justify-content: center; align-items: center;
            backdrop-filter: blur(4px); opacity: 0; transition: opacity 0.3s;
        `;
        document.body.appendChild(divOverlay);
    }

    const strRolagens = rolagens.join(" + ");

    divOverlay.innerHTML = `
        <div style="background: #051a05; border: 2px solid #00ff00; padding: 40px; border-radius: 8px; text-align: center; box-shadow: 0 0 40px rgba(0,255,0,0.3); transform: scale(0.8); transition: transform 0.3s; max-width: 400px; width: 90%;">
            <h3 style="color: #22ff22; font-family: 'Cinzel', serif; font-size: 20px; margin-bottom: 10px; text-transform: uppercase;">${titulo || 'Rolagem de Dano'}</h3>
            <p style="color: #aaa; font-size: 14px; margin-bottom: 20px;">Rolando ${expressao}</p>
            
            <div style="font-size: 64px; color: #fff; font-family: 'Cinzel', serif; font-weight: bold; text-shadow: 0 0 20px #00ff00; margin-bottom: 15px;">
                ${total}
            </div>
            
            <p style="color: #888; font-size: 16px; font-style: italic; margin-bottom: 30px;">[ ${strRolagens} ]</p>
            
            <button class="btn-gow" style="background: #004400; border-color: #006600; padding: 10px 30px; font-size: 16px;" onclick="fecharResultadoDado()">Continuar</button>
        </div>
    `;

    divOverlay.style.display = 'flex';
    setTimeout(() => {
        divOverlay.style.opacity = '1';
        divOverlay.children[0].style.transform = 'scale(1)';
    }, 20);
}

window.fecharResultadoDado = function() {
    const divOverlay = document.getElementById('rolagemDanoOverlay');
    if (divOverlay) {
        divOverlay.style.opacity = '0';
        divOverlay.children[0].style.transform = 'scale(0.8)';
        setTimeout(() => {
            divOverlay.style.display = 'none';
        }, 300);
    }
}