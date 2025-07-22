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