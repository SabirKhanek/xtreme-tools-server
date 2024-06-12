const bcrypt = require("bcrypt");

module.exports.genHash = (input) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(input, salt);
  return hash;
};

module.exports.verifyHash = (input, hash) => {
  return bcrypt.compareSync(input, hash);
};
