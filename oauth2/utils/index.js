const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(
  path.resolve(__dirname, `../../config/private.key`),
);
const publicKey = fs.readFileSync(
  path.resolve(__dirname, `../../config/public.key`),
);

module.exports.generateAccessToken = ({
  expiresIn = '1h',
  sub = '',
  scope = [],
} = {}) => {
  return jwt.sign(
    {
      sub,
      scope,
    },
    privateKey,
    {
      expiresIn,
      algorithm: 'RS256'
    },
  );
};

module.exports.verifyToken = ({headers: {authorization}}, res, next) => {
  if (!authorization) return res.send('Missed Authorization Header.');
  if (!authorization.startsWith('Bearer ')) return res.send('Unauthorized.');
  jwt.verify(authorization.split('Bearer ')[1], publicKey, (error, decoded) => {
    if (error) return res.send(error);
    next();
  });
};
