const jwt = require('jsonwebtoken');

const getCleanExpire = () => {
  const exp = process.env.JWT_EXPIRE;
  if (!exp) return '7d';
  const clean = String(exp).replace(/["']/g, '').trim();
  if (!clean || clean === 'undefined' || clean === 'null') {
    return '7d';
  }
  return clean;
};

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_ccm_portal_dev_12345';
  const expiresIn = getCleanExpire();

  return jwt.sign({ id }, secret, {
    expiresIn,
  });
};

module.exports = generateToken;
