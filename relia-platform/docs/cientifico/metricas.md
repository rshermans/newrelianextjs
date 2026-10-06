# Métricas de Avaliação

> Métricas alinhadas com as hipóteses de investigação e recolhidas automaticamente pela plataforma.

## 1. Métricas de Aprendizagem

| Métrica | Fonte | Descrição |
|---------|-------|-----------|
| Progressão de nível (Bloom) | `checkpoints` | Nível máximo atingido por obra e leitor |
| Pontos acumulados | `checkpoints` | Soma de `nota_llm` por roteiro |
| Fração de acerto | `checkpoints` | `nota / pontos_maximos` por pergunta |
| Tendência (OLS) | calculado | Regressão linear sobre os últimos N pontos (n≥5, ±0.10) |
| Diversidade de estratégias | `checkpoints` | Número de estratégias distintas respondidas |
| Taxa de reescrita | `reescritas` | Proporção de respostas reescritas com melhoria |

## 2. Métricas Linguísticas

| Métrica | Fonte | Descrição |
|---------|-------|-----------|
| MATTR | `domain/linguistica.ts` | Moving Average Type-Token Ratio (diversidade lexical) |
| Marcadores discursivos | léxicos do anexo | Contagem de conetores, modalizadores, etc. |
| Cobertura lexical | ficha da obra | Proporção de termos da ficha usados nas respostas |

## 3. Métricas de Usabilidade

| Métrica | Fonte | Descrição |
|---------|-------|-----------|
| SUS Score | `inquerito` | System Usability Scale (22 itens) |
| NPS | `inquerito` | Net Promoter Score |
| Tempo por sessão | `logs_uso` | Duração das sessões de leitura |

## 4. Métricas de Engagement

| Métrica | Fonte | Descrição |
|---------|-------|-----------|
| Mensagens de chat | `chat_messages` | Volume e frequência de interação |
| Pontos de Reflexão respondidos | `checkpoints` | Volume e frequência |
| Dias de leitura | `checkpoints`, `chat_messages` | Dias distintos com atividade |
| Retenção | `logs_uso` | Proporção de utilizadores que regressam |

## 5. Métricas de IA

| Métrica | Fonte | Descrição |
|---------|-------|-----------|
| Tokens consumidos | `uso_llm` | Entrada e saída por funcionalidade |
| Custo estimado | `uso_llm` | Calculado com `PRICE_IN/OUT_PER_M` |
| Taxa de sucesso | `uso_llm` | Proporção de chamadas bem-sucedidas |
| Latência | `uso_llm` | Duração média das chamadas |
