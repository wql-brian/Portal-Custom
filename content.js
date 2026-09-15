const FOTO_KEY = "fotoPerfilPersonalizada";
const NOME_KEY = "nomePerfilPersonalizado";

const UI_KEYS = {
    cursos: "ocultarCursos",
    cpb: "ocultarCPB",
    lives: "ocultarLives"
};

const WIDGET_KEYS = {
    trilhas: "widgetTrilhas",
    comunicados: "widgetComunicados",
    calendario: "widgetCalendario",
    avaliacoes: "widgetAvaliacoes",
    reunioes: "widgetReunioes",
    lives: "widgetLives"
};

const WIDGET_DEFAULTS = {
    [WIDGET_KEYS.trilhas]: true,
    [WIDGET_KEYS.comunicados]: true,
    [WIDGET_KEYS.calendario]: true,
    [WIDGET_KEYS.avaliacoes]: true,
    [WIDGET_KEYS.reunioes]: false,
    [WIDGET_KEYS.lives]: false
};

const LIXO_UI_KEYS = {
    anuncioEscolar: "removerAnuncioEscolar"
};

const OLD_AVISO_KEY = "ocultarAvisoPortal";

console.log("EDU. POR. modified by pastille. you're welcome!");


// ============================================================
// UTILIDADES
// ============================================================

function criarBotao(texto) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = texto;

    botao.className =
        "relative inline-flex cursor-pointer select-none " +
        "items-center justify-center rounded-lg px-4 py-2 " +
        "outline-none transition duration-300 " +
        "hover:bg-black/5 active:brightness-95";

    return botao;
}

function obterEstado(chave, callback) {
    chrome.storage.local.get(chave, (resultado) => {
        callback(Boolean(resultado[chave]));
    });
}

function definirEstado(chave, valor) {
    chrome.storage.local.set({
        [chave]: valor
    });
}


// ============================================================
// PERFIL - NOME
// ============================================================

function aplicarNomePerfil() {
    chrome.storage.local.get(NOME_KEY, (resultado) => {
        const nome = resultado[NOME_KEY];

        if (!nome) return;

        document
            .querySelectorAll("strong.text-md, h1.text-md")
            .forEach((elemento) => {
                if (
                    elemento.textContent.trim() ===
                        "Brian Buchweitz da Silveira" ||
                    elemento.textContent.trim() === nome
                ) {
                    elemento.textContent = nome;
                }
            });
    });
}

function mudarNomePerfil() {
    chrome.storage.local.get(NOME_KEY, (resultado) => {
        const nomeAtual =
            resultado[NOME_KEY] ||
            "Brian Buchweitz da Silveira";

        const novoNome = prompt(
            "Digite o novo nome:",
            nomeAtual
        );

        if (novoNome === null) return;

        const nomeLimpo = novoNome.trim();

        if (!nomeLimpo) return;

        chrome.storage.local.set(
            {
                [NOME_KEY]: nomeLimpo
            },
            () => {
                aplicarNomePerfil();
            }
        );
    });
}


// ============================================================
// FOTO DE PERFIL
// ============================================================

function aplicarFoto() {
    chrome.storage.local.get(FOTO_KEY, (resultado) => {
        if (!resultado[FOTO_KEY]) return;

        document
            .querySelectorAll(
                'img[alt="Perfil do usuário"]'
            )
            .forEach((foto) => {
                if (foto.src !== resultado[FOTO_KEY]) {
                    foto.src = resultado[FOTO_KEY];
                }
            });
    });
}

function escolherImagem() {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.addEventListener("change", () => {
        const arquivo = input.files?.[0];

        if (!arquivo) return;

        const leitor = new FileReader();

        leitor.onload = () => {
            chrome.storage.local.set(
                {
                    [FOTO_KEY]: leitor.result
                },
                aplicarFoto
            );
        };

        leitor.readAsDataURL(arquivo);
    });

    input.click();
}


// ============================================================
// BOTÃO DE CURSOS
// ============================================================

function aplicarCursos() {
    chrome.storage.local.get(
        UI_KEYS.cursos,
        (resultado) => {
            const botaoCursos = document.querySelector(
                'a[href="/trilhas-de-aprendizagem"]'
            );

            if (!botaoCursos) return;

            botaoCursos.style.display =
                resultado[UI_KEYS.cursos]
                    ? "none"
                    : "";
        }
    );
}


