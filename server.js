const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config");
const todoRoutes = require("./todoRoutes");

const app = express();

const port = config.API_PORT;
const dbUrl = config.DB;

mongoose.connect(dbUrl, { useNewUrlParser: true});
let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((_, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port)
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    
    // Pass to next layer of middleware
  next()
});

app.use("/api", todoRoutes);

app.get("/", (_, res) => {
    res.sendFile("./public/index.html")
});

app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));