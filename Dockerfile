
FROM node:18

WORKDIR /neo

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD [ "npm", "start" ]