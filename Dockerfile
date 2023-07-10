
FROM node:18

WORKDIR /neo

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "start" ]