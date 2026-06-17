/* ==========================================================================
   ARQUITETURA DE SOFTWARE AVANÇADA: fichas3.js (Módulo de Forja Inabalável)
   ========================================================================== */

console.log("⚔️ [Forja de Ares] Ativando protocolo de engenharia reversa e blindagem de abas...");

/**
 * MÁQUINA DE ESTADO GLOBAL E IMUTÁVEL DO FORMULÁRIO DE RPG
 * Centraliza e blinda todas as propriedades mutáveis da ficha ativa durante o fluxo de criação/edição.
 */
if (!window.g_estadoForjaGow) {
    window.g_estadoForjaGow = {
        etapaAtiva: 1, // 1: Linhagem/Dados Iniciais | 2: Atributos Divinos & Bênçãos
        idUnico: "",
        dadosCadastrais: {
            nome: "",
            classe: "",
            raca: "",
            furia: "0"
        },
        fotoBase64: "",
        atributosDivinos: {
            "Força": 0,
            "Intelecto": 0,
            "Sabedoria": 0,
            "Destreza": 0,
            "Constituição": 0,
            "Carisma": 0
        },
        metadata: {
            criadoEm: null,
            ultimaModificacao: null
        }
    };
}

// Configurações e Parâmetros Mecânicos do Panteão
const TOTAL_PONTOS_PANTEAO_MAX = 15;
const LIMITE_SUPERIOR_ATRIBUTO = 30;
const LIMITE_INFERIOR_ATRIBUTO = -15;

/**
 * ALGORITMO DE CÁLCULO DE MODIFICADORES RE-PROJETADO
 * Transforma valores absolutos de atributos nas métricas de dados do sistema GoW.
 */
window.calcularModificadorGoW = function(valorAtributo) {
    const valorInteiro = parseInt(valorAtributo) || 0;
    
    // Regra Rígida do Grimório do RPG:
    // Valor <= -10 -> Modificador -2
    // Valor <= -5  -> Modificador -1
    // Valor >= 10  -> Modificador +2
    // Valor >= 5   -> Modificador +1
    // Caso contrário -> Modificador 0
    if (valorInteiro <= -10) return "-2";
    if (valorInteiro <= -5)  return "-1";
    if (valorInteiro >= 10)  return "+2";
    if (valorInteiro >= 5)   return "+1";
    return "0";
};

/**
 * PONTO DE ENTRADA DO PROJETO (Compatibilidade Absoluta com emendas.js)
 * Esta função age como um despachante inteligente. Quando o emendas.js intercepta o DOM
 * e força a execução desta função sem argumentos, ela NÃO apaga o formulário. Ela lê a
 * máquina de estado e mantém o utilizador exatamente na aba onde ele estava.
 */
window.criarNovaFichaForm = function(dadosExternosEdicao = null) {
    console.log(`🛡️ [Protocolo Forja] Função principal invocada. Estado da Aba: ${window.g_estadoForjaGow.etapaAtiva}`);
    
    const containerAlvoDinamico = document.getElementById('fichasConteudoDinamico');
    if (!containerAlvoDinamico) {
        console.error("❌ Erro Crítico: O elemento de ancoragem '#fichasConteudoDinamico' sumiu do DOM.");
        return;
    }

    // CAPTURA DE FLUXO DE EDIÇÃO (Caso seja clicado o botão de editar de uma ficha salva)
    if (dadosExternosEdicao && window.g_estadoForjaGow.idUnico !== dadosExternosEdicao.id) {
        console.log("📝 Acionando modo de edição para ficha existente: ID " + dadosExternosEdicao.id);
        
        window.g_estadoForjaGow.idUnico = dadosExternosEdicao.id || 'heroi_' + Date.now();
        window.g_estadoForjaGow.etapaAtiva = 1; // Força início na aba 1 ao carregar de fora
        
        window.g_estadoForjaGow.dadosCadastrais = {
            nome: dadosExternosEdicao.nome || "",
            classe: dadosExternosEdicao.classe || "",
            raca: dadosExternosEdicao.raca || "",
            furia: dadosExternosEdicao.furia || "0"
        };
        
        window.g_estadoForjaGow.fotoBase64 = dadosExternosEdicao.foto || "";
        
        if (dadosExternosEdicao.atributos) {
            window.g_estadoForjaGow.atributosDivinos = { ...dadosExternosEdicao.atributos };
        } else {
            window.g_estadoForjaGow.atributosDivinos = { "Força": 0, "Intelecto": 0, "Sabedoria": 0, "Destreza": 0, "Constituição": 0, "Carisma": 0 };
        }
    } 
    // FLUXO DE CRIAÇÃO LIMPA (Gera uma nova identidade estável apenas se não houver nenhuma ativa)
    else if (!dadosExternosEdicao && (!window.g_estadoForjaGow.idUnico || window.g_estadoForjaGow.idUnico === "")) {
        console.log("✨ Gerando nova identidade de Semideus na máquina de estado volátil...");
        window.g_estadoForjaGow.idUnico = 'heroi_' + Date.now();
        window.g_estadoForjaGow.etapaAtiva = 1;
        window.g_estadoForjaGow.dadosCadastrais = { nome: "", classe: "", raca: "", furia: "0" };
        window.g_estadoForjaGow.fotoBase64 = "";
        window.g_estadoForjaGow.atributosDivinos = { "Força": 0, "Intelecto": 0, "Sabedoria": 0, "Destreza": 0, "Constituição": 0, "Carisma": 0 };
    }

    // DESPACHO CIRÚRGICO DE ACORDO COM O ESTADO ATIVO CONTRA INTERCEPTADORES
    if (window.g_estadoForjaGow.etapaAtiva === 2) {
        renderizarModuloAbaDoisAtributos(containerAlvoDinamico);
    } else {
        renderizarModuloAbaUmDadosBasicos(containerAlvoDinamico);
    }
};

