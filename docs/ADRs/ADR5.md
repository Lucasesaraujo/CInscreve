# ADR-005: Estratégia de Estilização com Tailwind CSS

**Status:** Aprovado  
**Data:** 05/06/2025

## Contexto
Queríamos uma estilização rápida, consistente e manutenível no frontend. Precisávamos evitar CSS customizado excessivo e facilitar a prototipagem.

## Decisão
Adotámos o Tailwind CSS, aplicando classes utilitárias diretamente no JSX. A configuração foi customizada para seguir a identidade visual do projeto.

## Consequências

**Positivas:**
- **Desenvolvimento Rápido:** Estilo aplicado diretamente no componente.
- **Consistência Visual:** Baseado em sistema de design centralizado.
- **Componentes Auto-contidos:** Mais fáceis de reutilizar e refatorar.
- **Performance:** CSS final pequeno com remoção de classes não usadas.

**Negativas:**
- **Verbosidade no JSX:** Muitas classes podem poluir visualmente o código.
- **Curva de Aprendizagem:** Exige nova mentalidade em relação ao CSS tradicional.

---