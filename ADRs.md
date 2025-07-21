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

# ADR-002: Escolha da Base de Dados (MongoDB Atlas + Mongoose)

**Status:** Aprovado  
**Data:** 02/06/2025

## Contexto
A aplicação Cinscreve necessitava de uma solução de base de dados para persistir os dados de editais, utilizadores e outras entidades. Os requisitos eram: flexibilidade para lidar com estruturas de dados que podem evoluir, boa performance, facilidade de configuração e manutenção, e baixo custo inicial.

## Decisão
Adotámos o MongoDB Atlas como plataforma NoSQL em nuvem e o Mongoose como biblioteca ODM para interação com a base de dados em Node.js.

## Consequências

**Positivas:**
- **Flexibilidade de Schema:** Ideal para os modelos Edital e User.
- **Facilidade de Uso (Cloud):** O tier gratuito do Atlas é ideal para desenvolvimento.
- **Estrutura com Mongoose:** Permite definir schemas, aplicar validações e acessar os dados de forma segura.
- **Boa Performance:** Rápido em operações de leitura e escrita.

**Negativas:**
- **Menos Adequado para Dados Relacionais:** JOINs são complexos.
- **Consistência de Dados:** Requer disciplina, apesar da ajuda do Mongoose.

---

# ADR-003: Estratégia de Autenticação com JWT

**Status:** Aprovado  
**Data:** 03/07/2025

## Contexto
A API precisava proteger rotas restritas com uma solução segura, stateless e compatível com SPAs em React. Era necessário prevenir vulnerabilidades como XSS.

## Decisão
Implementamos autenticação baseada em JWT, com o token enviado em cookies seguros (HttpOnly, Secure, SameSite=Strict). O middleware `authMiddleware.js` valida o token a cada requisição.

## Consequências

**Positivas:**
- **Segurança Reforçada contra XSS:** Tokens inacessíveis via JavaScript.
- **Frontend Simplificado:** Cookies são enviados automaticamente.
- **Stateless:** Facilita a escalabilidade.
- **Padrão Robusto:** Abordagem compatível com SPAs modernas.

**Negativas:**
- **Proteção contra CSRF:** Requer tokens anti-CSRF.
- **Configuração de CORS:** Requer configuração detalhada entre domínios.

---

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