/* ==========================================================================
   RENDERIZADOR MASSIVO: ABA 1 - DADOS DE IDENTIDADE E LINHAGEM
   ========================================================================== */
function renderizarModuloAbaUmDadosBasicos(container) {
    console.log("🎨 Renderizando painel visual da Etapa 1.");
    
    // Sincroniza em tempo real com dados guardados se o DOM for reconstruído em segundo plano
    const cadastro = window.g_estadoForjaGow.dadosCadastrais;
    const previewImagemSrc = window.g_estadoForjaGow.fotoBase64 || 'https://via.placeholder.com/150';

    container.innerHTML = `
        <div class="painel-forja-container" style="background: #0f0f0f; border: 1px solid #333; padding: 35px; border-radius: 4px; box-shadow: 0 20px 45px rgba(0,0,0,0.85); animation: animacaoGowFadeIn 0.35s ease-out;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #222; padding-bottom: 20px;">
                <div>
                    <h3 style="font-family: 'Cinzel', serif; color: #d4af37; font-size: 22px; margin: 0; letter-spacing: 1px; text-transform: uppercase;">
                        <i class="fa-solid fa-scroll" style="color: #8b0000; margin-right: 10px;"></i> Registro de Linhagem
                    </h3>
                    <p style="color: #777; font-size: 12px; margin: 6px 0 0 0; font-family: 'Marcellus', serif; letter-spacing: 0.5px;">Forje os alicerces biográficos e identitários do herói.</p>
                </div>
                <div style="text-align: right;">
                    <span style="font-family: 'Cinzel', serif; font-size: 11px; background: #1a0000; border: 1px solid #8b0000; padding: 5px 12px; color: #ff3333; font-weight: bold; letter-spacing: 1.5px; border-radius: 2px; text-transform: uppercase;">
                        Passo 1 de 2
                    </span>
                    <div style="width: 100px; height: 3px; background: #222; margin-top: 8px; border-radius: 2px; overflow: hidden;">
                        <div style="width: 50%; height: 100%; background: #8b0000;"></div>
                    </div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; background: #070707; padding: 25px; border: 1px solid #1a1a1a; border-radius: 4px; box-shadow: inset 0 0 20px rgba(0,0,0,0.8);">
                <div class="zona-foto-circular" id="caixaMolduraFotoPreview" style="width: 115px; height: 115px; border: 2px solid #d4af37; border-radius: 50%; overflow: hidden; box-shadow: 0 0 20px rgba(212,175,55,0.15); background: #000; margin-bottom: 15px; position: relative;">
                    <img id="elementoImgPreviewGow" src="${previewImagemSrc}" alt="Avatar do Guerreiro" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s;">
                </div>
                <button type="button" class="btn-gow btn-secondary" onclick="document.getElementById('uploadFileFichaOlimpo').click()" style="padding: 7px 16px; font-size: 11px; font-family: 'Cinzel', serif; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                    <i class="fa-solid fa-image" style="color: #d4af37;"></i> Escolher Retrato Divino
                </button>
                <input type="file" id="uploadFileFichaOlimpo" style="display: none;" accept="image/*" onchange="window.processarCompressaoFotoBase64(this)">
                <span style="color: #444; font-size: 10px; margin-top: 8px; font-family: 'Marcellus', serif;">Formatos aceites: PNG, JPG, WEBP</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 20px;">
                <div>
                    <label style="display: block; margin-bottom: 8px; font-family: 'Cinzel', serif; font-size: 12px; color: #b5b5b5; letter-spacing: 0.5px; text-transform: uppercase;">Nome do Semideus ou Criatura <span style="color: #8b0000;">*</span></label>
                    <input type="text" id="campoTextoNomeGow" value="${cadastro.nome}" placeholder="Introduza a alcunha imortal do herói..." style="width: 100%; padding: 14px; background: #000; border: 1px solid #282828; color: #fff; font-family: 'Marcellus', serif; border-radius: 3px; box-sizing: border-box; font-size: 14px; transition: border-color 0.3s;" oninput="window.g_estadoForjaGow.dadosCadastrais.nome = this.value">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-family: 'Cinzel', serif; font-size: 12px; color: #b5b5b5; text-transform: uppercase;">Casta / Classe de Combate</label>
                        <input type="text" id="campoTextoClasseGow" value="${cadastro.classe}" placeholder="Ex: Guerreiro, Feiticeiro" style="width: 100%; padding: 14px; background: #000; border: 1px solid #282828; color: #fff; font-family: 'Marcellus', serif; border-radius: 3px; box-sizing: border-box; font-size: 14px;" oninput="window.g_estadoForjaGow.dadosCadastrais.classe = this.value">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-family: 'Cinzel', serif; font-size: 12px; color: #b5b5b5; text-transform: uppercase;">Panteão de Origem / Raça</label>
                        <input type="text" id="campoTextoRacaGow" value="${cadastro.raca}" placeholder="Ex: Espartano, Atlante" style="width: 100%; padding: 14px; background: #000; border: 1px solid #282828; color: #fff; font-family: 'Marcellus', serif; border-radius: 3px; box-sizing: border-box; font-size: 14px;" oninput="window.g_estadoForjaGow.dadosCadastrais.raca = this.value">
                    </div>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 8px; font-family: 'Cinzel', serif; font-size: 12px; color: #b5b5b5; text-transform: uppercase;">Métrica de Fúria Inicial</label>
                    <input type="number" id="campoNumeroFuriaGow" value="${cadastro.furia}" style="width: 100%; padding: 14px; background: #000; border: 1px solid #282828; color: #fff; font-family: 'Marcellus', serif; border-radius: 3px; box-sizing: border-box; font-size: 14px;" oninput="window.g_estadoForjaGow.dadosCadastrais.furia = this.value">
                </div>
            </div>

            <div style="margin-top: 40px; border-top: 1px solid #222; padding-top: 25px; display: flex; justify-content: space-between; align-items: center;">
                <button type="button" class="btn-gow btn-secondary" onclick="window.listarFichasSalvas()" style="font-family: 'Cinzel', serif; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;"><i class="fa-solid fa-ban"></i> Abortar</button>
                <button type="button" class="btn-gow" onclick="window.interceptarEAvancarParaAbaDois(event)" style="background: linear-gradient(135deg, #8b0000, #5a0000); border-color: #400000; font-family: 'Cinzel', serif; font-size: 12px; box-shadow: 0 5px 20px rgba(139,0,0,0.35); margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                    Distribuir Atributos <i class="fa-solid fa-arrow-right" style="margin-left: 8px; font-size: 11px;"></i>
                </button>
            </div>
        </div>
    `;
}

