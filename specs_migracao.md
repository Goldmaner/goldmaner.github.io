# Especificação de Migração: WPF → HTML/PWA

## 1. Objetivo
Reescrever o "Demonstrativo de Aferição de Remanejamento Orçamentário" como aplicação web local
(HTML + CSS + JS puro) com suporte a PWA (Progressive Web App) para funcionar offline e ser
instalável como ícone na Área de Trabalho.

## 2. Stack de Destino
- **HTML5** + **CSS3** + **JavaScript ES2020** (sem frameworks, sem build step)
- **PWA**: `manifest.json` + `sw.js` (service worker para cache offline)
- **Hospedagem**: GitHub Pages (HTTPS gratuito) ou arquivo `.html` por e-mail/pen drive
- **Persistência**: `localStorage` (auto-save) + download/upload de `.daf.json`

## 3. Estrutura de Arquivos
```
DemonstrativoAfericaohtml/
├── index.html          ← Aplicação completa (HTML + CSS inline + JS inline)
├── manifest.json       ← Metadados PWA (nome, ícone, cor, display: standalone)
├── sw.js               ← Service Worker (cache offline dos 3 arquivos)
└── specs_migracao.md   ← Este documento
```

## 4. Schema JSON (.daf.json) — Retrocompatível com WPF
```json
{
  "Version": 1,
  "Header": {
    "NomeOSC": "string",
    "NomeProjeto": "string",
    "NumeroTermo": "string",
    "ProcessoSEI": "string",
    "ValorTotalPrevisto": 0.00,
    "ValorTotalRepassado": 0.00,
    "ValorAplicacao": 0.00,
    "DataInicio": "2025-01-01T00:00:00",
    "DataFim": "2026-12-31T00:00:00"
  },
  "Items": [
    {
      "Id": "guid-string",
      "ElementoDespesa": "Pessoal",
      "Quantidade": 1,
      "ItemDespesa": "Descrição do item",
      "ValoresPrevisto": [0.00, 0.00, ...],
      "ValoresExecutado": [0.00, 0.00, ...],
      "Justificativas": ["", "", ...]
    }
  ],
  "Historico": []
}
```

## 5. Mapeamento de Abas (WPF → HTML)
| # | Aba WPF             | Equivalente HTML                     |
|---|---------------------|--------------------------------------|
| 1 | Cabeçalho           | Formulário com 9 campos              |
| 2 | Instruções          | Seção com blocos coloridos            |
| 3 | Conciliação Bancária| Placeholder (seção futura)            |
| 4 | Previsto            | Tabela editável com scroll horizontal |
| 5 | Executado           | Tabela editável, espelha Previsto     |
| 6 | % de Alteração      | Tabela somente leitura, calculada     |

## 6. Regras de Negócio (traduzidas de C#)

### 6.1 Cálculos
- **PRA(item, mês)** = max(0, (VEI[mês] - VPI[mês]) / VTP)
- **PA** = Σ PRA de todos os itens e todos os meses
- **Autonomia**: PA ≤ 15% → verde; PA > 15% → vermelho (requer Termo Aditivo)

### 6.2 Validações
- Total executado ≤ Valor Repassado + Rendimentos
- Total previsto ≤ VTP
- Item zerado (exec = 0, prev > 0) → alerta de vedação de exclusão
- Overrun por célula: exec[mês] > prev[mês] → destaque amarelo

### 6.3 Elementos de Despesa (dropdown fixo)
1. Pessoal
2. Materiais
3. Administrativas
4. Serviços de Terceiros
5. Outras Despesas
6. Imobilizado
7. Implantação

## 7. Funcionalidades de UI

### 7.1 Tabelas de meses
- Colunas geradas dinamicamente a partir de DataInicio/DataFim
- Sem paginação — scroll horizontal nativo
- Labels: "Jan/2025", "Fev/2025", ..., "Dez/2026"
- Coluna Total (soma da linha) no final, somente leitura

### 7.2 Ações de linha (Previsto)
- Adicionar item (no final)
- Inserir acima (da linha selecionada)
- Mover para cima / baixo
- Remover selecionado
- Linha mantém seleção após mover/inserir

### 7.3 Ações de linha (Executado)
- Adicionar "Só Executado" (linha verde, não existe em Previsto)
- Remoção **não** permitida na aba Executado
- Campos de Elemento/Qtd/Item são read-only (vêm do Previsto)
- Campos de meses são editáveis

### 7.4 Colar do Excel (Ctrl+V)
- Detecta Tab-Separated Values (TSV) do clipboard
- Distribui por linhas e colunas a partir da célula selecionada
- Aceita separador decimal vírgula (pt-BR) e ponto (en-US)
- Colunas texto (Elemento, Qtd, Item) = colar literal; colunas de meses = parse numérico

### 7.5 Persistência
- **localStorage**: auto-save a cada mudança → restauração ao reabrir
- **Salvar**: download de arquivo `.daf.json`
- **Abrir**: `<input type="file" accept=".json">` → popula todos os campos
- **Salvar Como**: download com nome diferente

### 7.6 Exportação
- **PDF**: `window.print()` + CSS `@media print` com `@page { size: A4 landscape }`
- **CSV**: gera 3 CSVs (Previsto, Executado, Alteração) empacotados como downloads separados

## 8. PWA
- `manifest.json`: name, short_name, icons, display: "standalone", theme_color: "#1565C0"
- `sw.js`: estratégia cache-first para os 3 arquivos estáticos
- Registro do SW no final do `<script>` em index.html

## 9. Design / Paleta de Cores
- Primária: `#1565C0` (azul)
- Salvar: `#43A047` (verde)
- Alerta: `#FFEB3B` (amarelo)
- Erro: `#E53935` (vermelho)
- Fundo: `#FAFAFA`
- Header aba ativa: `#1565C0` com texto branco
- Executado-only row: `#E8F5E9` (verde claro)
- Overrun cell: `#FFEB3B` (amarelo)
- PRA > 0 cell: `#FFF9C4` (amarelo claro)
- Print: fundo branco, bordas em cinza, sem sombras

## 10. Formato de Números
- Locale: pt-BR
- Valores monetários: `R$ 1.234,56` (exibição), input aceita `1234.56` ou `1.234,56`
- Percentuais: `12,50%`
