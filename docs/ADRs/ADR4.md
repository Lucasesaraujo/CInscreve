# ADR-004: Estrutura do Frontend com React e Vite

**Status:** Aprovado  
**Data:** 22/05/2025

## Contexto
A UI do Cinscreve precisava de uma SPA moderna e modular. Buscávamos componentização, bom ecossistema e alta produtividade.

## Decisão
Escolhemos React com componentes funcionais e Hooks. Utilizamos Vite como ferramenta de desenvolvimento e build.

## Consequências

**Positivas:**
- **Componentização:** UI modular com reutilização de componentes.
- **Ecossistema Robusto:** Muitas bibliotecas complementares.
- **Performance com Vite:** HMR rápido e experiência fluida.
- **JSX:** Integração intuitiva entre lógica e marcação.

**Negativas:**
- **Curva de Aprendizagem:** Hooks e ciclo de vida podem ser desafiadores para iniciantes.
- **Decisões Arquiteturais:** React exige escolhas manuais para estrutura e ferramentas.

---