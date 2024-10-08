FROM node:latest

RUN npm install --global nodemon
# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN   npm install 
# Bundle app source
COPY . /server

EXPOSE 3000
CMD [ "npm", "run", "dev" ]