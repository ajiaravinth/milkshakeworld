"use strict";
/** Dependency Injection */
const express = require("express"), // $ npm install express
    path = require("path"), // Node In-Build Module
    bodyParser = require("body-parser"), // $ npm install body-parser
    mongoose = require("mongoose"), // $ npm install mongoose
    validator = require("express-validator"), // $ npm install express-validator
    cors = require('cors'), // $ npm install CORS
    CONFIG = require("./config/config"); // Injecting Our Configuration

/** /Dependency Injection */
require('events').EventEmitter.prototype._maxListeners = 200;

const app = express(); // Initializing ExpressJS
const server = require("http").createServer(app);


/** Global Configuration*/
global.GLOBAL_CONFIG = {};
mongoose.Promise = global.Promise;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/** /Global Configuration*/

/** MongoDB Connection */
let options = {
    useNewUrlParser: true,   
    useUnifiedTopology: true,
}
mongoose.connect(CONFIG.DB_URL, options);
mongoose.connection.on("error", (error) => console.error("Error in MongoDb connection: " + error));
mongoose.connection.on("reconnected", () => console.log("Trying to reconnect!"));
mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected!"));
mongoose.connection.on("connected", () => {

    app.use(bodyParser.urlencoded({ limit: "100mb", extended: true })); // Parse application/x-www-form-urlencoded
    app.use(bodyParser.json({ limit: "100mb" })); // bodyParser - Initializing/Configuration
    app.use("/uploads", express.static(path.join(__dirname, "/uploads"), { maxAge: 7 * 86400000 }));
    app.set("view engine", "html");
    app.locals.pretty = true;
    app.use(cors());
    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });

    // app.use("/", express.static(path.join(__dirname, "/build/company")));
    // app.use("/admin", express.static(path.join(__dirname, "build")));
    // app.use("/static", express.static(path.join(__dirname, "static")));

    require("./routes")(app);   

    /** HTTP Server Instance */
    try {
        server.listen(CONFIG.PORT, () => {
            console.log("Server turned on with", CONFIG.ENV, "mode on port", CONFIG.PORT);           
        });
    } catch (ex) {
        console.log("TCL: ex", ex)
    }
    /** /HTTP Server Instance */
});
/** /MongoDB Connection */