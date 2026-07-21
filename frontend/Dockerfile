FROM node:20-alpine

WORKDIR /app

# Copy dependency packages
COPY package*.json ./
RUN npm install

# Copy frontend source files
COPY . .

EXPOSE 5173

# Launch Vite development server bound to all network interfaces
CMD ["npm", "run", "dev", "--", "--host"]