// ============================================================
// CPB PROVAS
// ============================================================

function aplicarCPB() {
    chrome.storage.local.get(
        UI_KEYS.cpb,
        (resultado) => {
            const path = document.querySelector(
                'path[d^="M7.539 0"]'
            );

            if (!path) return;

            const botao = path.closest("button");

            if (!botao) return;

            botao.style.display =
                resultado[UI_KEYS.cpb]
                    ? "none"
                    : "";
        }
    );
}


// ============================================================
// LIVES
// ============================================================

function aplicarLives() {
    chrome.storage.local.get(
        UI_KEYS.lives,
        (resultado) => {
            const elementos = [
                ...document.querySelectorAll("p")
            ];

            const tituloLives = elementos.find(
                (elemento) =>
                    elemento.textContent.trim() ===
                    "Lives"
            );

            if (!tituloLives) return;

            const blocoLives =
                tituloLives.closest(
                    "app-day-zoom"
                );

            if (!blocoLives) return;

            blocoLives.style.display =
                resultado[UI_KEYS.lives]
                    ? "none"
                    : "";
        }
    );
}


// ============================================================
// ALTERAR CONFIGURAÇÃO
// ============================================================

function alternarConfiguracao(
    chave,
    botao,
    texto
) {
    chrome.storage.local.get(
        chave,
        (resultado) => {
            const novoEstado =
                !Boolean(resultado[chave]);

            definirEstado(
                chave,
                novoEstado
            );

            botao.textContent =
                `${texto}: ${
                    novoEstado
                        ? "Ativado"
                        : "Desativado"
                }`;

            atualizarElementos();
        }
    );
}


// ============================================================
// BOTÃO DE CONFIGURAÇÃO
// ============================================================

function criarBotaoConfiguracao(
    texto,
    chave
) {
    const botao = criarBotao(
        `${texto}: Desativado`
    );

    obterEstado(
        chave,
        (ativo) => {
            botao.textContent =
                `${texto}: ${
                    ativo
                        ? "Ativado"
                        : "Desativado"
                }`;
        }
    );

    botao.addEventListener(
        "click",
        () => {
            alternarConfiguracao(
                chave,
                botao,
                texto
            );
        }
    );

    return botao;
}


// ============================================================
// LIXO UI
// ============================================================

function obterEstadoLixoUI(
    chave,
    callback
) {
    chrome.storage.local.get(
        chave,
        (resultado) => {
            if (
                resultado[chave] ===
                undefined
            ) {
                callback(true);
                return;
            }

            callback(
                Boolean(resultado[chave])
            );
        }
    );
}

function alternarLixoUI(
    chave,
    botao,
    texto
) {
    obterEstadoLixoUI(
        chave,
        (estadoAtual) => {
            const novoEstado =
                !estadoAtual;

            chrome.storage.local.set({
                [chave]: novoEstado
            });

            botao.textContent =
                `${texto}: ${
                    novoEstado
                        ? "Ativado"
                        : "Desativado"
                }`;

            atualizarElementos();
        }
    );
}

function criarBotaoLixoUI(
    texto,
    chave
) {
    const botao = criarBotao(
        `${texto}: Ativado`
    );

    obterEstadoLixoUI(
        chave,
        (ativo) => {
            botao.textContent =
                `${texto}: ${
                    ativo
                        ? "Ativado"
                        : "Desativado"
                }`;
        }
    );

    botao.addEventListener(
        "click",
        () => {
            alternarLixoUI(
                chave,
                botao,
                texto
            );
        }
    );

    return botao;
}

function removerAnuncioEscolar() {
    chrome.storage.local.get(
        LIXO_UI_KEYS.anuncioEscolar,
        (resultado) => {
            const remover =
                resultado[
                    LIXO_UI_KEYS.anuncioEscolar
                ] !== false;

            if (!remover) return;

            document
                .querySelectorAll(
                    'a[href*="cpbplay.com.br"]'
                )
                .forEach((link) => {
                    const slide =
                        link.closest(
                            ".owl-item"
                        );

                    if (slide) {
                        slide.style.display =
                            "none";
                    } else {
                        link.style.display =
                            "none";
                    }
                });
        }
    );
}


