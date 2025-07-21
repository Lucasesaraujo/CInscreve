ADR-001: Escolha do Framework de Backend (Express.js)
Status: Aprovado
Data: 22/05/2025
Contexto
Para o desenvolvimento do backend do Cinscreve, era necessária a escolha de um framework para Node.js que nos permitisse construir uma API RESTful de forma eficiente. Os requisitos eram: ser leve, ter uma curva de aprendizagem suave para a equipe, ser flexível para permitir a criação de uma estrutura modular (rotas, controllers, services) e ter um ecossistema robusto com bom suporte da comunidade para resolver problemas futuros.
Decisão
Decidimos utilizar o Express.js como o nosso framework de servidor HTTP e roteamento. A sua abordagem minimalista e o seu sistema de middleware são ideais para a arquitetura em camadas que estamos a construir, permitindo-nos adicionar funcionalidades como autenticação e rate limiting de forma modular.
Consequências
Positivas:
Simplicidade e Leveza: Express.js não impõe uma estrutura rígida, dando-nos a liberdade de definir a nossa própria arquitetura de pastas e ficheiros.
Grande Comunidade: Sendo um dos frameworks mais populares para Node.js, existe uma vasta quantidade de documentação, tutoriais e soluções para problemas comuns, o que facilita o suporte e o desenvolvimento.
Ecossistema de Middleware: A sua arquitetura baseada em middleware facilita a adição de funcionalidades de forma modular e desacoplada, como o cors, autenticação com JWT e gestão de requisições.
Roteamento Eficiente: Facilita a criação de rotas claras e organizadas, separando as responsabilidades da API.
Negativas:
Não Opinativo: A sua flexibilidade pode ser uma desvantagem se a equipa não tiver uma convenção de arquitetura clara, podendo levar a inconsistências no código.
Escalabilidade Manual: Para projetos de grande escala, é necessário adicionar manualmente outras bibliotecas para tarefas como validação, gestão de configuração e ORM/ODM, enquanto outros frameworks já podem vir com estas ferramentas integradas.

ADR-002: Escolha da Base de Dados (MongoDB Atlas + Mongoose)
Status: Aprovado
Data: 02/06/2025
Contexto
A aplicação Cinscreve necessitava de uma solução de base de dados para persistir os dados de editais, utilizadores e outras entidades. Os requisitos eram: flexibilidade para lidar com estruturas de dados que podem evoluir (como os campos de um edital), boa performance para consultas, facilidade de configuração e manutenção, e um custo inicial baixo.
Decisão
Decidimos adotar o MongoDB Atlas como a nossa plataforma de base de dados NoSQL na nuvem e o Mongoose como a nossa biblioteca de ODM (Object Data Modeling) para interagir com a base de dados a partir da aplicação Node.js.
Consequências
Positivas:
Flexibilidade de Schema: Como uma base de dados NoSQL, o MongoDB permite-nos armazenar documentos JSON (BSON) com estruturas flexíveis, o que é ideal para os nossos modelos de Edital e User.
Facilidade de Uso (Cloud): O MongoDB Atlas elimina a necessidade de instalar e gerir uma base de dados localmente, oferecendo um tier gratuito que é perfeito para o desenvolvimento e fases iniciais do projeto.
Estrutura com Mongoose: O Mongoose adiciona uma camada de estrutura sobre o MongoDB, permitindo-nos definir Schemas para os nossos dados, aplicar validações (como campos obrigatórios e datas válidas) e interagir com a base de dados de uma forma mais segura e orientada a objetos.
Boa Performance: O MongoDB é conhecido pela sua boa performance em operações de leitura e escrita, o que é benéfico para a nossa aplicação.
Negativas:
Menos Adequado para Dados Relacionais: Para dados com relações muito complexas que exigiriam JOINs em SQL, o MongoDB pode tornar as consultas mais complicadas.
Consistência de Dados: A flexibilidade do NoSQL exige uma disciplina maior por parte da equipa para garantir a consistência dos dados, embora o Mongoose ajude a mitigar este risco.


