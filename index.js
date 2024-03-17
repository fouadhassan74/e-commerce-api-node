// requires
const bodyParser = require("body-parser");
const { morganDev } = require("./config/morgan");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const ditenv = require("dotenv").config();
const dbConnection = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
// routes import
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const blogRoute = require("./routes/blogRoute");
const productCateRoute = require("./routes/productCateRoute");
const blogCateRoute = require("./routes/blogCateRoute");
const brandRoute = require("./routes/brandRoute");
const couponRoute = require("./routes/couponRoute");
// intial
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//Database Connection
dbConnection();
//morgan
// morganDev();
if (app.get("env") === "development") {
  app.use(morgan("dev"));
}
//start routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute);
app.use("/api/productcate", productCateRoute);
app.use("/api/blogcate", blogCateRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
//end of routes
// error handlers
app.use(notFound);
app.use(errorHandler);
// end of error handlers
app.listen(PORT, () => {
  console.log(`SERVER RUNING IN PORT ${PORT}`);
});
