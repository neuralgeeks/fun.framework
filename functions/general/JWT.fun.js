const jwt = require('jsonwebtoken');
const fun = require('./errors.fun');

const Errors = require('../../classes/src/errors');

/**
 * @license
 * Copyright 2020 neuralgeeks LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Decodes an http Bearer JWT token authentication from an express request.
 *
 * @param {Express.Request}       req      An express request
 * @param {Express.Response}      res      An express response
 *
 * @throws {BaseError} If an error occurs while decoding the scheme. This errors gets automatically sent to the response using fun.throw.
 *
 * @returns {{decoded: any, token: string}} The given bearer token and the decoded JWT content
 */
const httpDecodeBearerScheme = (req, res) => {
  //---------------------- getting the Auth
  let auth = req.get('Authorization');
  if (!auth) {
    let reason = 'Missing authorization.';
    fun.throw(req, res, new Errors.UnauthorizedError(reason));
  }

  let [authScheme, token] = auth.trim().split(' ');

  //---------------------- validating auth scheme
  if (authScheme !== 'Bearer') {
    let reason = `Wrong auth scheme, expected Bearer. given: ${authScheme}`;
    fun.throw(req, res, new Errors.UnauthorizedError(reason));
  }

  //---------------------- validating the token
  if (!token) fun.throw(req, res, new Errors.JWT.MissingJWTError());

  //---------------------- decoding the Auth JWT
  let decoded;
  try {
    decoded = jwt.decode(token);
  } catch {
    decoded = null;
  }

  if (!decoded) fun.throw(req, res, new Errors.JWT.BadJWTError(token));

  return {
    decoded: decoded,
    token: token
  };
};

/**
 * Verifies an user's http JWT scheme using the decoded content and a source funtion.
 *
 * @param {Express.Request}       req                       An express request
 * @param {Express.Response}      res                       An express response
 *
 * @param {{decoded: any,
 *          token: string}}       schema                    The JWT decoded scheme
 *
 * @param {(identifier: any) =>
 *        Promise<{
 *          secret: string
 *        }>}                     source                    The source function for the user's JWT secret. You can use this function to fetch the user's JWT secret from your database or storage.
 *
 * @param {{
 *    indexingProperty: string,
 *    indexRejectionFunction:
 *      (identifier: any) =>
 *        boolean
 *    }}                         [options]                  Options. ```indexingProperty``` is the name of the property that holds the user identifier, default is ```'user'```. ```indexRejectionFunction``` is a boolean rejection function to invalidate the decoded identifier. Use this to handle ```undefined```, ```null``` or invalid identifiers, default is ```isNaN```.
 *
 *
 * @throws {BaseError} If an error occurs while verifying the scheme. This error gets automatically sent to the response using fun.throw.
 */
const httpVerifyUserToken = async (
  req,
  res,
  schema,
  source,
  { indexingProperty, indexRejectionFunction } = {
    indexingProperty: 'user',
    indexRejectionFunction: isNaN
  }
) => {
  //---------------------- validate decoded user id
  let id = httpValidateUserIdentifierFromSchema(req, res, schema, {
    indexingProperty: indexingProperty,
    rejectionFunction: indexRejectionFunction
  });

  //---------------------- getting the valid JWT secret
  let validJWT = await source(id);
  if (!validJWT)
    fun.throw(req, res, new Errors.JWT.InvalidJWTError(schema.token));

  //---------------------- verifying the JWT
  try {
    jwt.verify(schema.token, validJWT.secret);
  } catch {
    fun.throw(req, res, new Errors.JWT.InvalidJWTError(schema.token));
  }
};

/**
 * Validates and returns the user identifier from the http JWT scheme.
 *
 * @param {Express.Request}        req                       An express request
 * @param {Express.Response}       res                       An express response
 *
 * @param {{decoded: any,
 *          token: string}}       schema                    The JWT decoded scheme
 *
 * @param {{
 *    indexingProperty: string,
 *    indexRejectionFunction:
 *      (identifier: any) =>
 *        boolean
 *    }}                         [options]                  Options. ```indexingProperty``` is the name of the property that holds the user identifier, default is ```'user'```. ```indexRejectionFunction``` is a boolean rejection function to invalidate the decoded identifier. Use this to handle ```undefined```, ```null``` or invalid identifiers, default is ```isNaN```.
 *
 *
 * @throws {BaseError} If an error occurs while verifying the scheme. This error gets automatically sent to the response using fun.throw.
 *
 * @returns {any} The user identifier.
 */
