# === ESTÁGIO 1: CONSTRUÇÃO DA APLICAÇÃO REACT ===
# Usa uma imagem Node.js como base para o build
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências e constrói a aplicação
RUN npm install
COPY . .
RUN npm run build

# === ESTÁGIO 2: SERVIDOR NGINX PARA SERVIR OS ARQUIVOS ===
# Usa uma imagem Nginx oficial como base
FROM nginx:stable-alpine

# Copia os arquivos de build do estágio anterior para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia um arquivo de configuração Nginx personalizado (criaremos no próximo passo)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta padrão do Nginx
EXPOSE 80

# O Nginx já vem com um comando padrão para iniciar, então não precisamos de CMD aqui.