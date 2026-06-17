/* ==========================================================================
   MÓDULO: emendas.js (Forçador de Cliques, Correção de Escopo & Remendos Críticos)
   ========================================================================== */

console.log("⚡ [Bifrost] Emendas mágicas v3.2 ativadas. Corrigindo fluxos, dados e botões...");

// 1. GARANTIR QUE AS FUNÇÕES CRÍTICAS DO INDEX ESTÃO NO ESCOPO GLOBAL
document.addEventListener("DOMContentLoaded", () => {
    if (typeof showAuth === "function") window.showAuth = showAuth;
    if (typeof handleAuth === "function") window.handleAuth = handleAuth;
    if (typeof enterDashboard === "function") window.enterDashboard = enterDashboard;
    if (typeof logout === "function") window.logout = logout;
    if (typeof switchSection === "function") window.switchSection = switchSection;
    
    if (typeof addNote === "function") window.addNote = addNote;
    if (typeof toggleDeleteMode === "function") window.toggleDeleteMode = toggleDeleteMode;
    if (typeof closeNoteModal === "function") window.closeNoteModal = closeNoteModal;
    if (typeof updateLiveNoteText === "function") window.updateLiveNoteText = updateLiveNoteText;
    if (typeof changeActiveModalColor === "function") window.changeActiveModalColor = changeActiveModalColor;
    if (typeof closeConfirmDeleteModal === "function") window.closeConfirmDeleteModal = closeConfirmDeleteModal;
    if (typeof toggleAccordion === "function") window.toggleAccordion = toggleAccordion;
    if (typeof triggerZeusModal === "function") window.triggerZeusModal = triggerZeusModal;
    if (typeof closeZeusAlert === "function") window.closeZeusAlert = closeZeusAlert;
    
    // Injeta suporte para fechar popups com ESC
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (typeof window.closeZeusAlert === "function") {
                event.preventDefault();
                window.closeZeusAlert();
            }
        }
    });
});

// 2. CORREÇÃO DO FLUXO DOS DADOS (BOTÃO CONTINUAR)
// Garante que ao clicar em "Continuar" após uma rolagem de dados, tudo volte ao normal
window.fecharModalDadosEContinuar = function() {
    console.log("🎲 [Bifrost] Limpando modal de dados e restaurando fluxo.");
    
    // Procura por overlays de dados, resultados ou overlays genéricos gerados pelos dados e remove-os
    const overlaysDados = document.querySelectorAll("[id*='modalDados'], [id*='Resultado'], .modal-dados-overlay, #painelDadosOverlay, .zeus-alert-overlay");
    overlaysDados.forEach(overlay => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 150);
    });

    // Se o zeusAlert do index principal estiver aberto, fecha ele nativamente
    if (typeof window.closeZeusAlert === "function") {
        window.closeZeusAlert();
    }
};

// 3. SEGUNDA LINHA DE DEFESA: OBSERVADOR DE MUTAÇÃO (MUTATION OBSERVER)
// Monitora a DOM dinamicamente para consertar escopos, re-injetar o botão de apagar e corrigir eventos
const observer = new MutationObserver(() => {
    
    // A) GARANTE O BOTÃO DE APAGAR ARQUÉTIPO/FICHA NA INTERFACE
    // Se o container de cabeçalho das fichas existir e não tiver o botão de exclusão, nós injetamos ele!
    const fichasHeader = document.querySelector("#fichas > div[style*='display: flex']");
    if (fichasHeader && !document.getElementById("btnInjetadoApagarFicha")) {
        const btnApagar = document.createElement("button");
        btnApagar.id = "btnInjetadoApagarFicha";
        btnApagar.className = "btn-gow btn-secondary";
        btnApagar.style.borderColor = "#8b0000";
        btnApagar.innerHTML = `<i class="fa-solid fa-trash-can" style="color: #ff3333;"></i> Apagar Arquétipo`;
        
        // Atribui a função de exclusão (seja o painel nativo ou o direto)
        btnApagar.addEventListener("click", (e) => {
            e.preventDefault();
            if (typeof window.abrirPainelExclusaoEmenda === "function") {
                window.abrirPainelExclusaoEmenda();
            } else if (typeof window.listarFichasParaDeletar === "function") {
                window.listarFichasParaDeletar();
            } else {
                console.warn("⚠️ Nenhuma função de exclusão de fichas foi encontrada no escopo.");
            }
        });
        fichasHeader.appendChild(btnApagar);
    }

    // B) CORREÇÃO AUTOMÁTICA DE BOTÕES DINÂMICOS DAS FICHAS (Prevenindo quebra de escopo)
    const btnCriar = document.querySelector("button[onclick*='criarNovaFichaForm']");
    if (btnCriar && !btnCriar.dataset.bound) {
        btnCriar.dataset.bound = "true";
        btnCriar.addEventListener("click", (e) => { e.preventDefault(); if(typeof window.criarNovaFichaForm === "function") window.criarNovaFichaForm(); });
    }

    const btnListar = document.querySelector("button[onclick*='listarFichasSalvas']");
    if (btnListar && !btnListar.dataset.bound) {
        btnListar.dataset.bound = "true";
        btnListar.addEventListener("click", (e) => { e.preventDefault(); if(typeof window.listarFichasSalvas === "function") window.listarFichasSalvas(); });
    }
    
    const btnGravar = document.querySelector("button[onclick*='salvarFichaDados']");
    if (btnGravar && !btnGravar.dataset.bound) {
        btnGravar.dataset.bound = "true";
        btnGravar.addEventListener("click", (e) => { e.preventDefault(); if(typeof window.salvarFichaDados === "function") window.salvarFichaDados(); });
    }

    // C) CORREÇÃO DO BOTÃO "CONTINUAR" NOS MODAIS DE ROLAGEM DINÂMICOS
    const botoesContinuarDados = document.querySelectorAll("button[onclick*='remove']");
    botoesContinuarDados.forEach(btn => {
        if ((btn.textContent.toLowerCase().includes("continuar") || btn.textContent.toLowerCase().includes("recuar")) && !btn.dataset.dadosBound) {
            btn.dataset.dadosBound = "true";
            btn.removeAttribute("onclick"); // Remove o inline antigo perigoso
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                window.fecharModalDadosEContinuar();
            });
        }
    });
});

// Ativa o observador na página inteira
observer.observe(document.body, { childList: true, subtree: true });