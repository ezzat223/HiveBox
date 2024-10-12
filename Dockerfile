FROM node:14-alpine

WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

RUN npm install

# Copy the remaining project files
COPY . .

CMD ["npm", "start"]
