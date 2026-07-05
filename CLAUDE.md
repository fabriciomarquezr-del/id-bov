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
5. **Observação** — pergunta Sim/Não; "Não" salva e volta direto ao teclado do
   próximo animal; "Sim" abre campo de texto.

Tela inicial: lista do rebanho, contadores (total/♂/♀), excluir, exportar.

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
