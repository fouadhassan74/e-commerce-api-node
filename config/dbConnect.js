const { mongoose } = require("mongoose");
const dbConnection = () => {
  try {
    mongoose.connect(process.env.MONGGO_URL).then(() => {
      console.log("Database Connection Successfully");
    });
  } catch (err) {
    console.log(`there is an error in db connection.. the error id ${err}`);
    throw new Error(err);
  }
};
module.exports = dbConnection;
