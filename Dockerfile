FROM node:20.12.0

WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

RUN npm ci

# Copy the remaining project files
COPY . .

USER node

CMD ["npm", "start"]
