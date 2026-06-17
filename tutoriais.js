/* ==========================================================================
   MÓDULO: tutoriais.js (Guia de Criação de Ficha - Versão 1.8)
   ========================================================================== */

console.log("📖 [Bifrost] Biblioteca de tutoriais carregada.");

document.addEventListener("DOMContentLoaded", () => {
    // Monitora a troca de abas para carregar o tutorial quando entrar na sessão correta
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.getAttribute('onclick') && this.getAttribute('onclick').includes('tutorial')) {
                setTimeout(initTutorialsModule, 50);
            }
        });
    });
});

window.initTutorialsModule = function() {
    const tutorialContainer = document.getElementById('tutorial');
    if (!tutorialContainer) return;

    // Limpa o contêiner para garantir que não haja duplicatas
    tutorialContainer.innerHTML = `
        <h2 style="font-family: 'Cinzel', serif; letter-spacing: 2px; text-transform: uppercase; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.1); margin-bottom: 10px;">
            <i class="fa-solid fa-book-journal-whills" style="color: #8b0000; margin-right: 10px;"></i> Biblioteca de Ensinamentos
        </h2>
        <hr style="border: 0; height: 1px; background: linear-gradient(to right, #8b0000, #2a2a2a, transparent); margin: 15px 0 30px 0;">
        
        <div id="tutorialAccordionArea"></div>
    `;

    renderCharacterCreationTutorial();
    injectTutorialStyles();
};

