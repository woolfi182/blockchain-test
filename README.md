# Project for Tessera

The idea is to show possible way to gather data from EVM-compatable blockchains

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

I created a microservice to run it separately from server. The microservice gathers required data and don't bother the server or vise versa. Also, in case of something happened to server (bugs, or too many users come and we don't have a scaller), the microservice will still gather data.

As both are separated and contenerised, it's possible to extend them and run using K8s to scale up/down in case of need.

## Tests

In progress
