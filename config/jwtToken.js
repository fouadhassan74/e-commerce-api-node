const Jwt = require("jsonwebtoken");
const jwtTokenGenrator = (id) => {
  return Jwt.sign(
    {
      id,
      //   isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "3d" }
  );
};
module.exports = { jwtTokenGenrator };
