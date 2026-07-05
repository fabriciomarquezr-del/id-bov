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

Tela inicial: lista do rebanho, contadores (total/♂/♀), excluir, exportar CSV.

## Dados

- `localStorage` chave `idbov-rebanho-v1`:
  `[{ id, brinco, sexo:'M'|'F', raca, idade, obs, data }]`
- `localStorage` chave `idbov-excluidos-v1`: lápides `[ids]` (máx 500) para a
  mesclagem com a nuvem não ressuscitar animais apagados.

## Nuvem (Firebase — opcional, v2)

- **Mesmo projeto Firebase do Colaborador Eficiente** (`colaborador-eficiente`)
  → a mesma conta/e-mail funciona nos dois apps. App NOMEADO `'idbov'`
  (sessão isolada, regra do usuário: nunca autenticar no app padrão).
- Firestore: coleção `idbov/{uid}` → `{ rebanho:[...], excluidos:[...], email, updatedAt }`.
- **Regras do Firestore precisam do bloco** (console → Firestore → Regras):
  ```
  match /idbov/{uid} {
    allow read, write: if request.auth != null && request.auth.uid == uid;
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
