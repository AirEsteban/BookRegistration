const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const books = [
    { title: 'Java programming', id:1},
    { title: 'C# programming', id:2},
    { title: 'Nodejs programming', id:3},
];

app.use(express.json());

app.get("/", (req,res) => {
    res.send("Welcome to the server papurro");
});

app.get("/api/books", (req, res) => {
    res.send(books);
});

app.get("/api/books/:id", (req, res) => {
    const book = books.find(item => item.id === parseInt(req.params.id));
    if(!book) res.status(404).send("No book found");
    res.send(book);
});

app.post("/api/books/addOneBook", (req, res) => {
    const book = {
        id: books.length+1,
        title: req.body.title
    };
    books.push(book);
    res.send(book);
});

app.put("/api/books/:id", (req, res) => {
    const book = books.find(item => item.id === parseInt(req.params.id));
    if(!book) res.status(404).send("No book found with that id");
    book.title = req.body.title;
    res.send(book);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