const httpValidateUserIdentifierFromSchema = (
  req,
  res,
  schema,
  { indexingProperty, rejectionFunction } = {
    indexingProperty: 'user',
    rejectionFunction: isNaN
  }
) => {
  let id = schema.decoded[indexingProperty];
  if (rejectionFunction(id))
    fun.throw(req, res, new Errors.JWT.BadJWTError(schema.token));

  return id;
};

/**
 * Decodes a Bearer JWT token authentication from an authorization string.
 *
 * @param {string} authorization  An authorization string.
 *
 * @throws {string} If an exception occurs while decoding the scheme. The error ```string``` shows the reason of the exception.
 *
 * @returns {{decoded: any, token: string}} The given bearer token and the decoded JWT content.
 */
const decodeBearerScheme = (authorization) => {
  //---------------------- getting the Auth
  let [authScheme, token] = authorization.trim().split(' ');

  //---------------------- validating auth scheme
  if (authScheme != 'Bearer')
    throw `Wrong auth scheme, expected Bearer. given: ${authScheme}`;

  //---------------------- validating the token
  if (!token) throw 'Missing JWT.';

  //---------------------- decoding the Auth JWT
  let decoded;
  try {
    decoded = jwt.decode(token);
  } catch {
    decoded = null;
  }

  if (!decoded) throw 'Bad JWT.';

  return {
    decoded: decoded,
    token: token
  };
};

/**
 * Verifies an user's JWT scheme using the decoded content and a source funtion.
 *
 * @param {{decoded: any,
 *          token: string}}       schema                    The JWT decoded scheme
 *
 * @param {(identifier: any) =>
 *        Promise<{
 *          secret: string
 *        }>}                     source                    The source function for the user's JWT secret. You can use this function to fetch the user's JWT secret from your database or storage.
 *
 * @param {{
 *    indexingProperty: string,
 *    indexRejectionFunction:
 *      (identifier: any) =>
 *        boolean
 *    }}                         [options]                  Options. ```indexingProperty``` is the name of the property that holds the user identifier, default is ```'user'```. ```indexRejectionFunction``` is a boolean rejection function to invalidate the decoded identifier. Use this to handle ```undefined```, ```null``` or invalid identifiers, default is ```isNaN```.
 *
 *
 * @throws {string} If an error occurs while verifying the scheme. The error ```string``` shows the reason of the exception.
 */
const verifyUserToken = async (
  schema,
  source,
  { indexingProperty, indexRejectionFunction } = {
    indexingProperty: 'user',
    indexRejectionFunction: isNaN
  }
) => {
  //---------------------- validate decoded user id
  let id = validateUserIdentifierFromSchema(schema, {
    indexingProperty: indexingProperty,
    rejectionFunction: indexRejectionFunction
  });

  //---------------------- getting the valid JWT secret
  let validJWT = await source(id);
  if (!validJWT) throw 'Given JWT was invalid or has expirated';

  //---------------------- verifying the JWT
  try {
    jwt.verify(schema.token, validJWT.secret);
  } catch {
    throw 'Given JWT was invalid or has expirated';
  }
};

/**
 * Validates and returns the user identifier from the JWT scheme.
 *
 * @param {{decoded: any,
 *          token: string}}       schema                    The JWT decoded scheme
 *
 * @param {{
 *    indexingProperty: string,
 *    indexRejectionFunction:
 *      (identifier: any) =>
 *        boolean
 *    }}                         [options]                  Options. ```indexingProperty``` is the name of the property that holds the user identifier, default is ```'user'```. ```indexRejectionFunction``` is a boolean rejection function to invalidate the decoded identifier. Use this to handle ```undefined```, ```null``` or invalid identifiers, default is ```isNaN```.
 *
 *
 * @throws {BaseError} If an error occurs while verifying the scheme. The error ```string``` shows the reason of the exception.
 *
 * @returns {any} The user identifier.
 */
const validateUserIdentifierFromSchema = (
  schema,
  { indexingProperty, rejectionFunction } = {
    indexingProperty: 'user',
    rejectionFunction: isNaN
  }
) => {
  let id = schema.decoded[indexingProperty];
  if (rejectionFunction(id))
    throw `Bad JWT. Indexing property '${indexingProperty}' found invalid `;

  return id;
};

module.exports = {
  http: {
    decodeBearerScheme: httpDecodeBearerScheme,
    verifyUserToken: httpVerifyUserToken,
    validateUserIdentifierFromSchema: httpValidateUserIdentifierFromSchema
  },
  decodeBearerScheme,
  verifyUserToken,
  validateUserIdentifierFromSchema
};