/* ==========================================================================
   RENDERIZADOR MASSIVO: ABA 2 - SISTEMA MATEMÁTICO DE ATRIBUTOS DIVINOS
   ========================================================================== */
function renderizarModuloAbaDoisAtributos(container) {
    console.log("🎨 Renderizando painel de alocação da Etapa 2.");

    const somaAtualAtributos = somarPontosAtributosAtuais();
    const pontosRestantesCalculados = TOTAL_PONTOS_PANTEAO_MAX - somaAtualAtributos;

    let htmlGeradoCardsAtributos = "";
    const arrayOrdemAtributos = ["Força", "Intelecto", "Sabedoria", "Destreza", "Constituição", "Carisma"];

    // Geração algorítmica e renderização estilizada de cada bloco de atributo
    arrayOrdemAtributos.forEach(nomeAtributo => {
        const valorDoAtributo = window.g_estadoForjaGow.atributosDivinos[nomeAtributo] || 0;
        const modificadorComputado = window.calcularModificadorGoW(valorDoAtributo);
        
        // Feedbacks visuais cromáticos e de luminescência em tempo real baseados na regra de RPG
        let corDeExibicaoModificador = "#777";
        let filtroSombraGlow = "none";
        if (parseInt(modificadorComputado) > 0) {
            corDeExibicaoModificador = "#00d9ff";
            filtroSombraGlow = "0 0 10px rgba(0,217,255,0.25)";
        } else if (parseInt(modificadorComputado) < 0) {
            corDeExibicaoModificador = "#ff3333";
            filtroSombraGlow = "0 0 10px rgba(255,51,51,0.25)";
        }

        htmlGeradoCardsAtributos += `
            <div style="background: #060606; border: 1px solid #1c1c1c; padding: 18px 24px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; box-shadow: inset 0 0 20px rgba(0,0,0,0.7); margin-bottom: 4px;">
                
                <div style="flex: 1;">
                    <div style="font-family: 'Cinzel', serif; font-size: 16px; color: #fff; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase;">${nomeAtributo}</div>
                    <div style="font-size: 11px; color: #999; font-family: 'Marcellus', serif; margin-top: 5px;">
                        Modificador de Combate: <span style="color: ${corDeExibicaoModificador}; font-weight: bold; font-family: 'Cinzel', serif; font-size: 14px; text-shadow: ${filtroSombraGlow};">${modificadorComputado}</span>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button type="button" class="btn-gow btn-secondary" onclick="window.operarCalculoAtributoFicha('${nomeAtributo}', -5, event)" style="margin:0; padding: 6px 12px; font-size: 11px; font-weight: bold; font-family: 'Cinzel', serif; border-color: #252525;">-5</button>
                    <button type="button" class="btn-gow btn-secondary" onclick="window.operarCalculoAtributoFicha('${nomeAtributo}', -1, event)" style="margin:0; padding: 6px 12px; font-size: 11px; font-weight: bold; font-family: 'Cinzel', serif; border-color: #252525;">-1</button>
                    
                    <span style="font-family: 'Cinzel', serif; font-size: 19px; color: #d4af37; font-weight: bold; width: 55px; text-align: center; display: inline-block; background: #000; border: 1px solid #1c1c1c; padding: 5px 0; border-radius: 2px; box-shadow: inset 0 0 5px rgba(212,175,55,0.1);">
                        ${valorDoAtributo >= 0 ? '+' + valorDoAtributo : valorDoAtributo}
                    </span>
                    
                    <button type="button" class="btn-gow" onclick="window.operarCalculoAtributoFicha('${nomeAtributo}', 1, event)" style="margin:0; padding: 6px 12px; font-size: 11px; font-weight: bold; font-family: 'Cinzel', serif; background: #3d0000; border-color: #260000;">+1</button>
                    <button type="button" class="btn-gow" onclick="window.operarCalculoAtributoFicha('${nomeAtributo}', 5, event)" style="margin:0; padding: 6px 12px; font-size: 11px; font-weight: bold; font-family: 'Cinzel', serif; background: #730000; border-color: #4a0000;">+5</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="painel-forja-container" style="background: #0f0f0f; border: 1px solid #333; padding: 35px; border-radius: 4px; box-shadow: 0 20px 45px rgba(0,0,0,0.85); animation: animacaoGowFadeIn 0.35s ease-out;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <h3 style="font-family: 'Cinzel', serif; color: #d4af37; font-size: 22px; margin: 0; letter-spacing: 1px; text-transform: uppercase;">
                    <i class="fa-solid fa-gavel" style="color: #8b0000; margin-right: 10px;"></i> Distribuição de Atributos
                </h3>
                <div style="text-align: right;">
                    <span style="font-family: 'Cinzel', serif; font-size: 11px; background: #1a0000; border: 1px solid #8b0000; padding: 5px 12px; color: #ff3333; font-weight: bold; letter-spacing: 1.5px; border-radius: 2px; text-transform: uppercase;">
                        Passo 2 de 2
                    </span>
                    <div style="width: 100px; height: 3px; background: #222; margin-top: 8px; border-radius: 2px; overflow: hidden;">
                        <div style="width: 100%; height: 100%; background: #00d9ff;"></div>
                    </div>
                </div>
            </div>
            <p style="color: #777; font-size: 13px; margin: 0 0 25px 0; font-family: 'Marcellus', serif; letter-spacing: 0.5px;">Aloque os pontos de poder concedidos pelas divindades do panteão.</p>

            <div style="background: #111; border-left: 4px solid #8b0000; border-right: 4px solid #8b0000; border-top: 1px solid #222; border-bottom: 1px solid #222; padding: 18px; border-radius: 4px; text-align: center; margin-bottom: 25px; box-shadow: 0 6px 20px rgba(0,0,0,0.65);">
                <div style="font-family: 'Cinzel', serif; font-size: 11px; color: #aaa; letter-spacing: 2px; text-transform: uppercase;">Essência Divina Restante</div>
                <div id="marcadorEssenciaDisponivel" style="font-family: 'Cinzel', serif; font-size: 34px; color: ${pontosRestantesCalculados >= 0 ? '#00d9ff' : '#ff3333'}; font-weight: bold; text-shadow: ${pontosRestantesCalculados >= 0 ? '0 0 12px rgba(0,217,255,0.45)' : '0 0 12px rgba(255,51,51,0.45)'}; margin-top: 5px;">
                    ${pontosRestantesCalculados}
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${htmlGeradoCardsAtributos}
            </div>

            <div style="margin-top: 40px; border-top: 1px solid #222; padding-top: 25px; display: flex; justify-content: space-between; align-items: center;">
                <button type="button" class="btn-gow btn-secondary" onclick="window.retrocederParaAbaUmDadosBasicos(event)" style="font-family: 'Cinzel', serif; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                    <i class="fa-solid fa-arrow-left" style="margin-right: 8px;"></i> Editar Linhagem
                </button>
                <button type="button" class="btn-gow" onclick="window.consolidarEGravarFichaNoArmazenamento(event)" style="background: linear-gradient(135deg, #005a8d, #008be2); border-color: #004b77; font-family: 'Cinzel', serif; font-size: 12px; box-shadow: 0 5px 20px rgba(0,139,226,0.35); margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                    <i class="fa-solid fa-floppy-disk" style="margin-right: 8px;"></i> Consolidar na História
                </button>
            </div>
        </div>
    `;
}

/* ==========================================================================
   MÓDULOS DE INTERCEPTAÇÃO, FLUXO DE ABAS E OPERAÇÕES MATEMÁTICAS
   ========================================================================== */

/**
 * Valida os dados da Etapa 1 e força a transição para a Etapa 2.
 * Crucial: Intercepta o evento e anula bolhas para que o emendas.js não reinicie o ecrã.
 */
window.interceptarEAvancarParaAbaDois = function(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const inputNomeElement = document.getElementById('campoTextoNomeGow');
    const valorNomeHigienizado = inputNomeElement ? inputNomeElement.value.trim() : "";

    if (!valorNomeHigienizado) {
        if (typeof window.triggerZeusModal === "function") {
            window.triggerZeusModal("Alerta do Olimpo", "O pergaminho não aceita heróis sem nome! Insira uma alcunha válida.", "Compreendido", "#8b0000");
        } else {
            alert("Erro: O preenchimento do Nome do Herói é obrigatório!");
        }
        return;
    }

    // Grava as informações capturadas no estado central estável antes de virar a página
    window.g_estadoForjaGow.dadosCadastrais.nome = valorNomeHigienizado;
    window.g_estadoForjaGow.dadosCadastrais.classe = document.getElementById('campoTextoClasseGow') ? document.getElementById('campoTextoClasseGow').value.trim() : "";
    window.g_estadoForjaGow.dadosCadastrais.raca = document.getElementById('campoTextoRacaGow') ? document.getElementById('campoTextoRacaGow').value.trim() : "";
    window.g_estadoForjaGow.dadosCadastrais.furia = document.getElementById('campoNumeroFuriaGow') ? document.getElementById('campoNumeroFuriaGow').value : "0";

    // Modifica o ponteiro de etapa ativa e atualiza a visualização de forma isolada
    window.g_estadoForjaGow.etapaAtiva = 2;
    window.criarNovaFichaForm();
};

/**
 * Faz a transição reversa para a primeira aba preservando tudo na memória global volátil.
 */
window.retrocederParaAbaUmDadosBasicos = function(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    window.g_estadoForjaGow.etapaAtiva = 1;
    window.criarNovaFichaForm();
};

/**
 * Soma o total de valores numéricos de atributos distribuídos pelo utilizador.
 */
function somarPontosAtributosAtuais() {
    let somatorio = 0;
    for (let chaveAtributo in window.g_estadoForjaGow.atributosDivinos) {
        somatorio += parseInt(window.g_estadoForjaGow.atributosDivinos[chaveAtributo]) || 0;
    }
    return somatorio;
}

/**
 * Adiciona ou diminui pontos de um determinado atributo com validação de limites estritos.
 */
window.operarCalculoAtributoFicha = function(atributoAlvo, deltaModificador, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const valorAtualAtributo = window.g_estadoForjaGow.atributosDivinos[atributoAlvo] || 0;
    const novoValorSimulado = valorAtualAtributo + deltaModificador;

    // Regras de validação de limites físicos do RPG
    if (novoValorSimulado > LIMITE_SUPERIOR_ATRIBUTO || novoValorSimulado < LIMITE_INFERIOR_ATRIBUTO) {
        console.warn(`[Forja] Bloqueio de limite atingido para o atributo ${atributoAlvo}`);
        return;
    }

    // Grava e manda re-renderizar apenas a folha de atributos
    window.g_estadoForjaGow.atributosDivinos[atributoAlvo] = novoValorSimulado;

    const containerAlvoDinamico = document.getElementById('fichasConteudoDinamico');
    if (containerAlvoDinamico) {
        renderizarModuloAbaDoisAtributos(containerAlvoDinamico);
    }
};

/**
 * Processador de Foto Avançado com Compressão Dinâmica via Canvas
 * Reduz a escala da imagem em tempo de execução para evitar que estoure a quota limite de 5MB do LocalStorage.
 */
window.processarCompressaoFotoBase64 = function(inputElementFicheiro) {
    if (inputElementFicheiro.files && inputElementFicheiro.files[0]) {
        const leitorFicheiros = new FileReader();
        
        leitorFicheiros.onload = function(eventoCarregamento) {
            const objetoImagem = new Image();
            objetoImagem.src = eventoCarregamento.target.result;
            
            objetoImagem.onload = function() {
                // Criação de canvas para compressão em tempo de execução
                const elementoCanvas = document.createElement('canvas');
                const MAX_DIMENSAO = 240; // Resolução otimizada para o avatar circular
                
                let larguraCalculada = objetoImagem.width;
                let alturaCalculada = objetoImagem.height;

                if (larguraCalculada > alturaCalculada) {
                    if (larguraCalculada > MAX_DIMENSAO) {
                        alturaCalculada *= MAX_DIMENSAO / larguraCalculada;
                        larguraCalculada = MAX_DIMENSAO;
                    }
                } else {
                    if (alturaCalculada > MAX_DIMENSAO) {
                        larguraCalculada *= MAX_DIMENSAO / alturaCalculada;
                        alturaCalculada = MAX_DIMENSAO;
                    }
                }

                elementoCanvas.width = larguraCalculada;
                elementoCanvas.height = alturaCalculada;
                
                const contextoCanvas = elementoCanvas.getContext('2d');
                contextoCanvas.drawImage(objetoImagem, 0, 0, larguraCalculada, alturaCalculada);
                
                // Converte em WEBP/JPEG de alta performance comprimido a 75%
                const stringBase64Comprimida = elementoCanvas.toDataURL('image/jpeg', 0.75);
                
                // Salva no estado e injeta na imagem em exibição
                window.g_estadoForjaGow.fotoBase64 = stringBase64Comprimida;
                const tagImagemPreview = document.getElementById('elementoImgPreviewGow');
                if (tagImagemPreview) tagImagemPreview.src = stringBase64Comprimida;
            };
        };
        leitorFicheiros.readAsDataURL(inputElementFicheiro.files[0]);
    }
};

/* ==========================================================================
   SISTEMA DE PERSISTÊNCIA COMPLETO NO LOCALSTORAGE DO USUÁRIO
   ========================================================================== */
window.consolidarEGravarFichaNoArmazenamento = function(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const contaUsuarioAtiva = localStorage.getItem("activeUser") || "Convidado";
    const chaveStorageFinal = `fichas_${contaUsuarioAtiva}`;

    const dadosAtuaisLocalraw = localStorage.getItem(chaveStorageFinal);
    let arrayBancoFichas = dadosAtuaisLocalraw ? JSON.parse(dadosAtuaisLocalraw) : [];

    // Montagem do payload estruturado limpo
    const payloadFichaConsolidada = {
        id: window.g_estadoForjaGow.idUnico,
        nome: window.g_estadoForjaGow.dadosCadastrais.nome,
        classe: window.g_estadoForjaGow.dadosCadastrais.classe || "Sem Casta",
        raca: window.g_estadoForjaGow.dadosCadastrais.raca || "Desconhecido",
        furia: window.g_estadoForjaGow.dadosCadastrais.furia || "0",
        foto: window.g_estadoForjaGow.fotoBase64,
        atributos: { ...window.g_estadoForjaGow.atributosDivinos },
        timestamps: {
            salvoEm: new Date().toISOString()
        }
    };

    // Remove registos com o mesmo ID caso seja uma ação de edição e coloca no topo
    arrayBancoFichas = arrayBancoFichas.filter(fichaObjeto => fichaObjeto.id !== payloadFichaConsolidada.id);
    arrayBancoFichas.unshift(payloadFichaConsolidada);

    // Persiste de forma segura
    localStorage.setItem(chaveStorageFinal, JSON.stringify(arrayBancoFichas));

    // Despara feedback visual premium utilizando a infraestrutura do index
    if (typeof window.triggerZeusModal === "function") {
        window.triggerZeusModal("Forja Concluída", `A ficha de "${payloadFichaConsolidada.nome}" foi gravada com sucesso nos pergaminhos!`, "Excelente", "#00d9ff");
    } else {
        alert(`Sucesso! A ficha de ${payloadFichaConsolidada.nome} foi imortalizada.`);
    }

    // Reseta por completo a máquina de estado preparando para a próxima interação limpa
    window.g_estadoForjaGow = {
        etapaAtiva: 1, idUnico: "",
        dadosCadastrais: { nome: "", classe: "", raca: "", furia: "0" },
        fotoBase64: "",
        atributosDivinos: { "Força": 0, "Intelecto": 0, "Sabedoria": 0, "Destreza": 0, "Constituição": 0, "Carisma": 0 }
    };

    // Redireciona de volta para o dashboard de listagem das fichas salvas
    window.listarFichasSalvas();
};

/* ==========================================================================
   RECONSTRUÇÃO COMPLETA DO PAINEL DE VISUALIZAÇÃO E LISTAGEM
   ========================================================================== */
window.listarFichasSalvas = function() {
    console.log("📋 Varrendo armazenamento local e gerando lista de fichas...");
    const containerAlvoDinamico = document.getElementById('fichasConteudoDinamico');
    if (!containerAlvoDinamico) return;

    const contaUsuarioAtiva = localStorage.getItem("activeUser") || "Convidado";
    const chaveStorageFinal = `fichas_${contaUsuarioAtiva}`;
    const dadosAtuaisLocalraw = localStorage.getItem(chaveStorageFinal);
    const arrayBancoFichas = dadosAtuaisLocalraw ? JSON.parse(dadosAtuaisLocalraw) : [];

    if (arrayBancoFichas.length === 0) {
        containerAlvoDinamico.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; color: #555; font-style: italic; font-family: 'Marcellus', serif; background: #070707; border: 1px dashed #222; border-radius: 4px;">
                <i class="fa-solid fa-box-open" style="font-size: 26px; color: #222; margin-bottom: 12px; display: block;"></i>
                Nenhum arquétipo de herói forjado neste panteão até ao momento...
            </div>
        `;
        return;
    }

    let htmlEstruturaGrade = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 20px; margin-top: 10px; animation: animacaoGowFadeIn 0.35s ease-out;">`;

    arrayBancoFichas.forEach(fichaItem => {
        let htmlMiniTabelaAtributos = "";
        
        // Loop computacional para desenhar a lista interna de atributos e modificadores calculados
        for (let chaveAtr in fichaItem.atributos) {
            const valAtr = fichaItem.atributos[chaveAtr] || 0;
            const modAtr = window.calcularModificadorGoW(valAtr);
            let corDoModificadorTexto = "#aaa";
            if (parseInt(modAtr) > 0) corDoModificadorTexto = "#00d9ff";
            if (parseInt(modAtr) < 0) corDoModificadorTexto = "#ff3333";

            htmlMiniTabelaAtributos += `
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #ccc; border-bottom: 1px dashed #1c1c1c; padding: 4px 0;">
                    <span style="font-family: 'Marcellus', serif; color: #888;">${chaveAtr}:</span>
                    <span style="font-family: 'Cinzel', serif; font-weight: bold; color: #d4af37;">
                        ${valAtr >= 0 ? '+' + valAtr : valAtr} <span style="color: ${corDoModificadorTexto}; font-size: 11px; font-weight: bold;">(${modAtr})</span>
                    </span>
                </div>
            `;
        }

        htmlEstruturaGrade += `
            <div style="background: #0f0f0f; border: 1px solid #222; padding: 22px; border-radius: 4px; display: flex; gap: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.6); position: relative;">
                
                <div class="zona-foto-circular" style="margin: 0; flex-shrink: 0; width: 75px; height: 75px; border: 1px solid #d4af37; border-radius: 50%; overflow: hidden; background: #000; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                    <img src="${fichaItem.foto || 'https://via.placeholder.com/150'}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <h4 style="font-family: 'Cinzel', serif; color: #d4af37; font-size: 17px; margin: 0 0 3px 0; letter-spacing: 0.5px;">${fichaItem.nome}</h4>
                        <div style="font-size: 10px; color: #888; text-transform: uppercase; font-family: 'Cinzel', serif; letter-spacing: 1px; margin-bottom: 12px;">
                            ${fichaItem.classe} <span style="color: #444; margin: 0 3px;">•</span> ${fichaItem.raca}
                        </div>
                        
                        <div style="background: #060606; padding: 12px; border: 1px solid #161616; border-radius: 3px; margin-bottom: 14px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
                            ${htmlMiniTabelaAtributos}
                        </div>
                    </div>

                    <div style="display: flex; gap: 8px; margin-top: auto;">
                        <button type="button" class="btn-gow btn-secondary" onclick='window.g_estadoForjaGow.etapaAtiva=1; window.criarNovaFichaForm(${JSON.stringify(fichaItem).replace(/'/g, "&#39;")})' style="padding: 6px 12px; font-size: 11px; font-family: 'Cinzel', serif; display: flex; align-items: center; gap: 5px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                            <i class="fa-solid fa-pen" style="color: #d4af37;"></i> Editar
                        </button>
                        <button type="button" class="btn-gow" onclick="window.eliminarFichaDefinitivoGow('${fichaItem.id}', event)" style="padding: 6px 12px; font-size: 11px; background: #5a0000; border-color: #380000; font-family: 'Cinzel', serif; display: flex; align-items: center; gap: 5px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                            <i class="fa-solid fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    htmlEstruturaGrade += `</div>`;
    containerAlvoDinamico.innerHTML = htmlEstruturaGrade;
};

/**
 * Remove permanentemente os registos de uma ficha específica.
 */
window.eliminarFichaDefinitivoGow = function(idFichaAlvo, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const contaUsuarioAtiva = localStorage.getItem("activeUser") || "Convidado";
    const chaveStorageFinal = `fichas_${contaUsuarioAtiva}`;
    const dadosAtuaisLocalraw = localStorage.getItem(chaveStorageFinal);
    let arrayBancoFichas = dadosAtuaisLocalraw ? JSON.parse(dadosAtuaisLocalraw) : [];

    const correspondenciaFicha = arrayBancoFichas.find(f => f.id === idFichaAlvo);
    const nomeDoGuerreiro = correspondenciaFicha ? correspondenciaFicha.nome : "este guerreiro";

    if (confirm(`Tem certeza de que deseja banir e incinerar os registos de "${nomeDoGuerreiro}" permanentemente no Submundo?`)) {
        arrayBancoFichas = arrayBancoFichas.filter(f => f.id !== idFichaAlvo);
        localStorage.setItem(chaveStorageFinal, JSON.stringify(arrayBancoFichas));
        window.listarFichasSalvas();
    }
};

// Injeção dinâmica de CSS Keyframes para animações cinematográficas de transição
if (!document.getElementById('folhaEstiloAnimacoesForjaGow')) {
    const folhaEstilo = document.createElement('style');
    folhaEstilo.id = 'folhaEstiloAnimacoesForjaGow';
    folhaEstilo.innerHTML = `
        @keyframes animacaoGowFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .painel-forja-container input:focus {
            border-color: #8b0000 !important;
            outline: none !important;
            box-shadow: 0 0 10px rgba(139,0,0,0.2) !important;
        }
    `;
    document.head.appendChild(folhaEstilo);
}

// Timeout de segurança controlado para carregar a listagem inicial sem colidir com o carregamento do index
setTimeout(() => { window.listarFichasSalvas(); }, 150);