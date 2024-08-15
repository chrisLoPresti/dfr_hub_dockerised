FROM node:14-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN npm install --dev

# Bundle app source
COPY . /server

EXPOSE 3000
CMD [ "npm", "run", "dev" ]