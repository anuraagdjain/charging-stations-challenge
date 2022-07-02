# Virta Challenge

### Pre-requisites:

1. [nvm](https://github.com/nvm-sh/nvm)

2. [Node.js](https://nodejs.org/en/)

3. [Docker](https://docker.com) or use local MySQL Db and create a schema with name `virta`.

### How to run the code?

1. Run `nvm use` or ensure you're on Nodejs v16
2. Run `npm i` to install the dependencies
3. Run `docker-compose -f build/docker-compose.yaml up -d` to bring up the database. The MySQL db is exposed to 3306 on your local. If it fails to start, then update the port in docker config and project's config.
4. Run `npm run migrations:run` to run the database migrations.
5. `npm run start:dev` will run the code with hot-reloading via nodemon.

To run in production build use `npm run start` which will clean and generate a new contents inside `dist` folder.

### How to run the integration tests?

1. `npm run start:dev` to start the server
2. `npm run test:integration` will run the test against this server.
