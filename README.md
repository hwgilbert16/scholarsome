<p align="center"><img src="https://raw.githubusercontent.com/hwgilbert16/scholarsome/develop/apps/front/src/assets/scholarsome-logo-purple-lowercase.svg" height="50%" width="50%"></p>

<div align="center">

<a href="">![](https://img.shields.io/github/license/hwgilbert16/scholarsome?style=flat-square&color=blue)</a>
<a href="">![](https://img.shields.io/badge/contributions-welcome-orange?style=flat-square)</a>
<a href="">![](https://img.shields.io/github/issues/hwgilbert16/scholarsome?style=flat-square)</a>

</div>

|                Desktop view                 |                 Mobile view                 |
|:-------------------------------------------:|:-------------------------------------------:|
| <img src="https://i.imgur.com/MshTOaL.png"> | <img src="https://i.imgur.com/eYf4qRy.png"> |

<p align="center">Scholarsome is an open source system for flashcard studying, through the use of quizzes and games.</p>

<p align="center">Inspired by the larger sites that are now charging for core functionality, Scholarsome intends to be a drop-in replacement for any study workflow.</p>

---

## Getting started

Scholarsome runs within a Docker container for production uses. We recommend the use of our implementation of Docker Compose to orchestrate database connections.

Before starting installation, be sure that Docker is installed on the system that you will be running Scholarsome within. Downloads for Docker can be found below if you do not already have it installed.

- [Linux](https://docs.docker.com/linux/started/)
- [Windows](https://docs.docker.com/windows/started)
- [MacOS (OS X)](https://docs.docker.com/mac/started/)

These instructions are written for Linux installations.

### Installation - Docker Compose

This is the recommended method of installation, as it is does not require any external database connections.

Make a directory for the necessary files.

```
mkdir scholarsome && cd scholarsome
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

Start the service in a detached state.

```
docker compose --env-file .env up -d
```

Scholarsome is now running.
