
FROM node:22-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build


# ---- ESTÁGIO 2: Servidor de Produção com Node.js ----
# (Aqui está a mágica!)
FROM node:22-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala o 'serve' globalmente. É um servidor estático super leve.
RUN npm install -g serve

# Copia APENAS o resultado final da  "oficina" (a pasta 'dist')
# do estágio anterior para a pasta atual.
COPY --from=builder /app/dist .


EXPOSE 5002

# Comando para iniciar o servidor, FORÇANDO ele a usar a porta 3007
# É exatamente a sua sugestão!
CMD ["serve", "-s", ".", "-l", "5002"]