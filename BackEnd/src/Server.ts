import express from "express";
import http from "http";
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import dotenv from "dotenv"

dotenv.config({
    path:"./config/.env"
})


const ConnectDatabase = require("./helper/Connection.helper");

// import router
import authenRouter from "./Router/Authen.router"
import userRouter from "./Router/User.router"
import sizeRouter from "./Router/Size.router"
import catgoryRouter from "./Router/Category.router"
import ingredientRouter from "./Router/Ingredient.router"
import productRouter from "./Router/Product.router"
import orderRouter from "./Router/Order.router"
import paymentRouter from "./Router/Payment.router"

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);


app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
// app.use(cors({
// }))



// 


// config app use router
app.use("/user", userRouter)
app.use("/authen", authenRouter)
app.use("/category", catgoryRouter)
app.use("/size", sizeRouter)
app.use("/product", productRouter)
app.use("/order", orderRouter)
// app.use("/wishList",)
app.use("/payment", paymentRouter)
app.use("/ingredient", ingredientRouter)

ConnectDatabase();
server.listen(port,() => {
    console.log(`Server running on http://localhost:${port}`);
});
