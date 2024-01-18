---
sidebar_position: 2
---

# Installing

:::info
This section is about installing Scholarsome in a production environment. If you are looking for guidance on how to use the application, refer to the [usage section](../usage/overview.md). If you are trying to run the application for development purposes, refer to the [development guide](../development/development-guide.md).
:::

Scholarsome can be installed one of two ways for production uses: via Docker Compose, or Docker.

For individuals contributing to the development of Scholarsome, it is possible to directly run it outside a container. However, this method is only recommended for development uses.

This documentation is written assuming that the system Scholarsome is being installed on is **Linux-based.** Scholarsome is compatible with other platforms, but you will have to source your own installation instructions for non-Linux systems.

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
wget https://raw.githubusercontent.com/hwgilbert16/scholarsome/release/compose.yml
```

:::caution
If you will be using a valid SSL certificate with Scholarsome, you will need to modify your `compose.yml` file to inform Docker Compose what port you would like the SSL version of Scholarsome to be accessible on. If you use an SSL certificate, Scholarsome will run both an HTTP and HTTPS version of the site.

Open the `compose.yml` file in any text editor and navigate to line 29.

```
# - "(your ssl port):8443"
```

Remove the hashtag to uncomment the line, and replace `(your ssl port)` with the port that you would like the SSL version of Scholarsome to be accessible on.

Keep in mind that **non-root** users, by default, **do not have permission to bind to ports lower than 1024.** If you will be running SSL on a port lower than 1024, ensure that the user running the Scholarsome process has necessary permissions.
:::

Download the environment file and make a copy of it.

```
wget https://raw.githubusercontent.com/hwgilbert16/scholarsome/release/.env.compose.example && cp .env.compose.example .env
```

Open the `.env` file in any text editor.

Expand the dropdown below, it lists Scholarsome's environment variables. These are used to configure the application to your liking. At a minimum, you must fill in the fields marked as "required."

Additionally, if you are using S3 as your storage medium, you will need to fill the `S3_` fields as well.

:::info
If the SMTP fields are left blank, users will not have to verify their emails. Most installations do not need to enforce email verification, unless you are planning to expose Scholarsome to other users.
:::

<details>
<summary>Docker Compose Environment Variables</summary>

| Variable Name                   | Description                                                                                                                                                            |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NODE_ENV                        | **Required.** Declares whether the application is running in development or production. Recommended to be set to `production`.                                         |
| DATABASE_PASSWORD               | **Required.** Internal password for databases. Select something strong, as you will not need to know this.                                                             |
| JWT_SECRET                      | **Required.** String used to encrypt cookies and other sensitive items. Select something strong, as you will not need to know this.                                    |
| HTTP_PORT                       | **Required.** Port that Scholarsome with be accessible through. Recommended to be set to 80. If using SSL, set to 80, as another server will be spawned with port 443. |
| HOST                            | **Required.** The Domain that Scholarsome will be running on. **Do not include HTTP.**                                                                                 |
| STORAGE_TYPE                    | **Required.** The method that Scholarsome will store media files, either `local` or `s3`. If set to local, Scholarsome will store media files locally.                 |
| SMTP_HOST                       | Host to access the SMTP server.                                                                                                                                        |
| SMTP_PORT                       | Port to access the SMTP server.                                                                                                                                        |
| SMTP_USERNAME                   | Username to access the SMTP server.                                                                                                                                    |
| SMTP_PASSWORD                   | Password to access the SMTP server.                                                                                                                                    |
| SSL_KEY_BASE64                  | Base64 encoded SSL public key.                                                                                                                                         |
| SSL_CERT_BASE64                 | Base64 encoded SSL certificate.                                                                                                                                        |
| SCHOLARSOME_RECAPTCHA_SITE      | reCAPTCHA site key.                                                                                                                                                    |
| SCHOLARSOME_RECAPTCHA_SECRET    | reCAPTCHA secret key.                                                                                                                                                  |
| SCHOLARSOME_HEAD_SCRIPTS_BASE64 | Base64 encoded HTML of any scripts that should be included in the head tag for every page.                                                                             |
| S3_STORAGE_ENDPOINT             | Required if storing files in S3. The endpoint of the S3 service.                                                                                                       |
| S3_STORAGE_ACCESS_KEY           | Required if storing files in S3. Access key for the S3 service.                                                                                                        |
| S3_STORAGE_ACCESS_KEY           | Required if storing files in S3. Secret key for the S3 service.                                                                                                        |
| S3_STORAGE_ACCESS_KEY           | Required if storing files in S3. Region for the S3 service.                                                                                                            |
| S3_STORAGE_ACCESS_KEY           | Required if storing files in S3. The name of the bucket being used in S3 to store media files.                                                                         |

</details>

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
wget https://raw.githubusercontent.com/hwgilbert16/scholarsome/release/.env.docker.example && cp .env.docker.example .env
```

Open `.env` in any text editor.

Expand the dropdown below, it lists Scholarsome's environment variables. These are used to configure the application to your liking. At a minimum, you must fill in the fields marked as "required."

Ensure that you provide a filepath for the `STORAGE_LOCAL_DIR` variable if using local media storage, or provide S3 authentication details if using S3 as your storage medium.

:::info
If the SMTP fields are left blank, users will be verified by default. Most installations do not need to enforce email verification.
:::

<details>
<summary>Docker Environment Variables</summary>

| Variable Name                   | Description                                                                                                                                                            |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NODE_ENV                        | **Required.** Declares whether the application is running in development or production. Recommended to be set to `production`.                                         |
| DATABASE_URL                    | **Required.** Connection string to the MySQL database. The format should be as follows: `mysql://(username):(password)@(host):(port)/(database)`                       |
| JWT_SECRET                      | **Required.** String used to encrypt cookies and other sensitive items. Select something strong, as you will not need to know this.                                    |
| HTTP_PORT                       | **Required.** Port that Scholarsome with be accessible through. Recommended to be set to 80. If using SSL, set to 80, as another server will be spawned with port 443. |
| HOST                            | **Required.** The domain that Scholarsome will be running on. **Do not include HTTP.**                                                                                 |
| STORAGE_TYPE                    | **Required.** The method that Scholarsome will store media files, either `local` or `s3`. If set to local, Scholarsome will store media files locally.                 |
| REDIS_HOST                      | **Required.** Host used to access the Redis database.                                                                                                                  |
| REDIS_PORT                      | **Required.** Port used to access the Redis database.                                                                                                                  |
| REDIS_USERNAME                  | **Required.** Username used to access the Redis database.                                                                                                              |
| REDIS_PASSWORD                  | **Required.** Password used to access the Redis database.                                                                                                              |
| SMTP_HOST                       | Host to access the SMTP server.                                                                                                                                        |
| SMTP_PORT                       | Port to access the SMTP server.                                                                                                                                        |
| SMTP_USERNAME                   | Username to access the SMTP server.                                                                                                                                    |
| SMTP_PASSWORD                   | Password to access the SMTP server.                                                                                                                                    |
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

</details>

Start the container in a detached state. Replace `(port)` with the value you selected for `HTTP_PORT` in the environment file.

:::warning
You must set `STORAGE_LOCAL_DIR` to `/data` if you are planning to use the example command below.
:::

```
mkdir ~/scholarsome-media && docker run -d --env-file .env -p (port):(port) -v ~/scholarsome-media:/data --restart=always --name scholarsome hwgilbert16/scholarsome
```

To stop the container, run:

```
docker stop scholarsome
```

## Outside a container

Reference the [development guide](../development/development-guide.md) for steps on how to run Scholarsome outside a container.
