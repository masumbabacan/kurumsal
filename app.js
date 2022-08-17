require('dotenv').config();
require("express-async-errors");

const express = require("express");
const app = express();  
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//rest of the package
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors');  
const fileUpload = require('express-fileupload');

//database
const connectDB = require("./db/connect");

//routers
const homePageRoutes = require("./routes/homePageRoutes");
const adminPageRoutes = require("./routes/adminPageRoutes");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const franchiseRouter = require("./routes/franchiseRoutes");
const referanceRouter = require("./routes/referanceRoutes");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(cors({credentials: true, origin: 'http://localhost:3001'}));
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.locals.moment = require('moment');


//apples
app.use("/api/kurumsal/",homePageRoutes);
app.use("/api/kurumsal/admin",adminPageRoutes);
app.use("/api/kurumsal/auth",authRouter);
app.use("/api/kurumsal/users",userRouter);
app.use("/api/kurumsal/services",serviceRouter);
app.use("/api/kurumsal/franchises",franchiseRouter);
app.use("/api/kurumsal/referances",referanceRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const port = process.env.PORT || 3000;

const start = async (req,res) => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port,console.log(`Server ${port} portunda başlatıldı`));
    } catch (error) {
        console.log(error);
    }
}
start();