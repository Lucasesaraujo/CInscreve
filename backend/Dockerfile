# Usa uma imagem Node.js oficial como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia apenas os arquivos de dependência para aproveitar cache de build
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Expõe a porta do backend (ajuste se for diferente)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
