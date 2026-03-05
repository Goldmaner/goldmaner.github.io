# Painel do Demonstrativo de Aferição

> Ferramenta web para controle e documentação de remanejamentos orçamentários em parcerias entre OSCs e Unidades Gestoras públicas (Lei 13.019/2014).

🔗 **Acesso direto:** [https://goldmaner.github.io](https://goldmaner.github.io)

---

## O que é

O **Demonstrativo de Aferição de Remanejamento Orçamentário** calcula automaticamente o **PA (Percentual Acumulado)** de alterações entre valores previstos e executados, indicando se a execução está dentro do limite de autonomia de **15% sobre o VTP** (Valor Total da Parceria).

### Funcionalidades

- **Cabeçalho** — OSC, projeto, número do termo, processo SEI, VTP, valor repassado, rendimentos e período
- **Previsto** — plano orçamentário por item de despesa e mês; reordenação de linhas; colar do Excel
- **Executado** — lança valores realizados; destaca extrapolações em amarelo; suporte a despesas não previstas
- **% de Alteração** — calcula PRA célula a célula e PA total com semáforo de 15%
- **Conciliação Bancária** — seção reservada para registros futuros
- **Exportar PDF** — impressão por seção com divisão automática de colunas (projetos com muitos meses)
- **Exportar CSV** — 3 arquivos (Previsto, Executado, % Alteração) compatíveis com Excel
- **Auto-save** — rascunho automático no navegador; salvo definitivamente em `.daf.json`
- **PWA** — instala no computador/celular, funciona offline

---

## Como usar

1. Abra [https://goldmaner.github.io](https://goldmaner.github.io) no navegador (Chrome ou Edge recomendados)
2. Leia a aba **1. Instruções** antes de começar
3. Preencha o **2. Cabeçalho** com os dados da parceria
4. Lance o orçamento em **4. Previsto** e os gastos em **5. Executado**
5. Consulte **6. % de Alteração** para verificar o PA acumulado
6. Salve com **SALVAR** (gera um arquivo `.daf.json`) — guarde este arquivo

---

## Formato de arquivo

Os projetos são salvos em `.daf.json`:

```json
{
  "Version": 1,
  "Header": { "NomeOSC": "...", "NomeProjeto": "...", "NumeroTermo": "...", "ProcessoSEI": "...",
               "ValorTotalPrevisto": 0, "ValorTotalRepassado": 0, "ValorAplicacao": 0,
               "DataInicio": "YYYY-MM-DD", "DataFim": "YYYY-MM-DD" },
  "Items": [
    { "Id": 1, "ElementoDespesa": "Pessoal", "Quantidade": 1, "ItemDespesa": "Coordenador",
      "ValoresPrevisto": [0, ...], "ValoresExecutado": [0, ...], "Justificativas": ["", ...] }
  ],
  "Historico": []
}
```

---

## Tecnologia

| Item | Detalhe |
|------|---------|
| Stack | HTML + CSS + JavaScript ES2020 puro |
| Dependências externas | **nenhuma** |
| Tamanho | ~1 arquivo `index.html` |
| Hospedagem | GitHub Pages (gratuito, HTTPS automático) |
| Offline | Service Worker (cache-first) |
| Instalação | PWA — instala direto do navegador |

---

## Desenvolvimento local

```bash
# Clone
git clone https://github.com/Goldmaner/goldminer.github.io.git
cd goldminer.github.io

# Servidor local (qualquer um serve)
python -m http.server 8899
# acesse http://localhost:8899
```

---

## Licença

Uso interno — Gestão de Parcerias OSC.
