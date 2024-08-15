FROM node:14-alpine

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN npm install --prod

# Bundle app source
COPY . /app

EXPOSE 3000
CMD [ "npm", "run", "dev" ]