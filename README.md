
# Virta Challenge

### Pre-requisites:
1. [nvm](https://github.com/nvm-sh/nvm)
2. [Node.js](https://nodejs.org/en/)
3. [Docker](https://docker.com) or use local MySQL Db and create a schema with name `virta`.


### How to run the code?

1. Run `nvm use` or ensure you're on Nodejs v16

2. Run `npm i` to install the dependencies

3. Run `docker-compose -f build/docker-compose.yaml up -d` to bring up the database. The MySQL db is exposed to 3306 on your local machine. If it fails to start, then update the port in docker config and project's config ([config/default.json](./config/default.json)).

4. Run `npm run migrations:run` to run the database migrations.

5.  `npm run start:dev` will run the code with hot-reloading via nodemon.


To run with production build use `npm run start` which will clean, generate a new contents inside `dist` folder and start the expresses server.

  

### How to run the integration tests?

1.  `npm run start:dev` to start the server
2.  `npm run test:integration` will run the tests against this server.

### Explanation

#### Task 1
 There are CRUD endpoints for `/companies`, `/stations`, `/station-types` which acts as interface between the database and the user/client. All the api endpoints are versioned with `v1` and have `api` as prefix. Example : `api/v1/companies` is an endpoint. Any client can use the endpoints according to their needs. There is also an endpoint `/companies/:id/stations` which returns stations data of that company and all of its children.

The company table also has a `parent_id` column which is populated if a child company is being inserted. If let empty, then the given company is a parent company. This would allow us to have recursive of relations in company and it's unto the application layer to determine what level is best, so that too much complexity can be avoided. Currently I have focused on `Company -> [Children Companies]` and have not thought beyond this, as it was out of scope for the task.

Most table(s) have `active` and `createdAt` to which would allow us to deactivate a company, station and also know when the data was populated in the database. 

#### Task 2

The endpoint for this task is `POST /api/v1/parser` which accepts a string content and returns the JSON object in time-series data format. The ParserService.ts file is the service handle everything required to generate the desired data. It takes company and station services as input, so that it can fetch the relevant data for given user instructions. 

The parser caches the stations, companies data for the given request and re-uses them. This prevents similar database calls and can perform the parsing operation efficiently if the no.of stations and companies increase. 

The service file tries to ensure the methods are as small as possible and does very minimal things so that it's easier to `unit` test , readable for other developers and most importantly to understand and make changes as future requirements change. 

The below sequence diagram explains how the input data is translated to the instructions payload in time-series data format.

[![](https://mermaid.ink/img/pako:eNp9U8lqwzAQ_RWhQ0_pD5gSKOkObUOdW93DVJokAltyR-OEEPLvHVvORhZfpMFvm5G01iZY1JmO-NegN_jgYEZQFV7JVwOxM64Gz8qUDmWBqEbd7hQh-4h0P35tQeOuUFJdAuYLcwDMkRbO4BnfUNU9dCRb8KvL2MjALvgenqdqD0-E1MjtcLjLmwnEW9W0OZyvG1Z3vzT8fplMxj87kwTd0cQjU0-BlkBW8Rx7YmRyfpZIYNgtgHHf76GYlCK2TyxqyGauCEtcHDQTT0n9SE4YppuPwzOUg9DP6JHaWM5L2sZ0Jir4cqWmgbrWW29idSNrqFvZCry9rvqONMNj3tLxPMkFGRAd-92kP7NtmBpWZQB7yaM7pS_khoTbjpsJfCyFaY90E9_i9dmng0wXoZWNdZD-UuC3_PNjmyZl3F6EwuuBrpAqcFZezLpVLLSEqbDQmWwtTqEpudCF3wi0qa0keLSOA-lsCmXEgYaGQ77yRmeSGbeg_tX1qM0_BaJDyA)](https://mermaid.live/edit#pako:eNp9U8lqwzAQ_RWhQ0_pD5gSKOkObUOdW93DVJokAltyR-OEEPLvHVvORhZfpMFvm5G01iZY1JmO-NegN_jgYEZQFV7JVwOxM64Gz8qUDmWBqEbd7hQh-4h0P35tQeOuUFJdAuYLcwDMkRbO4BnfUNU9dCRb8KvL2MjALvgenqdqD0-E1MjtcLjLmwnEW9W0OZyvG1Z3vzT8fplMxj87kwTd0cQjU0-BlkBW8Rx7YmRyfpZIYNgtgHHf76GYlCK2TyxqyGauCEtcHDQTT0n9SE4YppuPwzOUg9DP6JHaWM5L2sZ0Jir4cqWmgbrWW29idSNrqFvZCry9rvqONMNj3tLxPMkFGRAd-92kP7NtmBpWZQB7yaM7pS_khoTbjpsJfCyFaY90E9_i9dmng0wXoZWNdZD-UuC3_PNjmyZl3F6EwuuBrpAqcFZezLpVLLSEqbDQmWwtTqEpudCF3wi0qa0keLSOA-lsCmXEgYaGQ77yRmeSGbeg_tX1qM0_BaJDyA)


*Contributor: Anuraag Jain*
