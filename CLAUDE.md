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

## Nuvem (Firebase — opcional, v3)

- **Projeto Firebase PRÓPRIO: `id-bov`** — totalmente independente do
  Colaborador Eficiente (decisão do usuário em 05/07/2026: banco, contas e
  cotas separados; a conta do outro app NÃO funciona aqui). App NOMEADO
  `'idbov'`. Na v2 chegou a usar o projeto `colaborador-eficiente`; trocado
  na v3 antes de existir qualquer dado na nuvem.
- Firestore: coleção `idbov/{uid}` → `{ rebanho:[...], excluidos:[...], email, updatedAt }`.
- **Regras do Firestore** (console do projeto id-bov → Firestore → Regras):
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /idbov/{uid} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
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
