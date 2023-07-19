---
sidebar_position: 1
---

# Development Guide

For development, Scholarsome needs to be installed in a different way.

Clone the repo and move into it.

```
git clone https://github.com/hwgilbert16/scholarsome.git
```

```
cd scholarsome
```

Install dependencies.

:::caution
`--legacy-peer-deps` must be passed to the installation command
:::

```
npm install --legacy-peer-deps
```

Next, we'll need to setup the environment file. Make a copy of the development one and open it in your favorite file editor.

```
cp .env.dev.example .env
```

Scholarsome is dependent on a MariaDB instance, a Redis instance, and (optionally), an SMTP server. We recommend using Docker containers to setup these connections.

`.env.dev.example` has a configuration prefilled to match the container configuration commands listed below, but you can connect to a different database if necessary.

If you use the prefilled configuration, you will only need to fill in the `STORAGE_LOCAL_DIR` variable.

```
docker run -p 6379:6379 --name some-redis redis
```

```
docker run -p 3000:80 -p 25:25 rnwood/smtp4dev
```

```
docker run -p 3306:3306 --name some-mariadb --env MARIADB_USER=test --env MARIADB_PASSWORD=test --env MARIADB_ROOT_PASSWORD=test --env MARIADB_DATABASE=scholarsome  mariadb:latest
```

Below is a list of the required environment variables. Reference the [installation guide](../installation/installing.md) for documentation with the optional ones.

<details>
<summary>Development Environment Variables</summary>


| Variable Name     | Description                                                                                                                                                            |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NODE_ENV          | **Required.** Declares whether the application is running in development or production. Recommended to be set to `development` for development purposes.               |
| DATABASE_URL      | **Required.** Connection string to the MySQL database. The format should be as follows: `mysql://(username):(password)@(host):(port)/(database)`                       |
| JWT_SECRET        | **Required.** String used to encrypt cookies and other sensitive items. Select something strong, as you will not need to know this.                                    |
| HTTP_PORT         | **Required.** Port that Scholarsome with be accessible through. Recommended to be set to 80. If using SSL, set to 80, as another server will be spawned with port 443. |
| HOST              | **Required.** The domain that Scholarsome will be running on. Likely will be `localhost:4200` for development installs. **Do not include HTTP.**                       |
| STORAGE_TYPE      | **Required.** The method that Scholarsome will store media files, either `local` or `s3`. Recommended to be set to `local` for development installations.              |
| REDIS_HOST        | **Required.** Host used to access the Redis database.                                                                                                                  |
| REDIS_PORT        | **Required.** Port used to access the Redis database.                                                                                                                  |
| REDIS_USERNAME    | **Required.** Username used to access the Redis database.                                                                                                              |
| REDIS_PASSWORD    | **Required.** Password used to access the Redis database.                                                                                                              |
| STORAGE_LOCAL_DIR | Required if storing files locally. The absolute filepath pointing to the directory where Scholarsome should store media files.                                         |
</details>

Setup the database.

```
npm run migrate
```

Generate the local database files.

```
npm run generate
```

The development environment is now setup. Start the development server.

```
npm run start:dev
```

This may take a few moments as Angular builds for the first time. Scholarsome will be accessible at `http://localhost:4200` once the URL is printed to the console by Angular.

Both the API (NestJS) and the frontend (Angular) will update automatically when file changes are saved.
