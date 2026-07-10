# ID-Bov — Identificação de Animais por Brinco

## O que é

PWA simples e independente (NÃO faz parte do Colaborador Eficiente / cochos-sal)
para pecuária de corte: cadastro rápido de animais pelo número do brinco,
pensado para uso no curral com tela grande e botões enormes.

## Arquivos

```
/Users/fabriciomarquezresende/id-bov/
├── index.html    # App completo (HTML+CSS+JS em um arquivo)
├── sw.js         # Service Worker — cache-first, 100% offline
├── manifest.json # PWA (nome: "ID-Bov")
├── icon.svg      # Ícone (boi dourado sobre verde escuro)
└── CLAUDE.md     # Este arquivo
```

## Fluxo de cadastro (assistente passo a passo)

1. **Brinco** — teclado numérico gigante (0-9, ⌫, ✓); sugere o próximo número
   (maior brinco + 1, preservando zeros à esquerda); avisa duplicados.
2. **Sexo** — Macho / Fêmea (toque avança sozinho).
3. **Raça** — Nelore / Cruzado.
4. **Idade** — 0-4, 5-12, 13-24, 25-36, +36 meses.
5. **Peso (kg)** — teclado numérico igual ao do brinco (máx 4 dígitos, sem zero
   à esquerda); botão "Sem balança — pular" (peso fica `null`). Campo `peso`.
6. **Observação** — pergunta Sim/Não; "Não" salva e volta direto ao teclado do
   próximo animal; "Sim" abre campo de texto.

Tela inicial: contadores (total/♂/♀) + alternador **Animais | Manejos**;
lista de animais (com filtro por manejo), editar, excluir, exportar/importar.

## Edição do animal (v11)

- Botão ✏️ no cartão → `abrirEditar(id)`: modal edita brinco, sexo, raça,
  idade (pílulas `.ed-opt`), manejo (select) e observação. Peso fica FORA
  (corrige-se pelo modal de pesagens, que preserva o histórico).
- Validações: brinco não-vazio, só dígitos, único (exceto o próprio).
- Edição propaga p/ nuvem: na mesclagem o lado local vence nos campos
  simples (`Object.assign({}, nuvem, local)`).

## Logo definitivo: cabeça de boi gerada pelo usuário (v27)

- Usuário gerou o logo por IA (Gemini) — cabeça de boi de linha, fundo
  transparente — e mandou o arquivo (livre de copyright de terceiros, ao
  contrário das referências VectorStock anteriores). Fonte:
  `logo-bull.png` (recortado das margens, alpha limpo por limiar em
  `Downloads/Gemini_Generated_Image_*.png`, ~27KB, proporção w/h≈1.15).
- Usado EXATAMENTE como está (sem redesenhar): embutido como data URI em
  `LOGO_URI` e aplicado via **CSS mask** (`-webkit-mask/mask` +
  `background-color:currentColor`) — a MESMA imagem recolore sozinha:
  dourada no header/tela-área, azul no chip Corte, rosa no chip Reprodução.
  `ico('logo')` gera o span mascarado (largura = altura×LOGO_ASP). Header
  estático virou `#brandLogo` preenchido no init. admin.html e sw.js (offline)
  embutem o mesmo data URI mascarado. Substitui todos os desenhos SVG de
  boi/chifres anteriores (v22–v26).

## Logo v6: emblema de chifres dramáticos (v26)

