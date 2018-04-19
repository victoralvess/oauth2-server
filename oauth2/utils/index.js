const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.resolve(__dirname, `../../config/private.key`));
const publicKey = fs.readFileSync(path.resolve(__dirname, `../../config/public.key`));

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
    {expiresIn},
  );
};
