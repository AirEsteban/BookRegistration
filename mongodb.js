const express = require("express")
const MongoClient = require("mongodb").MongoClient;
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const port = process.env.PORT || 5000;
// Mongodb 
const uri = "mongodb://127.0.0.1:27017";
const dbName = "testDB";
var database;

// Swagger

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NodeJS CRUD API",
            version: "1.0.0"
        },
        servers: [
            { url: "http://localhost:5000"}
        ]
    },
    apis: ['./mongodb.js']
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

// Swagger url
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Encode
app.use(express.json());

/**
 * @swagger
 *   components:
 *      schema:
 *          Book: 
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                  title:
 *                      type: string
 */

/**
 * @swagger
 * /api/books:
 *  get:
 *      summary: To get all books from MongoDB
 *      description: This api is used to fetch data from MongoDB
 *      responses: 
 *           200:
 *               description: This api is used to fetch data from MongoDB
 *               content: 
 *                  application/json: 
 *                      schema: 
 *                          type: array
 *                          items: 
 *                              $ref: '#components/schema/Book'
 */
app.get("/api/books", (req, res) => {
    // Finding all the collection and retrieve that as an array of documents
    database.collection("books").find({}).sort({id: 1}).toArray((err, result) => {
        if(err) throw err
        res.send(result)
    });
});

app.post("/api/books/addOneBook", (req, res) => {
    let result = database.collection("books").find({}).sort({id : -1}).limit(1)
    // First we find the collections, and we will use the last id to create the new item and add it to the db
    result.forEach(item => {
        if(item){
            let newBook = {
                id: item.id + 1,
                title: req.body.title
            };
            // here we will insert the book as a document to the collection 
            database.collection("books").insertOne(newBook, (error, result) => {
                if(error) res.status(500).send("There was an error adding the new book")
                res.send("The book was added succesfully")
            });
        }
    });
});

app.put("/api/books/:id",(req,res) => {
    // Update a document, we firstly find the one that we want to change, then create a dataset
    // and after we will change it.
    let findById = { id: parseInt(req.params.id) }
    let updatedBook = {
        id: parseInt(req.params.id),
        title: req.body.title
    };
    let dataSet = {
        $set : updatedBook
    };
    database.collection("books").updateOne(findById, dataSet, (err,result) => {
        // The update never fails, at least on SQL, but we will add this in case of any error
        if(err) res.status(500).send("There was an error updating the book")
        res.send(updatedBook)
    }); 
})

app.delete("/api/books/:id", (req, res) => {
    database.collection("books").deleteOne({id: parseInt(req.params.id)}, (err, result) => {
        if(err) console.log(err)
        res.send("Book no longer exists")
    });
});

app.listen(port, () => {
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology:true },(error,result) => {
        if(error)
            throw error
        database = result.db(dbName);
        console.log(`Connection to ${dbName} stablished on port ${port}`);
    });
})