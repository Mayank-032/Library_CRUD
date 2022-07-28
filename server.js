const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb+srv://Mayank:2002@library-crud-cluster.zchbxy9.mongodb.net/test', (err, client) => {
    if(err){
        return console.log(err);
    }else{
        db = client.db('BooksDB');
        
        app.listen(process.env.PORT || 3000, () => {
            console.log("Listening on Port 3000");
        })
    }
})


app.use(bodyParser.urlencoded({
    extended: true 
}))

// GET Request
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


// POST Request
app.post('/Task1', (req, res) => { 
    db.collection('books')
    .find({book_name: new RegExp(req.body.BookName, 'i')})
    .toArray(function(err, result){
        if(err) return console.log(err);
        res.send(result);
    })
})

app.post('/Task2', (req, res) => {
    db.collection('books')
    .find(
        {category: req.body.Category},
        {$and: 
            [
                {book_name: new RegExp(req.body.BookName1, 'i')},
                {rent_per_day: {$and: 
                    [
                        {
                            gte: req.body.minRange
                        }, 
                        {
                            lte: req.body.maxRange
                        }
                    ]
                }}
            ]
        }
    )
    .toArray((err, result) => {
        if(err) return console.log(err);
        res.send(result);
    })
})