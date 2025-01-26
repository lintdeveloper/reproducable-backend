FROM node:18.16.0
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY medusa-config.js .
COPY . .
RUN apt-get update
RUN apt-get install -y python
RUN npm install -g npm@latest
RUN npm install -g @medusajs/medusa-cli
RUN npm install
EXPOSE 9000
CMD ["medusa", "start"]