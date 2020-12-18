const jwt = require('jsonwebtoken');
const fun = require('./errors.fun');

const Errors = require('../../classes/src/errors');

let httpDecodeBearerScheme = (req, res) => {
  // ---------------------- getting the Auth -------------------- //
  let auth = req.get('Authorization');
  if (!auth) {
    let reason = 'Missing authorization.';
    fun.throw(req, res, new Errors.UnauthorizedError(reason));
  }
  auth = auth.trim();
  let authSplit = auth.split(' ');

  // ------------------- validating auth scheme ----------------- //
  let authScheme = authSplit[0];
  if (authScheme != 'Bearer') {
    let reason = 'Wrong auth scheme, expected Bearer. given: ' + authScheme;
    fun.throw(req, res, new Errors.UnauthorizedError(reason));
  }

  // ------------------ validating the token -------------------- //
  let token = authSplit[1];
  if (!token) {
    fun.throw(req, res, new Errors.JWT.MissingJWTError());
  }

  // ------------------ decoding the Auth JWT ------------------- //
  let decoded = jwt.decode(token);
  if (!decoded) {
    fun.throw(req, res, new Errors.JWT.BadJWTError(token));
  }

  return {
    decoded: decoded,
    token: token
  };
};

let httpVerifyUserToken = async (
  req,
  res,
  schema,
  source,
  { indexingProperty, indexRejectionFunction } = {
    indexingProperty: 'user',
    indexRejectionFunction: isNaN
  }
) => {
  // ----------------- validate decoded user id ------------------ //
  let id = httpValidateUserIdentifierFromSchema(req, res, schema, {
    indexingProperty: indexingProperty,
    rejectionFunction: indexRejectionFunction
  });

  // --------------- getting the valid JWT secret ---------------- //
  try {
    let validJWT = await source(id);
    if (!validJWT) {
      fun.throw(req, res, new Errors.JWT.InvalidJWTError(schema.token));
    }

    // -------------------- verifying the JWT -------------------- //
    try {
      jwt.verify(schema.token, validJWT.secret);
    } catch {
      fun.throw(req, res, new Errors.JWT.InvalidJWTError(schema.token));
    }
  } catch (e) {
    fun.throw(req, res, new Errors.UnauthorizedError(e));
  }
};

let httpValidateUserIdentifierFromSchema = (
  req,
  res,
  schema,
  { indexingProperty, rejectionFunction } = {
    indexingProperty: 'user',
    rejectionFunction: isNaN
  }
) => {
  let id = schema.decoded[indexingProperty];
  if (rejectionFunction(id)) {
    fun.throw(req, res, new Errors.JWT.BadJWTError(schema.token));
  }
  return id;
};

let decodeBearerScheme = (authorization) => {
  // ---------------------- getting the Auth -------------------- //
  let auth = authorization.trim();
  let authSplit = auth.split(' ');

  // ------------------- validating auth scheme ----------------- //
  let authScheme = authSplit[0];
  if (authScheme != 'Bearer') {
    throw 'Wrong auth scheme, expected Bearer. given: ' + authScheme;
  }

  // ------------------ validating the token -------------------- //
  let token = authSplit[1];
  if (!token) {
    throw 'Missing JWT.';
  }

  // ------------------ decoding the Auth JWT ------------------- //
  let decoded = jwt.decode(token);
  if (!decoded) {
    throw 'Bad JWT.';
  }

  return {
    decoded: decoded,
    token: token
  };
};

let verifyUserToken = async (
  schema,
  source,
  { indexingProperty, indexRejectionFunction } = {
    indexingProperty: 'user',
    indexRejectionFunction: isNaN
  }
) => {
  // ----------------- validate decoded user id ------------------ //
  let id = validateUserIdentifierFromSchema(schema, {
    indexingProperty: indexingProperty,
    rejectionFunction: indexRejectionFunction
  });

  // --------------- getting the valid JWT secret ---------------- //
  let validJWT = await source(id);
  if (!validJWT) {
    throw 'Given JWT was invalid or has expirated';
  }

  // -------------------- verifying the JWT ---------------------- //
  try {
    jwt.verify(schema.token, validJWT.secret);
  } catch {
    throw 'Given JWT was invalid or has expirated';
  }
};

let validateUserIdentifierFromSchema = (
  schema,
  { indexingProperty, rejectionFunction } = {
    indexingProperty: 'user',
    rejectionFunction: isNaN
  }
) => {
  let id = schema.decoded[indexingProperty];
  if (rejectionFunction(id)) {
    throw `Bad JWT. Indexing property '${indexingProperty}' found invalid `;
  }
  return id;
};

module.exports = {
  http: {
    decodeBearerScheme: httpDecodeBearerScheme,
    verifyUserToken: httpVerifyUserToken,
    validateUserIdentifierFromSchema: httpValidateUserIdentifierFromSchema
  },
  decodeBearerScheme: decodeBearerScheme,
  verifyUserToken: verifyUserToken,
  validateUserIdentifierFromSchema: validateUserIdentifierFromSchema
};