- Usuário mandou 2 referências (VectorStock, com marca d'água) pedindo
  réplica EXATA. Expliquei que não posso reproduzir arquivo comercial com
  copyright (nem usar a versão com marca d'água) — ofereci 3 caminhos
  (comprar licença / enviar imagem livre / eu desenhar original); usuário
  escolheu "continuar desenhando do zero".
- Redesenhado com proporção mais próxima das referências: chifres LONGOS e
  dramáticos convergindo no centro (HORNS_PATH) + focinho pequeno tipo gota
  fundido na base (HEAD_PATH, bem menor que a v25 — não é mais uma "cabeça
  redonda", é quase só os chifres). viewBox "0 0 100 80".
- **Isso é interpretação original, não cópia.** Se o usuário quiser o
  arquivo idêntico à referência, só é possível comprando a licença na
  VectorStock e enviando o arquivo sem marca d'água.

## Logo refeito: cabeça de boi de verdade (v25)

- v24 lia como uma folha/garra abstrata (feedback do usuário: "isso se
  parece com a cabeça de um bovino?"). Refeito com HEAD_PATH (cabeça
  arredondada, formato escudo) + HORNS_PATH (2 chifres em crescente grosso
  na base, afinando até a ponta) — agora lê claramente como cabeça de boi
  mesmo em 14px. Testado em vários tamanhos antes de publicar.

## Logo de chifres + cartões de área sem ícone (v24)

- Novo `ico('logo')`: marca do ID-Bov em chifres estilizados (fill
  currentColor, path único `HORNS_PATH`), inspirada em referência do
  usuário — substitui o boi de corpo inteiro no logo do cabeçalho, chip de
  área (Corte e Reprodução usam o MESMO logo agora, não boi/vaca separados),
  tela de escolha de área, admin.html e página offline do SW.
- Cartões "Bovinos de CORTE" / "Bovinos de REPRODUÇÃO" na tela de escolha:
  ícones removidos a pedido do usuário — só título e subtítulo.
- `ico('bull')`/`ico('cow')` (boi/vaca de corpo inteiro, v23) permanecem só
  no cartão do animal sem sexo definido.

## Ícones de boi e vaca (v23)

- Desenhos de LINHA de corpo inteiro (stroke currentColor), refeitos a partir
  das imagens de referência do usuário: `ico('bull')` = BOI com cupim/corcova
  e chifres maiores (estilo Nelore) → Corte; `ico('cow')` = VACA com úbere e
  chifres pequenos → Reprodução. `OX_PATHS`/`COW_PATHS` (multi-path, viewBox
  ~"6 8 100 78", height define o tamanho, largura auto). A v22 usava cabeças
  em silhueta (rejeitadas). Aplicados no chip do cabeçalho (por área), tela de
  área, cartão de animal sem sexo, logo do header, página offline e admin.

## Ícones de touro e vaca (v22)

- `ico('bull')` = cabeça de TOURO (silhueta cheia, fill currentColor, olho
  vazado por fill-rule evenodd) → área de CORTE. `ico('cow')` = cabeça de VACA
  (traço, stroke currentColor) → área de REPRODUÇÃO. Interpretações originais
  em SVG das imagens de referência (as fotos eram stock com marca d'água —
  não reproduzidas). Usados no chip do cabeçalho (por área), tela de escolha
  de área, cartão de animal sem sexo, logo do header, página offline do SW e
  cabeçalho do admin. Substituíram o antigo `ico('boi')` (mantido no dict mas
  sem uso).

## Ícones minimalistas (v19)

- Sem emojis na interface (pedido do usuário): helper `ico(nome, tamanho)`
  gera SVGs de linha fina (stroke 1.9, currentColor, estilo Feather) —
  casa, prancheta, lápis, lixeira, balança, baixar/subir, pessoa, fone,
  nota, boi, nuvem. Toasts são texto puro (sem símbolos decorativos);
  ♂/♀/✓/⌫/← são glifos tipográficos e permaneceram.

## Propriedades (nível principal — v18)

- `propriedades=[{id,nome,proprietario,contato,data}]` (localStorage
  `idbov-props-v1`; ativa em `idbov-prop-atual-v1`; lápides em
  `idbov-props-excluidas-v1`). Animal e manejo ganham `propId`
  (null = grupo "Geral", onde vivem os dados antigos).
- Hierarquia: Propriedade → (área) → Manejos → Animais. TODO escopo é
  área+propriedade ativas (`animaisDaArea()`/`manejosDaArea()` filtram ambos).
- UI: barra 🏡 no topo da home abre `modalProps` (lista com dono/contato/
  contagem, Usar/✏️/🗑, card "Geral") e `modalPropCfg` (nome, proprietário,
  contato — nome obrigatório). Criar propriedade já a seleciona.
- Excluir propriedade: animais/manejos dela vão p/ "Geral" (propId=null);
  lápides sincronizadas (nuvem+cofre) como manejos.
- Excel/CSV: coluna "Propriedade" + linha no Resumo; exporta o contexto
  ativo. Importação: coluna "Propriedade" roteia (cria por nome; "Geral"→null;
  ausente→ativa); dedup de brinco por área+propriedade; manejo por
  nome+área+propriedade. Edição do animal tem select de Propriedade (mover
  desvincula manejo de outra propriedade).

## Áreas: Corte × Reprodução (v16)

- Duas áreas independentes no mesmo app: `area` = 'corte' | 'reproducao'
  (localStorage `idbov-area-v1`; sem campo = 'corte' → migração dos antigos).
- Visual: só o FUNDO muda (decisão do usuário; botões continuam verdes):
  `body.area-corte` azul-claro #E9F2FA, `body.area-reproducao` rosa leve
  #FBEEF3. Chip `#btnArea` no cabeçalho troca de área; 1ª abertura mostra
  `#telaArea` (dois cartões grandes).
- Escopo por área: animais, manejos, contadores, sugestão/duplicidade de
  brinco, manejo automático, Excel/CSV (coluna "Área", arquivo
  id-bov-corte-... / id-bov-reproducao-...), importação (coluna Área roteia;
  sem ela usa a área ativa). Nuvem/cofre levam `area` nos objetos.
- Corte segue o fluxo padrão. Reprodução (v17) tem o campo extra
  **Categoria** (`a.categoria`: 'Primípara' | 'Multípara' | 'Vaca'; vazio se
  pulado) — passo do assistente entre Raça e Idade, toggle no painel do
  manejo, pílulas na edição, cartão, Excel (coluna Categoria + POR CATEGORIA
  no Resumo), CSV, importação (normaliza prim*/mult*/vaca*) e nuvem.
  `camposDefDaArea()` esconde o campo na área de Corte. Mais alterações da
  Reprodução podem vir (usuário especifica aos poucos).

## Campos por manejo (painel do dia — v12)

- Cada manejo tem `campos`: subconjunto de `['sexo','raca','idade','peso','obs']`
  (`camposDoManejo()` devolve TODOS quando ausente — manejos antigos/automáticos).
- Criar/editar manejo = modal `modalManejoCfg` (nome + toggles `.cfg-campo`);
  substituiu os `prompt()`. Desde a v13 o BRINCO também é opcional
  (`m.semBrinco:true` desliga; flag separada p/ compatibilidade com manejos
  antigos) — permite pesagem de lote sem identificação. Validação: pelo menos
  um campo ligado. Animal sem brinco: cartão mostra "— s/ brinco", edição
  aceita brinco vazio (pode ganhar número depois), textos tratam vazio.
- `novoId()` gera ids de animais sem colisão (Date.now podia repetir em
  cadastros rápidos — dois animais com mesmo id, exclusão apagava ambos).
- Assistente: `w.seq = passosAtivos()` (brinco + campos do manejo ativo);
  `avancarPasso()` salva o animal ao fim da sequência (obs desligada ⇒ o
  último passo salva direto). Campos pulados ficam `''`/`null`; cartão usa
  ícone neutro 🐄 e filtra vazios; edição (✏️) completa depois se quiser.
- `campos` sincroniza na nuvem (pull atualiza nome/campos de id existente).

## Manejos (sessões de trabalho — v9)

- `manejos=[{id,nome,data}]` (localStorage `idbov-manejos-v1`; ativo em
  `idbov-manejo-atual-v1`); animal ganha `manejoId`.
- Todo cadastro entra no manejo ATIVO — `garantirManejoAtual()` cria
  "Manejo DD/MM/AAAA" sozinho se não houver (sem interromper o fluxo);
  o assistente mostra o manejo como chip dourado.
- Aba Manejos: "Iniciar novo manejo" (prompt de nome), cards com contagem
  ♂/♀, badge ATIVO, ações "Ver animais" (filtra a aba Animais),
  "Usar neste" (troca o ativo) e renomear. Grupo "Sem manejo" p/ antigos.
- Manejo vai para: nuvem (payload + união por id na mesclagem), cofre IDB,
  Excel (coluna "Manejo" + seção POR MANEJO no Resumo), CSV e importação
  (coluna Manejo reaproveita por nome ou cria).
- Excluir manejo (v15): botão 🗑 no cartão; animais dele vão p/ "Sem manejo"
  (manejoId=null), NUNCA são apagados; lápides em `manejosExcluidos`
  (localStorage `idbov-manejos-excluidos-v1`, nuvem e cofre) impedem
  ressurreição na mesclagem; se era o ativo, o mais recente assume.
  Botão "← Voltar" na barra de filtro retorna à aba Manejos.
- Importação (v10): brinco que JÁ existe não duplica, mas ENTRA no manejo da
  planilha se ainda não tiver um (caso real: 4 dos 61 já existiam e ficaram
  fora do manejo — reimportar o mesmo arquivo resolve). Nunca move animal que
  já está em outro manejo.

## Pesagens (histórico de peso — v7)

- Cada animal tem `pesagens: [{peso, data}]`; o campo `peso` espelha SEMPRE a
  mais recente (`normalizarRebanho()` garante isso e migra animais antigos).
- Botão ⚖️ no cartão → `abrirPesagem(id)`: modal com histórico (data, peso,
  ganho/perda entre pesagens) + teclado compacto (`.keys.compacto`) para
  registrar nova pesagem; toast mostra a diferença desde a última.
- Nuvem: mesclagem une os históricos por data (`puxarEMesclar`) — pesagens
  feitas em aparelhos diferentes não se perdem.
- Excel: aba "Pesagens" (Brinco, Data, Peso, Ganho desde a anterior) e a aba
  Rebanho usa "Peso atual (kg)".

## Exportação (v5)

- **Excel (.xlsx)** via SheetJS (CDN cdnjs, cacheado pelo SW p/ offline):
  `exportarExcel()` gera aba **"Rebanho"** (uma linha por animal — Brinco,
  Sexo, Raça, Idade (categoria), Observação, Data de cadastro) + aba
  **"Resumo"** (totais por sexo/raça/faixa de idade).
- **Decisão do usuário:** valores sempre em LINGUAGEM NATURAL ("Macho",
  "13 a 24 meses"), nunca códigos — para abrir em qualquer plataforma e
  para leitura futura por sistemas de IA.
- Sem internet na 1ª visita (XLSX indefinido): cai no `exportarCSV()`
  (CSV ; separado, BOM UTF-8) com aviso ao usuário.
- SW guarda respostas opacas dos CDNs (`CDN_HOSTS` no sw.js) — Firebase e
  SheetJS funcionam offline após a primeira visita com internet.

## Dados

- `localStorage` chave `idbov-rebanho-v1`:
  `[{ id, brinco, sexo:'M'|'F', raca, idade, obs, data }]`
- `localStorage` chave `idbov-excluidos-v1`: lápides `[ids]` (máx 500) para a
  mesclagem com a nuvem não ressuscitar animais apagados.

## Service Worker (v14) — atualização/tela branca no iPhone

Sintoma real (07/07/2026): PWA instalado no iPhone não recebia atualizações e
abria em TELA BRANCA. Três causas corrigidas — NÃO regredir:
1. `cache.addAll` sem `{cache:'reload'}` repovoava o cache novo com o
   index.html VELHO vindo do cache HTTP do Safari (update nunca chegava).
2. `respondWith` podia rejeitar (cache purgado pelo iOS + rede oscilando na
   abertura) → tela branca até force-close.
3. Cache-first na navegação atrasava o update para a 2ª abertura.
Arquitetura atual: navegação REDE-PRIMEIRO com timeout (4s com cache; 20s sem)
→ fallback cache → fallback página offline amigável (nunca fica sem resposta);
demais recursos cache-first; registro com `updateViaCache:'none'`; `_headers`
com `Cache-Control: no-cache` p/ index.html, sw.js e manifest.

## Proteção de dados (v8) — INCIDENTE REAL em 06/07/2026

Usuário perdeu 47 animais cadastrados offline no curral (restaram só os 6 da
nuvem); recuperou pelo Excel que tinha mandado no WhatsApp. Causa provável:
navegador descartou o storage (link aberto por outro caminho / limpeza do SO).
Proteções implementadas — NÃO REMOVER:

- **Cofre IndexedDB** (`idbov-cofre-v1`): toda gravação vai p/ localStorage +
  cofre; na abertura, `recuperarDoCofre()` UNE os dois (nunca encolhe) antes
  da mesclagem com a nuvem (`onAuthMudou` espera `_cofrePronto`).
- **`navigator.storage.persist()`** pedido no boot.
- **Trava anti-perda no envio**: `empurrarNuvem()` bloqueia se
  `rebanho.length + excluidos.length < _nuvemCount` (nuvem tinha mais).
- **Reenvio insistente**: eventos `online` + `visibilitychange` + intervalo 30s.
- **Importar planilha** (`importarPlanilha`): lê o .xlsx/.csv exportado pelo
  app (abas Rebanho e Pesagens, rótulos em linguagem natural) e recadastra o
  que não existe (dedup por brinco; pesagens dedup por peso±1dia).
- **Linha de status `#syncInfo`** na home: sem conta / aguardando internet /
  nuvem em dia.

## Campo Prenhez (v33)

- Reprodução ganhou o campo **Prenhez** (`a.prenhez`: 'Cheia' | 'Vazia';
  vazio se pulado), espelhando exatamente o padrão do `categoria`:
  const `PRENHEZES=['Cheia','Vazia']`, passo do assistente entre Categoria e
  Idade ("A vaca está cheia ou vazia?"), toggle no painel do manejo, pílulas
  na edição, cartão, Excel (coluna Prenhez + POR PRENHEZ no resumo), CSV,
  importação (normaliza ch*/va*), nuvem/cofre e relatórios (filtro + seção de
  distribuição). `camposDefDaArea()` esconde categoria E prenhez no Corte.

## Protocolo IATF: D0/D8/D10 + Touros (v38)

Reprodução ganhou o fluxo de IATF (inseminação em tempo fixo), inspirado na
planilha do veterinário (lote "43 VACAS CARIMBO 12"): colunas N° (brinco),
D00/D08/D10 (etapas por data), TOURO (sêmen) e DG (Cheia/Vazia = prenhez).

- **Novos campos do animal** (só reprodução; default `''`): `a.d0`, `a.d8`,
  `a.d10` (datas 'AAAA-MM-DD', formato nativo do `<input type=date>`),
  `a.touro` (nome escolhido). Helpers: `hojeISO()`, `fmtDataBR(iso)` (→ dd/mm/aaaa),
  `parseDataISO(cel)` (BR/serial → ISO, usado na importação).
- **CAMPOS_DEF** ganhou `d0`,`d8`,`d10`,`touro` (entre categoria e prenhez).
  `CAMPOS_REPRO=['categoria','d0','d8','d10','touro','prenhez']` — `camposDefDaArea()`
  esconde TODOS eles no Corte. Ordem em CAMPOS_DEF = ordem dos passos do assistente.
- **Touros por manejo**: `m.touros` (array de nomes). Helpers `tourosDoManejo(id)`,
  `addTouro(id,nome)` (dedup case-insensitive), `removeTouro`, `todosTouros()`
  (sugestões de touros já usados). Modal `#modalTouros` (`abrirTouros`/`fecharTouros`/
  `renderTouros`/`salvarTouroNovo`/`reusarTouro`/`excluirTouro`) — cadastra os nomes
  que viram BOTÕES no passo do touro. Acessível do passo touro, da edição e da
  config do manejo (botão "Touros deste manejo (N)" quando reprod + manejo já criado).
- **Assistente**: passos de data (`d0/d8/d10`) com `<input type=date>` +
  "Foi hoje" (`usarHoje`) + "Confirmar" (`confirmarData` guarda em `w[campo]` e
  lembra em `_ultData` p/ repetir no próximo animal — batida em lote no mesmo dia)
  + "pular" (`pularData`). Passo `touro`: botões de `tourosDoManejo(manejoAtualId)`
  + gerenciar + pular. `w` e o reset em `salvarAnimal()` incluem d0/d8/d10/touro
  (datas repetem no próximo animal, touro/prenhez limpam).
- **Fluxo de 3 etapas num só manejo**: usuário volta ao mesmo manejo nos dias
  D0/D8/D10; D8/D10 tardios são preenchidos EDITANDO o animal (modal de edição
  tem 3 date inputs `edD0/edD8/edD10` + botões de touro `#edTouros`).
- **Export/Import/Sync**: Excel (aba Rebanho) e CSV e relatório ganham colunas
  D0/D8/D10/Touro/Prenhez (DG) só na reprodução (datas em dd/mm/aaaa). Importação
  lê de volta (aceita cabeçalhos com/sem sufixo) e re-adiciona o touro ao manejo.
  `empurrarNuvem` serializa d0/d8/d10/touro (animal) e `m.touros` (manejo);
  `puxarEMesclar` mescla `ex.touros`.

## Relatórios (v30)

- Botão "Relatórios" na home (painelAnimais) abre `#telaRelatorio` (tela cheia).
- Config: FILTROS (chips de grupo, "Todos" default) por sexo/raça/idade/
  categoria(reprod)/manejo, aplicados sobre `animaisDaArea()` (já escopado por
  área+propriedade); + SEÇÕES selecionáveis (toggles `.rel-sec`): resumo,
  raça, categoria, idade, peso, manejo, lista.
- `gerarRelatorio()` renderiza cartões com números grandes (`.rel-num`) e
  gráficos de barra (`.rel-bar-*`, contagem+%); helper `_relDist()`.
- Ações: "Compartilhar resumo" (`navigator.share` texto p/ WhatsApp, fallback
  clipboard), "Exportar animais filtrados (Excel)" (SheetJS, só os filtrados),
  "Mudar filtros". `_relAnimaisCache` guarda o conjunto do último relatório.

## Cadastro com dados do cliente (v34)

- "Criar conta nova" abre form `#loginCadastro` com: Primeiro nome, Último
  nome, WhatsApp (com DDD), E-mail (login) e Senha (com olho). `loginCriar()`
  valida os campos, guarda em `_dadosCadastro` e cria a conta; `registrarConta()`
  grava nome/sobrenome/telefone no doc `contas/{uid}` (não muda as regras —
  create só exige bloqueada==false + uid). `alternarVerSenha(inpId,btnId)`
  generalizado; `mostrarCadastro()`/`voltarLogin()` alternam os forms.
- admin.html mostra nome completo, e-mail e WhatsApp (link wa.me clicável) em
  cada ficha de conta — para o dono contatar clientes.

## Login obrigatório + isolamento por conta (v28)

- Porta de login (`#telaLogin`, z-index 200) cobre tudo por padrão; app só
  aparece após autenticar. `onAuthMudou`: com usuário → esconde a porta,
  registra ficha, mescla, renderHome, e se não há área escolhida abre
  `telaArea`. Sem usuário → `mostrarLoginGate()`. Boot mostra "Verificando
  acesso…"; timeout de 2,5s revela o formulário (ou aviso offline se o SDK
  não carregou). `setPersistence(LOCAL)` — sessão fica cacheada, então após
  o 1º login o app abre e funciona OFFLINE no campo.
- **Isolamento por conta** (`OWNER_KEY='idbov-owner-uid'`): se o aparelho tinha
  dados de OUTRO uid, `limparDadosLocais()` apaga rebanho/manejos/props/
  cofre antes de puxar a nuvem — cada cliente só vê o próprio rebanho, mesmo
  em aparelho compartilhado. Usuário existente sem OWNER_KEY é "adotado" (não
  limpa). Logout (`nuvemSair`) → onAuthMudou(null) → porta reaparece.
- Funções: loginEntrar/loginCriar/loginRedefinir (reusam traduzErroAuth). O
  botão ☁️ do header (modalNuvem) segue mostrando conta+sair quando logado.

## Comercialização: painel do dono + contas (v20)

- **admin.html** (`/admin.html`, online-only, fora do fallback de cache do SW):
  painel de gestão de contas no modelo do Colaborador Eficiente. Login
  restrito a `OWNER_EMAILS=['fabriciomarquez.r@gmail.com']`; app Firebase
  NOMEADO `'idbovadmin'` (sessão isolada — regra do usuário). Lista
  `contas/{uid}` (e-mail, criada em, último acesso, nº de animais lido de
  `idbov/{uid}`), com Bloquear/Desbloquear (`bloqueada` via merge).
- **App**: `registrarConta()` no login cria/atualiza a ficha em
  `contas/{uid}` ({email, criadaEm, ultimoAcesso, bloqueada:false});
  se `bloqueada===true` → signOut + aviso. Sem internet → segue local-first.
- **Isolamento por cliente**: cada conta só acessa `idbov/{uid}` próprio
  (regras); o bloqueio é IMPOSTO nas regras (get em contas/{uid}).
- Regras do Firestore precisam do bloco de `contas` + dono (ver seção Nuvem).

## Nuvem (Firebase — opcional, v3)

- **Projeto Firebase PRÓPRIO: `id-bov`** — totalmente independente do
  Colaborador Eficiente (decisão do usuário em 05/07/2026: banco, contas e
  cotas separados; a conta do outro app NÃO funciona aqui). App NOMEADO
  `'idbov'`. Na v2 chegou a usar o projeto `colaborador-eficiente`; trocado
  na v3 antes de existir qualquer dado na nuvem.
- Firestore: coleção `idbov/{uid}` → `{ rebanho:[...], excluidos:[...], email, updatedAt }`.
- **Regras do Firestore** (console do projeto id-bov → Firestore → Regras —
  versão v20, com painel do dono e bloqueio):
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      function ehDono() {
        return request.auth != null &&
          request.auth.token.email in ['fabriciomarquez.r@gmail.com'];
      }
      function contaBloqueada(uid) {
        return exists(/databases/$(database)/documents/contas/$(uid)) &&
          get(/databases/$(database)/documents/contas/$(uid)).data.bloqueada == true;
      }
      match /idbov/{uid} {
        allow read, write: if ehDono() ||
          (request.auth != null && request.auth.uid == uid && !contaBloqueada(uid));
      }
      match /contas/{uid} {
        allow read: if ehDono() || (request.auth != null && request.auth.uid == uid);
        allow create: if request.auth != null && request.auth.uid == uid &&
          request.resource.data.bloqueada == false;
        allow update: if ehDono() || (request.auth != null && request.auth.uid == uid &&
          request.resource.data.bloqueada == resource.data.bloqueada);
        allow delete: if ehDono();
      }
    }
  }
  ```
- Local-first: o app funciona sem conta; botão ☁️ no cabeçalho abre
  login/criar conta/redefinir senha. Ao logar, `puxarEMesclar()` faz união por
  id com lápides; `salvar()` → `agendarSync()` (debounce 1,2s) → `empurrarNuvem()`.
- Trava anti-sobrescrever: `_nuvemOk` só libera gravação após ler a nuvem.
- Sem internet: `_pendente` + listener `online` reenvia; dot no ☁️ mostra
  o estado (cinza deslogado / dourado pendente / verde ok).

## Deploy

- **GitHub:** `git@github.com:fabriciomarquezr-del/id-bov.git` (branch: main)
- **Cloudflare Workers:** `id-bov.fabriciomarquez-r.workers.dev` (conectado ao
  GitHub, deploy automático; config em `wrangler.jsonc`, assets estáticos).
- **Para publicar:** `git add . && git commit -m "mensagem" && git push`
- **Sempre incrementar `CACHE = 'id-bov-vXX'` no sw.js ao publicar** para
  limpar o cache dos aparelhos.
