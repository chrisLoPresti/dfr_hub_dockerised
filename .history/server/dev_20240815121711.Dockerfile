FROM node:latest

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN   npm install && npm rebuild bcrypt --build-from-source
# Bundle app source
COPY . /server

EXPOSE 3000
CMD [ "npm", "run", "dev" ]