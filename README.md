# task-board-client

Ushbu applar UzJavascript meetup uchun tayyorlandi


## Manbalar

  - [Slide](https://docs.google.com/presentation/d/1nWkY9b-Uu1PIDLcPXO3YSRTgN1r9rAaxPWrr3F7clY0/edit?usp=sharing)
  - [Youtube](https://youtu.be/fxlNCT_0vp8?t=7191)
  - [Telegram](https://t.me/jsmeetupuz)
  - [Graphql](https://graphql.org/).
  - [Apollo Graphql](https://www.apollographql.com/).
  - [KnexJs](https://knexjs.org/).
  - [PostgreSQL](https://www.postgresql.org/).
  - [Vuejs](https://vuejs.org/).
  - [Villus (graphql client)](https://villus.logaretm.com/).


## Ushbu app xaqida qisqacha

Appni yuklab olganingizda 2 ta papka bor va ular
 - `client` frontend qismi
 - `server` backend qismi

nomlari bilan nomlangan. Va butun source codelar shu yerda joylashgan

## Project Setup

Porjectlarni qurishingiz uchun client va server papkalariga kirasiz va

```sh
npm install
# yoki
yarn install
```
qurilish tugagach
### Backend `server` uchun birinchi
 - Database ni ishlatish uchun docker-compose up -d
 - env faylini taxrirlaysiz linux lar uchun `cp -r .env.template .env`
 - Database ga tablelarni qoshamiz `npx knex migrate:latest`
 - Database ga fake malumotlar qoshamiz `npx knex seed:run`
 - Vanihoyat serverimiz ishlashga tayyor


```sh
npm run dev
```
### Frontend uchun
#### `Frontendda deyarli ozgartiriladigan fayllar bolmaganligi sababli sizga client qismini ishga tushurish qiyin bolmaydi`

```sh
npm run dev
```
# Xammaga raxmat