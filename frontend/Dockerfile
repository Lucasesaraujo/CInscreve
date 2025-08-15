# === ESTÁGIO 1: BUILD DA APLICAÇÃO ===
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas arquivos de dependência para aproveitar cache
COPY package*.json ./

# Instala as dependências (npm install como você pediu)
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta usada pelo Nginx
EXPOSE 5173

CMD ["npm", "start"]