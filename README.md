# Test project using Blockchain
The idea is to show possible way to gather data from EVM-compatable blockchains

Table of Content (by questions):

- A description of what you've built: [architecture](#architecture-design)
- Which technologies you've used and how they tie together: [techs](#Technologies)
- Your reasons for high-level decisions: still there [architecture](#architecture-design)
- SQL queries are written [here](./request.sql)

## How to start

If you have `docker` installed, than `docker-compose` will run it for you.

```sh
docker-compose up

docker-compose down
```

In case you don't have `docker` installed, check from `docker-compose` which envs required to set in your OS.
Ensure you have a connection to your PostgreSQL database.
Than run each service separatelly with extended environments.

```sh
# for microservice run
cd microservice
npm run start

# for server run
cd server
npm run start
```

## Endpoints:

For the task two endpoints were created:

| endpoint                   | method | description                                                                            |
| -------------------------- | ------ | -------------------------------------------------------------------------------------- |
| `/api/v1/transactions`     | GET    | Get latest 100 transactions (pagination and sort by `sender` or `recipient` possible)  |
| `/api/v1/balance/:address` | GET    | Get address balance and all the data. The address could be `sender`'s or `recipient`'s |
| `/docs`                    | GET    | Endpoint to see all the above endpoints and interact with them using Swagger UI        |

You need to have one of the next API keys to reach endpoints:

| header    | API key                |
| --------- | ---------------------- |
| x-api-key | `key1`, `key2`, `key3` |

> To Reach all the endpoints you need to run `server`. Than go [http://localhost:3000/docs](http://localhost:3000/docs) to try it out.

## Architecture design

I created a microservice to gather required data and don't bother the server or vise versa. The microservice does 3 simple steps:

- go to blockchain
- gather data:
  - get block data
  - get each DAI transaction from the block
  - get balances of recipient and sender of each of the transactions
- store to db

I created a server to have API endpints to users to use the gathered data. Endpoints described [here](#endpoints)

Also, in case of something happened to server (bugs, or too many users come and we don't have a scaller), the microservice will still gather data.

As both are separated and contenerised, it's possible to extend them and run using K8s to scale up/down in case of need.

## Tests

To run tests, you need server to be running.

```sh
cd server
npm run e2e
```

## Technologies

For Microservice I used only `ethers.js` library to got to blockchain and `sequelize` to connect and store data in postgres. I didn't use any loggers here as it's just a simple test task and there is nothing to analyse.

For Server I used:

- `sequelize` to connect to DB
- `express` for simple server
- `swagger` for great documentation
