# ADR-001: Escolha do Framework de Backend (Express.js)

**Status:** Aprovado  
**Data:** 22/05/2025

## Contexto
Para o desenvolvimento do backend do Cinscreve, era necessária a escolha de um framework para Node.js que nos permitisse construir uma API RESTful de forma eficiente. Os requisitos eram: ser leve, ter uma curva de aprendizagem suave para a equipe, ser flexível para permitir a criação de uma estrutura modular (rotas, controllers, services) e ter um ecossistema robusto com bom suporte da comunidade para resolver problemas futuros.

## Decisão
Decidimos utilizar o Express.js como o nosso framework de servidor HTTP e roteamento. A sua abordagem minimalista e o seu sistema de middleware são ideais para a arquitetura em camadas que estamos a construir, permitindo-nos adicionar funcionalidades como autenticação e rate limiting de forma modular.

## Consequências

**Positivas:**
- **Simplicidade e Leveza:** Express.js não impõe uma estrutura rígida, dando-nos a liberdade de definir a nossa própria arquitetura de pastas e ficheiros.
- **Grande Comunidade:** Sendo um dos frameworks mais populares para Node.js, existe uma vasta quantidade de documentação, tutoriais e soluções para problemas comuns.
- **Ecossistema de Middleware:** Facilita a adição de funcionalidades como `cors`, autenticação com JWT e gestão de requisições.
- **Roteamento Eficiente:** Facilita a criação de rotas claras e organizadas.

**Negativas:**
- **Não Opinativo:** Pode levar a inconsistências no código se a equipa não seguir convenções.
- **Escalabilidade Manual:** É necessário adicionar manualmente bibliotecas para tarefas como validação, configuração e ORM/ODM.

---