<h1 align="center">Welcome to fun.framework 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/fun.framework" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/fun.framework.svg">
  </a>
  <!-- <a href="https://github.com/neuralgeeks/fun.framework#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a> -->
  <a href="https://github.com/neuralgeeks/fun.framework/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/neuralgeeks/fun.framework/blob/master/LICENSE" target="_blank">
    <img alt="License: Apache--2.0" src="https://img.shields.io/github/license/neuralgeeks/fun.framework" />
  </a>
  <a href="https://github.com/neuralgeeks/fun.framework/blob/master/CODE_OF_CONDUCT.md" target="_blank">
    <img alt="Contributor Covenant" src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" />
  </a>
</p>

> A fun, intuitive and expressive [node.js](https://nodejs.org/en/) web application framework based on [express](https://www.npmjs.com/package/express).

```js
const express = require('express');
const router = express.Router();
const JWTMiddleware = require('../middleware/JWT.middleware');
const RoleMiddleware = require('../middleware/role.middleware');
const Controller = require('../controllers/user.controller');
const Validators = require('../validators/user');

const fun = require('fun.framework/functions/src/routes/routes.fun')(
  router,
  new Controller()
);

fun.group([JWTMiddleware])([
  fun.rest(Validators.RestValidators),
  fun.subgroup([RoleMiddleware('board')])([
    fun.post('/announcement', 'announcement', new Validators.announcement())
  ])
]);
```

### 🏠 [Homepage](https://github.com/neuralgeeks/fun.framework#readme)

### ✨ [Demo](https://github.com/joaobose/CITE.API)

## Install

This project has an awesome [CLI](https://github.com/neuralgeeks/fun.framework.cli). To start a project execute:

```sh
npm i -g fun.framework.cli
fun.cli init
```

The CLI will promt some questions to generate the best base project for you. Once the CLI command has finished execute the following to start your project:

```sh
cd PROJECT_NAME
npm start
```

## Run tests

The test are currently in development 🛠 and will be available for the next major version 👀. Please stay tune for updates ⌚️.

```sh
npm install
npm run test
```

## 📄 Documentation

An in-depth use documentation is comming soon! Please use our [demo project](https://github.com/joaobose/CITE.API) as reference while we develop an awesome documentation.

## Author

👤 **neuralgeeks**

- Website: https://neuralgeeks.com/
- Github: [@neuralgeeks](https://github.com/neuralgeeks)
- Instagram: [@neuralgeeks](https://instagram.com/neuralgeeks)

## 🤝 Contributing

Contributions, issues and feature requests are welcome 👍🏻. Feel free to check our [issues page](https://github.com/neuralgeeks/fun.framework/issues). <br /><br />Our community just started! We are doing our absolute best to make this project the best, that is why we are taking our time to stablish the contributing methodology, an in-depth contributing guide will be available soon, we are taking our time so that the project's contribution environment is the best posible. <br /><br /> Keep in mind this is our first open source project, this means we are still learning how things are done, we want to do this as best as we can!<br /><br /> If you really want to help us through this process, contact us at contact@neuralgeeks.com, we are waiting for you!

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [neuralgeeks](https://github.com/neuralgeeks).<br />
This project is [Apache--2.0](https://github.com/neuralgeeks/fun.framework/blob/master/LICENSE) licensed.
