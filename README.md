# Warlord Cats Deathmatch

## Prerequisites

[NodeJs](https://nodejs.org) `>= 16.13.1`

[npmjs](https://www.npmjs.com/) `>= 8.1.2`

[nodemon](https://nodemon.io/) `>= 2.0.15`

[git](https://git-scm.com/downloads) `>= 2.32.0`

[PostgreSQL](https://www.postgresql.org/) `>= 11.14`

## Installing / Getting started

A quick introduction of the minimal setup you need to get up & running

```shell
git clone git@github.com:SlavenBesevic/warlord-cats-deathmatch.git
cd warlord-cats-deathmatch
npm i
```

## Configuration

To setup database run

```shell
npm run init-db
```

To run a project in a `development.local` environment run

```shell
npm start
```

Or if you want to do both at once

```shell
npm run init-db-and-start
```

Do note that `.env.development.local` files must be present in order to run the project.
Required environment variables:

```shell
NODE_ENV
PORT
PG_CONNECTION_STRING
```
