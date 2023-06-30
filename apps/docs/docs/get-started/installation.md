---
sidebar_position: 2
---

# Installation

Scholarsome can be installed one of two ways for production uses: via Docker Compose, or Docker.

For individuals contributing to the development of Scholarsome, it is possible to directly run it outside a container. However, this method is only recommended for development uses.

:::info
These instructions are written assuming that the system Scholarsome is being installed on is **Linux-based.** Scholarsome is compatible with other platforms, but you will have to source your own installation instructions for non-Linux systems.
:::

:::caution Environment Files
For each installation method, there is a separate environment file. Ensure that the one downloaded matches your method of installation.
:::

## Via Docker Compose

:::tip Recommended
This is the recommended method of installation, as it is does not require any external database connections.
:::

Make a directory for the necessary files.

```
mkdir ~/scholarsome && cd ~/scholarsome
```

Download the compose file.

```
wget https://raw.githubusercontent.com/hwgilbert16/scholarsome/develop/compose.yml
```

Download the environment file and make a copy of it.

```
wget https://raw.githubusercontent.com/hwgilbert16/scholarsome/develop/.env.compose.example && cp .env.compose.example .env
```

Open `.env` with your favorite text editor, and fill in the required fields, along with any optional ones that fit your use case.

:::info
If the SMTP fields are left blank, users will be verified by default. Most installations do not need email verification.
:::

| Variable Name                   | Description                                                                                                                                                            |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NODE_ENV                        | **Required.** Declares whether the application is running in development or production. Recommended to be set to `production`.                                         |
| DATABASE_PASSWORD               | **Required.** Internal password for databases. Select something strong, as you will not need to know this.                                                             |
| JWT_SECRET                      | **Required.** String used to encrypt cookies and other sensitive items. Select something strong, as you will not need to know this.                                    |
| HTTP_PORT                       | **Required.** Port that Scholarsome with be accessible through. Recommended to be set to 80. If using SSL, set to 80, as another server will be spawned with port 443. |
| STORAGE_TYPE                    | **Required.** The method that Scholarsome will store media files, either `local` or `s3`.                                                                              |
| SMTP_HOST                       | Host to access the SMTP server.                                                                                                                                        |
| SMTP_PORT                       | Port to access the SMTP server.                                                                                                                                        |
| SMTP_USERNAME                   | Username to access the SMTP server.                                                                                                                                    |
| SMTP_PASSWORD                   | Password to access the SMTP server.                                                                                                                                    |
| HOST                            | The domain to be used in emails. **Do not include HTTP.**                                                                                                              |
| SSL_KEY_BASE64                  | Base64 encoded SSL public key.                                                                                                                                         |
| SSL_CERT_BASE64                 | Base64 encoded SSL certificate.                                                                                                                                        |
| SCHOLARSOME_RECAPTCHA_SITE      | reCAPTCHA site key.                                                                                                                                                    |
| SCHOLARSOME_RECAPTCHA_SECRET    | reCAPTCHA secret key.                                                                                                                                                  |
| SCHOLARSOME_HEAD_SCRIPTS_BASE64 | Base64 encoded HTML of any scripts that should be included in the head tag for every page.                                                                             |
| STORAGE_LOCAL_DIR               | Required if storing files locally. The absolute filepath pointing to the directory where Scholarsome should store media files.                                         |
| S3_STORAGE_ENDPOINT             | Required if storing files in S3. The endpoint of the S3 service.                                                                                                       |
| S3_STORAGE_ACCESS_KEY           | Required if storing files in S3. Access key for the S3 service.                                                                                                        |
| S3_STORAGE_ACCESS_KEY           | Required if storing files in S3. Secret key for the S3 service.                                                                                                        |
| S3_STORAGE_ACCESS_KEY           | Required if storing files in S3. Region for the S3 service.                                                                                                            |
| S3_STORAGE_ACCESS_KEY           | Required if storing files in S3. The name of the bucket being used in S3 to store media files.                                                                         |


Start the service in a detached state.

```
docker compose --env-file .env up -d
```

Scholarsome is now running.

## Via a Docker Container

:::caution
For this installation method, you will have to provide your own database connections.
:::

Make a directory for the necessary files.

```
mkdir ~/scholarsome && cd ~/scholarsome
```

Pull the image.

```
docker pull hwgilbert16/scholarsome
```


Download the environment file and make a copy of it.

```
wget https://raw.githubusercontent.com/hwgilbert16/scholarsome/develop/.env.docker.example && cp .env.docker.example .env
```

Open `.env` with your favorite text editor, and fill in the required fields, along with any optional ones that fit your use case.

| Variable Name                   | Description                                                                                                                                                            |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NODE_ENV                        | **Required.** Declares whether the application is running in development or production. Recommended to be set to `production`.                                         |
| DATABASE_URL                    | **Required.** Connection string to the MySQL database. The format should be as follows: `mysql://(username):(password)@(host):(port)/(database)`                       |
| JWT_SECRET                      | **Required.** String used to encrypt cookies and other sensitive items. Select something strong, as you will not need to know this.                                    |
| HTTP_PORT                       | **Required.** Port that Scholarsome with be accessible through. Recommended to be set to 80. If using SSL, set to 80, as another server will be spawned with port 443. |
| REDIS_HOST                      | **Required.** Host used to access the Redis database.                                                                                                                  |
| REDIS_PORT                      | **Required.** Port used to access the Redis database.                                                                                                                  |
| REDIS_USERNAME                  | **Required.** Username used to access the Redis database.                                                                                                              |
| REDIS_PASSWORD                  | **Required.** Password used to access the Redis database.                                                                                                              |
| SMTP_HOST                       | Host to access the SMTP server.                                                                                                                                        |
| SMTP_PORT                       | Port to access the SMTP server.                                                                                                                                        |
| SMTP_USERNAME                   | Username to access the SMTP server.                                                                                                                                    |
| SMTP_PASSWORD                   | Password to access the SMTP server.                                                                                                                                    |
| HOST                            | The domain to be used in emails. **Do not include HTTP.**                                                                                                              |
| SSL_KEY_BASE64                  | Base64 encoded SSL public key.                                                                                                                                         |
| SSL_CERT_BASE64                 | Base64 encoded SSL certificate.                                                                                                                                        |
| SCHOLARSOME_RECAPTCHA_SITE      | reCAPTCHA site key.                                                                                                                                                    |
| SCHOLARSOME_RECAPTCHA_SECRET    | reCAPTCHA secret key.                                                                                                                                                  |
| SCHOLARSOME_HEAD_SCRIPTS_BASE64 | Base64 encoded HTML of any scripts that should be included in the head tag for every page.                                                                             |

Start the container in a detached state. Replace `(port)` with the value you selected for `HTTP_PORT` in the environment file.

```
docker run -d --env-file .env -p (port):(port) --restart=always --name scholarsome hwgilbert16/scholarsome
```

To stop the container, run:

```
docker stop scholarsome
```

## Outside a container

Reference the [development guide](../development/development-guide.md) for steps on how to run Scholarsome outside a container.