// ============================================================
// ALTERAR NOME DO BOTÃO PERFIL
// ============================================================

function alterarNomePerfil() {
    document
        .querySelectorAll(
            'button[app-tab-header]'
        )
        .forEach((botao) => {
            if (
                botao.textContent.trim() ===
                "Perfil"
            ) {
                botao.textContent =
                    "Config. Portal Custom";
            }
        });
}


// ============================================================
// WIDGETS
// ============================================================

function obterEstadoWidget(
    chave,
    callback
) {
    chrome.storage.local.get(
        chave,
        (resultado) => {
            if (
                resultado[chave] ===
                undefined
            ) {
                callback(
                    WIDGET_DEFAULTS[chave]
                );
                return;
            }

            callback(
                Boolean(resultado[chave])
            );
        }
    );
}

function definirEstadoWidget(
    chave,
    valor
) {
    chrome.storage.local.set({
        [chave]: valor
    });
}

function aplicarWidget(
    chave,
    seletor
) {
    obterEstadoWidget(
        chave,
        (permitido) => {
            document
                .querySelectorAll(
                    seletor
                )
                .forEach(
                    (elemento) => {
                        elemento.style.display =
                            permitido
                                ? ""
                                : "none";
                    }
                );
        }
    );
}

function aplicarWidgets() {
    aplicarWidget(
        WIDGET_KEYS.trilhas,
        "app-card-learning-trails"
    );

    aplicarWidget(
        WIDGET_KEYS.comunicados,
        "app-card-announcement"
    );

    aplicarWidget(
        WIDGET_KEYS.calendario,
        "app-card-calendar"
    );

    aplicarWidget(
        WIDGET_KEYS.avaliacoes,
        "app-card-evaluation"
    );

    aplicarWidget(
        WIDGET_KEYS.reunioes,
        "app-card-academic-service-report"
    );

    aplicarWidget(
        WIDGET_KEYS.lives,
        "app-card-live"
    );
}

function alternarWidget(
    chave,
    botao,
    texto
) {
    obterEstadoWidget(
        chave,
        (estadoAtual) => {
            const novoEstado =
                !estadoAtual;

            definirEstadoWidget(
                chave,
                novoEstado
            );

            botao.textContent =
                `${texto}: ${
                    novoEstado
                        ? "Permitido"
                        : "Bloqueado"
                }`;

            aplicarWidgets();
        }
    );
}

function criarBotaoWidget(
    texto,
    chave
) {
    const botao = criarBotao(
        `${texto}: ${
            WIDGET_DEFAULTS[chave]
                ? "Permitido"
                : "Bloqueado"
        }`
    );

    obterEstadoWidget(
        chave,
        (permitido) => {
            botao.textContent =
                `${texto}: ${
                    permitido
                        ? "Permitido"
                        : "Bloqueado"
                }`;
        }
    );

    botao.addEventListener(
        "click",
        () => {
            alternarWidget(
                chave,
                botao,
                texto
            );
        }
    );

    return botao;
}


// ============================================================
// EMBED: PERFIL
// ============================================================

function criarSecaoPerfil() {
    if (
        document.querySelector(
            "#portal-custom-perfil"
        )
    ) {
        return;
    }

    const ui = document.querySelector(
        "#portal-custom-ui"
    );

    if (!ui) return;

    const secao =
        document.createElement("div");

    secao.id =
        "portal-custom-perfil";

    secao.className =
        "rounded-2xl bg-white shadow-md " +
        "border-l-[6px] border-theme-500";

    const conteudo =
        document.createElement("div");

    conteudo.className =
        "block px-5 py-4 text-start";

    const titulo =
        document.createElement("span");

    titulo.className =
        "font-semibold";

    titulo.textContent =
        "Perfil";

    const descricao =
        document.createElement("div");

    descricao.className =
        "text-gray-500 mt-1";

    descricao.textContent =
        "Mude o seu perfil, Viva do seu jeito, " +
        "não do jeito que a sociedade quer.";

    const opcoes =
        document.createElement("div");

    opcoes.className =
        "flex flex-col gap-2 mt-4";


    // ========================================================
    // MUDAR NOME
    // ========================================================

    const nome =
        criarBotao("mudar Nome");

    nome.addEventListener(
        "click",
        mudarNomePerfil
    );


    // ========================================================
    // MUDAR IMAGEM
    // ========================================================

    const imagem =
        criarBotao(
            "Mudar imagem de perfil"
        );

    imagem.addEventListener(
        "click",
        escolherImagem
    );


    opcoes.appendChild(nome);
    opcoes.appendChild(imagem);

    conteudo.appendChild(titulo);
    conteudo.appendChild(descricao);
    conteudo.appendChild(opcoes);

    secao.appendChild(conteudo);


    // Perfil fica no topo
    ui.parentElement.insertBefore(
        secao,
        ui
    );
}


