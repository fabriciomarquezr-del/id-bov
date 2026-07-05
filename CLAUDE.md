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
- Sem nuvem por enquanto (dados ficam só no aparelho).

## Deploy

- Ainda sem repositório remoto/hospedagem. Quando publicar, seguir o mesmo
  padrão do cochos-sal (GitHub + Cloudflare Workers com deploy automático).
- **Sempre incrementar `CACHE = 'id-bov-vXX'` no sw.js ao publicar.**
