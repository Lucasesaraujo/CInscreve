# 📌 CInscreve

O **CInscreve** é uma plataforma para **captação de editais**, permitindo que usuários encontrem, filtrem e salvem oportunidades relevantes.  
O projeto é desenvolvido com **arquitetura fullstack** utilizando **Node.js + MongoDB** no backend e **React + TailwindCSS** no frontend.

---

## 🚀 Arquitetura do Projeto

O sistema segue uma arquitetura **cliente-servidor**:

- **Frontend (React + TailwindCSS)**
  - Interface responsiva e moderna
  - Consome a API REST do backend
  - Carrossel de editais em destaque
  - Proteção de rotas autenticadas

- **Backend (Node.js + Express + MongoDB)**
  - API RESTful
  - Conexão com **MongoDB Atlas** via Mongoose
  - Autenticação com **JWT (Access + Refresh Token)**
  - Proteção contra excesso de requisições (**Rate Limiting**)
  - Testes automatizados com **Jest + Supertest**

- **Banco de Dados (MongoDB Atlas)**
  - Entidade `user` para autenticação e favoritos
  - Entidade `edital` para armazenar os dados dos editais
  - Tokens de sessão em coleção separada

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**
  - React
  - TailwindCSS
  - Shadcn/UI
  - Axios

- **Backend**
  - Node.js
  - Express
  - Mongoose
  - JSON Web Token (JWT)
  - Bcrypt
  - Express-rate-limit
  - Jest + Supertest (testes)

- **Banco de Dados**
  - MongoDB Atlas

---

## 🔑 Fluxo de Autenticação

1. Usuário envia **email** e **password**
2. API retorna **Access Token** e **Refresh Token**
3. Access Token protege rotas privadas
4. Refresh Token é armazenado em coleção separada
5. Caso o Access Token expire, o Refresh Token gera um novo

---

## 🧪 Testes Automatizados

- Rodados com **Jest + Supertest**
- Testam rotas críticas:
  - `/auth/login` (autenticação)
  - `/editais` (listagem)
  - Rotas protegidas (favoritar edital, etc.)

Exemplo de execução:
```bash
cd backend
npm test