// ============================================================
// SEÇÃO DE DEFINIÇÕES DE UI
// ============================================================

function criarSecaoUI() {
    if (
        document.querySelector(
            "#portal-custom-ui"
        )
    ) {
        return;
    }

    const cards = [
        ...document.querySelectorAll(
            "[app-card-content]"
        )
    ];

    const cardAluno = cards.find(
        (elemento) =>
            elemento.textContent.includes(
                "Colégio Adventista de Pelotas"
            )
    );

    if (!cardAluno) return;

    const secao =
        document.createElement("div");

    secao.id =
        "portal-custom-ui";

    secao.className =
        "mt-4 rounded-2xl bg-white shadow-md " +
        "border-l-[6px] border-theme-500";

    const conteudo =
        document.createElement("div");

    conteudo.className =
        "block px-5 py-4 text-start";

    const titulo =
        document.createElement("span");

    titulo.className =
        "font-semibold";

    titulo.textContent =
        "Definições de UI";

    const descricao =
        document.createElement("div");

    descricao.className =
        "text-gray-500 mt-1";

    descricao.textContent =
        "Odeia a interface? " +
        "Venha mexer nas configurações!";

    const opcoes =
        document.createElement("div");

    opcoes.className =
        "flex flex-col gap-2 mt-4";


    // ========================================================
    // REMOVER ANÚNCIO ESCOLAR
    // ========================================================

    const anuncioEscolar =
        criarBotaoLixoUI(
            "Remover anúncio Escolar",
            LIXO_UI_KEYS.anuncioEscolar
        );


    // ========================================================
    // CURSOS
    // ========================================================

    const cursos =
        criarBotaoConfiguracao(
            "Ocultar botão de cursos",
            UI_KEYS.cursos
        );


    // ========================================================
    // CPB
    // ========================================================

    const cpb =
        criarBotaoConfiguracao(
            "Ocultar botão CPB Provas",
            UI_KEYS.cpb
        );


    // ========================================================
    // LIVES
    // ========================================================

    const lives =
        criarBotaoConfiguracao(
            "Ocultar Lives",
            UI_KEYS.lives
        );


    opcoes.appendChild(
        anuncioEscolar
    );

    opcoes.appendChild(cursos);
    opcoes.appendChild(cpb);
    opcoes.appendChild(lives);

    conteudo.appendChild(titulo);
    conteudo.appendChild(descricao);
    conteudo.appendChild(opcoes);

    secao.appendChild(conteudo);

    const card =
        cardAluno.closest(
            "app-card"
        );

    if (card) {
        card.parentElement.appendChild(
            secao
        );
    }
}


// ============================================================
// SEÇÃO DE WIDGETS
// ============================================================

