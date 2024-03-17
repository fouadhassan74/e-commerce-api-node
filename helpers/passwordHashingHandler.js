const bcrypt = require("bcrypt");
const hashpassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedpassword = await bcrypt.hash(password, salt);
  return hashedpassword;
};
const comparePassword = async (inputPaassword, hashedPassword) => {
  return await bcrypt.compare(inputPaassword, hashedPassword);
};
module.exports = { hashpassword, comparePassword };
