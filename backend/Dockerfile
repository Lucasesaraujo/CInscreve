# Usa uma imagem Node.js oficial como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração de dependências
COPY package*.json ./

# Instala as dependências do backend
RUN npm install

# Copia o restante do código-fonte do backend
COPY . .

# Expõe a porta em que a aplicação Express será executada
EXPOSE 3000

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["npm", "start"]