function criarSecaoWidgets() {
    if (
        document.querySelector(
            "#portal-custom-widgets"
        )
    ) {
        return;
    }

    const ui =
        document.querySelector(
            "#portal-custom-ui"
        );

    if (!ui) return;

    const secao =
        document.createElement("div");

    secao.id =
        "portal-custom-widgets";

    secao.className =
        "mt-4 rounded-2xl bg-white shadow-md " +
        "border-l-[6px] border-theme-500";

    const conteudo =
        document.createElement("div");

    conteudo.className =
        "block px-5 py-4 text-start";

    const titulo =
        document.createElement("span");

    titulo.className =
        "font-semibold";

    titulo.textContent =
        "Widgets - Pag. Principal";

    const descricao =
        document.createElement("div");

    descricao.className =
        "text-gray-500 mt-1";

    descricao.textContent =
        "Escolha quais widgets aparecem na página principal.";

    const opcoes =
        document.createElement("div");

    opcoes.className =
        "flex flex-col gap-2 mt-4";

    const trilhas =
        criarBotaoWidget(
            "Trilhas de aprendizagem",
            WIDGET_KEYS.trilhas
        );

    const comunicados =
        criarBotaoWidget(
            "Comunicados",
            WIDGET_KEYS.comunicados
        );

    const calendario =
        criarBotaoWidget(
            "Calendário",
            WIDGET_KEYS.calendario
        );

    const avaliacoes =
        criarBotaoWidget(
            "Avaliações em andamento",
            WIDGET_KEYS.avaliacoes
        );

    const reunioes =
        criarBotaoWidget(
            "Reuniões de atendimento",
            WIDGET_KEYS.reunioes
        );

    const lives =
        criarBotaoWidget(
            "Lives",
            WIDGET_KEYS.lives
        );

    opcoes.appendChild(trilhas);
    opcoes.appendChild(comunicados);
    opcoes.appendChild(calendario);
    opcoes.appendChild(avaliacoes);
    opcoes.appendChild(reunioes);
    opcoes.appendChild(lives);

    conteudo.appendChild(titulo);
    conteudo.appendChild(descricao);
    conteudo.appendChild(opcoes);

    secao.appendChild(conteudo);

    ui.parentElement.appendChild(
        secao
    );
}


// ============================================================
// CARD "GOSTOU DO PROJETO?"
// ============================================================

function criarCardPastille() {
    if (
        document.querySelector(
            "#portal-custom-pastille"
        )
    ) {
        return;
    }

    const ui =
        document.querySelector(
            "#portal-custom-ui"
        );

    if (!ui) return;

    const card =
        document.createElement("div");

    card.id =
        "portal-custom-pastille";

    card.className =
        "mt-4 rounded-2xl bg-white shadow-md " +
        "border-l-[6px] border-theme-500";

    const conteudo =
        document.createElement("div");

    conteudo.className =
        "block px-5 py-4 text-start";

    const titulo =
        document.createElement("span");

    titulo.className =
        "font-semibold";

    titulo.textContent =
        "Gostou do projeto?";

    const texto =
        document.createElement("div");

    texto.className =
        "mt-2 text-gray-500 leading-relaxed";

    texto.innerHTML =
        "De nada!<br>" +
        "Minha extensão não chama em nenhuma vez o servidor, não avisa nada pro servidor, apenas aplica para o seu navegador!<br><br>" +
        "A extensão, Não rouba seu token. você pode analisar o codigo pois a extensão é 100% Codigo Aberto!<br><br>" +
        "https://github.com/wql-brian/Portal-Custom";

    conteudo.appendChild(titulo);
    conteudo.appendChild(texto);

    card.appendChild(conteudo);

    ui.parentElement.appendChild(
        card
    );
}


// ============================================================
// CONFIGURAÇÃO ANTIGA
// ============================================================

function limparConfiguracaoAntiga() {
    chrome.storage.local.get(
        OLD_AVISO_KEY,
        (resultado) => {
            if (
                resultado[
                    OLD_AVISO_KEY
                ] === true
            ) {
                chrome.storage.local.remove(
                    OLD_AVISO_KEY,
                    () => {
                        window.location.reload();
                    }
                );

                return;
            }

            atualizar();
        }
    );
}


// ============================================================
// ATUALIZAÇÃO DOS ELEMENTOS
// ============================================================

function atualizarElementos() {
    aplicarFoto();
    aplicarNomePerfil();

    aplicarCursos();
    aplicarCPB();
    aplicarLives();

    removerAnuncioEscolar();
}


// ============================================================
// ATUALIZAÇÃO GERAL
// ============================================================

function atualizar() {
    alterarNomePerfil();

    atualizarElementos();

    aplicarWidgets();

    criarSecaoUI();
    criarSecaoPerfil();
    criarSecaoWidgets();

    criarCardPastille();
}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

limparConfiguracaoAntiga();


// ============================================================
// OBSERVADOR DO ANGULAR
// ============================================================

const observer =
    new MutationObserver(() => {
        atualizar();
    });

observer.observe(
    document.documentElement,
    {
        childList: true,
        subtree: true
    }
);
