/* ==========================================================================
   MÓDULO: att.js (Injeção Exclusiva na Sessão de Atualizações)
   ========================================================================== */

console.log("📜 [Bifrost] Cronologia de atualizações carregada e direcionada.");

document.addEventListener("DOMContentLoaded", () => {
    // Escuta cliques no menu lateral para monitorar a troca de abas
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            // Verifica se o clique foi na aba de atualizações
            if (this.getAttribute('onclick') && this.getAttribute('onclick').includes('atualizacoes')) {
                // Pequeno delay para garantir que a sessão já ficou visível no DOM
                setTimeout(initUpdatesModule, 50);
            } else {
                // Se mudar para qualquer outra aba (Fichas, Campanhas, Tutoriais), remove o painel
                destroyUpdatesModule();
            }
        });
    });
});

window.initUpdatesModule = function() {
    // Alvo correto: Injetar especificamente DENTRO do contêiner de atualizações
    const attContainer = document.getElementById('atualizacoes');
    if (!attContainer) {
        console.warn("⚠️ [Bifrost] Contêiner #atualizacoes não foi encontrado no DOM.");
        return;
    }

    // Estrutura interna com CSS encapsulado para não quebrar o layout global
    attContainer.innerHTML = `
        <style>
            .att-wrapper {
                max-width: 900px;
                margin: 0 auto;
                font-family: 'Marcellus', serif;
                color: #e0e0e0;
            }
            .att-header-title {
                font-family: 'Cinzel', serif;
                color: #8b0000;
                font-size: 24px;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .att-subtitle {
                color: #666;
                font-size: 14px;
                margin-bottom: 30px;
                border-bottom: 1px solid #252525;
                padding-bottom: 15px;
            }
            
            .att-timeline {
                position: relative;
                padding-left: 20px;
                border-left: 2px solid #1a1a1a;
                display: flex;
                flex-direction: column;
                gap: 35px;
            }
            
            .att-node {
                position: relative;
            }
            .att-node::before {
                content: '';
                position: absolute;
                left: -26px;
                top: 5px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #444;
                border: 2px solid #080808;
                transition: background 0.3s ease;
            }
            .att-node.latest::before {
                background: #8b0000;
                box-shadow: 0 0 10px #ff3333;
            }
            
            .att-version {
                font-family: 'Cinzel', serif;
                color: #fff;
                font-size: 16px;
                margin-bottom: 4px;
                letter-spacing: 1px;
            }
            .att-date-version {
                font-size: 12px;
                color: #555;
                margin-bottom: 20px;
                font-style: italic;
            }

            .att-list {
                list-style: none;
                padding-left: 0;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .att-list li {
                font-size: 14px;
                color: #b3b3b3;
                line-height: 1.6;
                border-left: 2px solid #252525;
                padding-left: 12px;
                transition: border-color 0.2s ease;
            }
            .att-list li:hover {
                border-left-color: #8b0000;
                color: #fff;
            }
            .att-list li span {
                color: #d4af37;
                font-family: 'Cinzel', serif;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .att-tag-fix { color: #ff4444 !important; }
            .att-tag-add { color: #33ff33 !important; }
        </style>

        <div class="att-wrapper">
            <h2 class="att-header-title"><i class="fa-solid fa-clock-rotate-left"></i> Registros de Destino</h2>
            <p class="att-subtitle">Acompanhe as runas de modificação e decretos aplicados ao ecossistema.</p>
            
            <div class="att-timeline">
                
                <div class="att-node latest">
                    <h3 class="att-version">Versão 1.8.0 Finalizada</h3>
                    <p class="att-date-version">Atualizado com as Correções de Bugs</p>
                    <ul class="att-list">
                        <li><span><i class="fa-solid fa-bug-slash att-tag-fix"></i> Correção do Botão de Apagar:</span> Resolvido o problema crítico onde o botão de exclusão de fichas sumia da interface após a renderização dinâmica dos heróis.</li>
                        <li><span><i class="fa-solid fa-rotate-left att-tag-fix"></i> Fluxo do Dado e Botão Continuar:</span> Corrigido o bug que congelava a aplicação ou ocultava o painel indevidamente ao clicar em "Continuar" após uma rolagem de dados.</li>
                        <li><span><i class="fa-solid fa-bolt att-tag-add"></i> Atualização de Crítico:</span> Refatoração e estabilização completa na lógica de cálculo e na exibição visual de acertos críticos no painel ( Pode apresentar falhas ainda ).</li>
                        <li><span><i class="fa-solid fa-envelope-open-text att-tag-add"></i> Sistema de Recados Dinâmicos:</span> Atualização geral na segurança do escopo e nos avisos em tempo real enviados pelas mensagens divinas (pop-ups de Zeus).</li>
                    </ul>
                </div>

                <div class="att-node">
                    <h3 class="att-version">Versão 1.0.2</h3>
                    <p class="att-date-version">Atualização de Identidade Visual</p>
                    <ul class="att-list">
                        <li><span><i class="fa-solid fa-image att-tag-add"></i> Logo Responsiva:</span> Substituição do texto simples "GOD OF WAR" na tela de entrada (Splash Screen) por uma insígnia oficial totalmente responsiva e estilizada via Base64.</li>
                    </ul>
                </div>

                <div class="att-node">
                    <h3 class="att-version">Versão 1.0.1</h3>
                    <p class="att-date-version">Aprimoramento de Registros</p>
                    <ul class="att-list">
                        <li><span><i class="fa-solid fa-feather-pointed att-tag-add"></i> Modais Fixos de Expansão:</span> Implementação de caixas flutuantes centralizadas para leitura e edição detalhada de anotações sem quebras de layout.</li>
                        <li><span><i class="fa-solid fa-palette att-tag-add"></i> Seletor de Cores Rúnicas:</span> Adicionada a possibilidade de customizar os planos de fundo dos pergaminhos de anotação (Preto, Vermelho, Ouro e Azul Cósmico).</li>
                        <li><span><i class="fa-solid fa-fire att-tag-fix"></i> Sistema de Exclusão Muspelheim:</span> Criação de um modal de confirmação estilizado e centralizado para destruição permanente de registros indesejados.</li>
                    </ul>
                </div>

                <div class="att-node">
                    <h3 class="att-version">Versão 1.0.0 (Lançamento Alfa)</h3>
                    <p class="att-date-version">Fundação do Reino</p>
                    <ul class="att-list">
                        <li><span><i class="fa-solid fa-door-open att-tag-add"></i> Chave de Bifrost:</span> Autenticação local integrada e persistente para Semideuses com tratamento de erros integrado por Zeus.</li>
                        <li><span><i class="fa-solid fa-scroll att-tag-add"></i> Forja de Arquétipos:</span> Estruturação inicial do banco de dados e do painel para gerenciamento e visualização de fichas de personagens.</li>
                        <li><span><i class="fa-solid fa-book att-tag-add"></i> Templo de Ensinamentos:</span> Menu sanfona (acordeon) interativo construído para guiar os jogadores nas mecânicas básicas do jogo.</li>
                    </ul>
                </div>

            </div>
        </div>
    `;
};

window.destroyUpdatesModule = function() {
    // Limpa o conteúdo quando sai da aba para poupar memória do navegador
    const attContainer = document.getElementById('atualizacoes');
    if (attContainer) {
        attContainer.innerHTML = "";
    }
};