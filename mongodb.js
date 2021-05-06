const express = require("express")
const MongoClient = require("mongodb").MongoClient;

const port = process.env.PORT || 5000;
// Mongodb 
const uri = "mongodb://127.0.0.1:27017";
const dbName = "mydatabase";
var database;

const app = express();

app.use(express.json());

app.get("/api/books", (req, res) => {
    console.log(database.collection("users").find({}).toArray());
    res.send("cmamut");
});

app.listen(port, () => {
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology:true },(error,result) => {
        if(error)
            throw error
        database = result.db(dbName);
        console.log(`Connection to ${dbName} stablished on port ${port}`);
    })
})