ADR-003: Estratégia de Autenticação com JWT
Status: Aprovado
Data: 03/07/2025
Contexto
A nossa API necessitava de um mecanismo para proteger rotas que só deveriam ser acessíveis por utilizadores autenticados (ex: criar ou validar um edital). A solução precisava de ser segura, sem estado (stateless) para facilitar a escalabilidade e compatível com o nosso cliente web em React, protegendo contra vulnerabilidades comuns como Cross-Site Scripting (XSS).
Decisão
Decidimos implementar um sistema de autenticação e autorização baseado em JSON Web Tokens (JWT). Após o login bem-sucedido, o backend gera um token JWT assinado e envia-o para o frontend, não no corpo da resposta, mas sim dentro de um cookie seguro (HttpOnly, Secure, SameSite=Strict). O navegador, então, anexa este cookie automaticamente a cada requisição subsequente para o mesmo domínio. Um middleware de autenticação no backend (authMiddleware.js) é responsável por extrair o token do cookie e validar a sua autenticidade.
Consequências
Positivas:
Segurança Reforçada contra XSS: Ao usar um cookie com a flag HttpOnly, o token não pode ser acedido por scripts do lado do cliente (JavaScript), o que mitiga significativamente o risco de ataques XSS que visam roubar o token.
Implementação Simplificada no Frontend: O navegador gere o envio do token automaticamente em cada requisição, eliminando a necessidade de o frontend ter uma lógica para anexar o cabeçalho Authorization.
Stateless: A arquitetura continua a ser stateless, pois o servidor não armazena o estado da sessão, mantendo os benefícios de escalabilidade.
Padrão Robusto: A combinação de JWT com cookies seguros é um padrão de mercado robusto para a autenticação de SPAs (Single-Page Applications).
Negativas:
Proteção contra CSRF: Esta abordagem requer uma proteção explícita contra ataques de Cross-Site Request Forgery (CSRF), uma vez que os cookies são enviados automaticamente pelo navegador. É necessário implementar uma estratégia de mitigação, como o uso de tokens anti-CSRF.
Configuração de CORS: Requer uma configuração cuidadosa do CORS (Cross-Origin Resource Sharing) no backend para permitir que o navegador envie cookies de um domínio do frontend para um domínio do backend, especialmente se forem diferentes.

ADR-004: Estrutura do Frontend com React e Vite
Status: Aprovado
Data: 22/05/2025
Contexto
Para a interface do utilizador do Cinscreve, precisávamos de uma solução que permitisse a criação de uma Single-Page Application (SPA) moderna, interativa e manutenível. Os requisitos eram: uma arquitetura baseada em componentes para reutilização de código, um bom ecossistema de bibliotecas e uma experiência de desenvolvimento rápida e eficiente.
Decisão
Decidimos utilizar a biblioteca React para construir a nossa interface de utilizador, adotando uma arquitetura baseada em componentes funcionais e Hooks. Para o ambiente de desenvolvimento e build, escolhemos o Vite, uma ferramenta moderna que oferece um servidor de desenvolvimento extremamente rápido.
Consequências
Positivas:
Componentização: O React permite-nos quebrar a UI em componentes isolados e reutilizáveis (como Card, Botao, Header), o que torna o desenvolvimento mais organizado, rápido e fácil de manter.
Ecossistema Robusto: O React tem um ecossistema vasto de bibliotecas para roteamento, gestão de estado, UI kits, etc.
Performance do Vite: O Vite oferece uma experiência de desenvolvimento superior com Hot Module Replacement (HMR) quase instantâneo, o que acelera significativamente o ciclo de feedback durante a codificação.
JSX: A sintaxe JSX facilita a escrita de componentes que misturam lógica de JavaScript com marcação de HTML de forma declarativa e intuitiva.
Negativas:
Curva de Aprendizagem: Para novos programadores, conceitos do React como Hooks, gestão de estado e o ciclo de vida dos componentes podem ter uma curva de aprendizagem.
Opinião sobre Estrutura: O React é uma biblioteca, não um framework, o que significa que a equipa precisa de tomar decisões sobre a estrutura de pastas, roteamento e gestão de estado.

ADR-005: Estratégia de Estilização com Tailwind CSS
Status: Aprovado
Data: 05/06/2025
Contexto
Precisávamos de uma abordagem de estilização para o nosso frontend em React que fosse rápida, consistente e que evitasse a proliferação de ficheiros CSS customizados difíceis de manter. A solução deveria permitir a prototipagem rápida de interfaces e garantir que todos os componentes sigam um sistema de design coeso.
Decisão
Decidimos adotar o Tailwind CSS, um framework CSS utility-first. Em vez de escrevermos CSS customizado, aplicamos classes de utilidade predefinidas diretamente no nosso JSX. A configuração do Tailwind (tailwind.config.js) permite-nos customizar o nosso sistema de design (cores, espaçamentos, fontes) para corresponder à identidade visual do Cinscreve.
Consequências
Positivas:
Desenvolvimento Rápido: A estilização é feita diretamente no HTML/JSX, o que elimina a necessidade de alternar entre ficheiros e acelera muito o desenvolvimento da UI.
Consistência Visual: Como todas as classes são baseadas num sistema de design configurável, a interface mantém-se consistente em toda a aplicação.
Componentes Auto-contidos: Os estilos de um componente estão contidos no seu próprio ficheiro, tornando-os mais portáteis e fáceis de refatorar.
Performance: O Tailwind remove automaticamente as classes não utilizadas durante o processo de build, resultando num ficheiro CSS final muito pequeno.
Negativas:
Verbosidade no HTML/JSX: A lista de classes nos elementos pode tornar-se longa e, para alguns programadores, pode parecer "poluída" visualmente.
Curva de Aprendizagem: Requer uma mudança de mentalidade em relação à escrita de CSS tradicional e um conhecimento das classes de utilidade disponíveis.