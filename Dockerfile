FROM node:20.12.0

WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

RUN npm install

# Copy the remaining project files
COPY . .

CMD ["npm", "start"]