function renderCharacterCreationTutorial() {
    const area = document.getElementById('tutorialAccordionArea');
    
    const tutorialHTML = `
        <div class="tutorial-item">
            <div class="tutorial-header" onclick="toggleTutorialTab(this)">
                <span><i class="fa-solid fa-hammer"></i> Guia: Forja de Ficha Completa (v1.8)</span>
                <i class="fa-solid fa-chevron-down arrow-icon"></i>
            </div>
            <div class="tutorial-content">
                <div class="tutorial-inner-body">
                    <p class="tutorial-intro">Para trilhar seu caminho nos nove reinos, você deve primeiro forjar sua identidade. A criação de ficha na versão 1.8 é dividida em duas etapas sagradas.</p>
                    
                    <h4 class="sub-topic"><i class="fa-solid fa-id-card"></i> Etapa 1: Linhagem e Arquétipo</h4>
                    <p>Aqui você define sua imagem, nome e título. A escolha mais importante desta etapa é o seu <strong>Arquétipo</strong>, que define se você possui sangue divino.</p>
                    
                    <div class="arquetipo-grid">
                        <div class="arquetipo-box divino">
                            <h5>Deuses & Semi-Deuses</h5>
                            <p>Possuem acesso ao <strong>Modo Fúria</strong>. Semi-Deuses também progridem através do sistema de Casas.</p>
                        </div>
                        <div class="arquetipo-box">
                            <h5>Humanos, Anões & Gigantes</h5>
                            <p>Não possuem Modo Fúria. Focam em maestria de atributos e habilidades raciais únicas.</p>
                        </div>
                    </div>

                    <h4 class="sub-topic"><i class="fa-solid fa-fire"></i> Etapa 2: Atributos e Fúria</h4>
                    <p>Nesta etapa, você distribui seu poder. Você inicia com <strong>30 pontos base</strong> para distribuir entre os 6 atributos:</p>
                    
                    <ul class="stats-list">
                        <li><strong>Força, Intelecto, Constituição, Sabedoria, Carisma e Destreza.</strong></li>
                    </ul>

                    <div class="info-alert">
                        <i class="fa-solid fa-calculator"></i> <strong>A Regra Matemática:</strong> A cada 2 pontos (positivos ou negativos) investidos em um atributo, seu <strong>Modificador</strong> aumenta em +1.
                    </div>

                    <h4 class="sub-topic"><i class="fa-solid fa-bolt-lightning"></i> Mecânicas Exclusivas</h4>
                    
                    <div class="mechanic-detail">
                        <div class="detail-item">
                            <strong><i class="fa-solid fa-gopuram" style="color:#d4af37;"></i> Sistema de Casas (Exclusivo Semi-Deuses):</strong>
                            <p>Representa seu nível de ascensão. Vai da <strong>Sétima Casa (Mais Fraca)</strong> até a <strong>Primeira Casa (Mestre)</strong>. Cada casa avançada concede <strong>+4 pontos</strong> extras de atributo.</p>
                        </div>
                        <div class="detail-item">
                            <strong><i class="fa-solid fa-fire-burner" style="color:#ff3333;"></i> Modo Fúria (Exclusivo Sangue Divino):</strong>
                            <p>Permite escolher entre os estilos: <strong>Espartano, Ateniense, Grego ou Puro</strong>. A barra vermelha dinâmica representa sua intensidade acumulada para o combate.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    area.innerHTML = tutorialHTML;
}

// Função para abrir e fechar a aba
window.toggleTutorialTab = function(element) {
    const item = element.parentElement;
    const content = item.querySelector('.tutorial-content');
    const isActive = item.classList.contains('active');

    // Fecha todos os outros se houver mais de um
    document.querySelectorAll('.tutorial-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.tutorial-content').style.maxHeight = null;
    });

    if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
    }
};

function injectTutorialStyles() {
    if (document.getElementById('gowTutorialStyles')) return;

    const style = document.createElement('style');
    style.id = 'gowTutorialStyles';
    style.innerHTML = `
        .tutorial-item {
            background: #0d0d0d;
            border: 1px solid #222;
            border-radius: 4px;
            margin-bottom: 15px;
            overflow: hidden;
            transition: border-color 0.3s;
        }
        .tutorial-item.active {
            border-color: #8b0000;
        }

        .tutorial-header {
            padding: 15px 20px;
            background: #141414;
            color: #d4af37;
            font-family: 'Cinzel', serif;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background 0.2s;
        }
        .tutorial-header:hover {
            background: #1a1a1a;
            color: #fff;
        }
        .tutorial-header .arrow-icon {
            transition: transform 0.3s;
            font-size: 14px;
            color: #8b0000;
        }
        .tutorial-item.active .arrow-icon {
            transform: rotate(180deg);
        }

        .tutorial-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease-out;
            background: #0a0a0a;
        }

        .tutorial-inner-body {
            padding: 25px;
            color: #ccc;
            font-family: 'Marcellus', serif;
            line-height: 1.6;
        }

        .tutorial-intro {
            font-size: 15px;
            margin-bottom: 20px;
            color: #aaa;
            border-left: 2px solid #333;
            padding-left: 15px;
        }

        .sub-topic {
            font-family: 'Cinzel', serif;
            color: #fff;
            margin: 25px 0 10px 0;
            font-size: 15px;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .sub-topic i { color: #8b0000; }

        .arquetipo-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 15px 0;
        }
        .arquetipo-box {
            background: #111;
            border: 1px solid #222;
            padding: 15px;
            border-radius: 4px;
        }
        .arquetipo-box.divino {
            border-color: #551111;
            background: #1a0a0a;
        }
        .arquetipo-box h5 {
            color: #d4af37;
            margin: 0 0 5px 0;
            font-family: 'Cinzel', serif;
        }
        .arquetipo-box p { font-size: 13px; margin: 0; }

        .stats-list {
            list-style: none;
            padding: 0;
            margin: 10px 0;
            color: #fff;
        }

        .info-alert {
            background: #02111a;
            border: 1px solid #00d9ff;
            color: #00d9ff;
            padding: 12px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 14px;
        }

        .mechanic-detail {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .detail-item {
            border-bottom: 1px solid #1a1a1a;
            padding-bottom: 10px;
        }
        .detail-item p { margin: 5px 0 0 0; font-size: 14px; color: #999; }
    `;
    document.head.appendChild(style);
}