
FROM node:18

WORKDIR /app/neo

COPY package*.json ./

COPY . /app/neo/

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]