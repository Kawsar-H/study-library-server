const express = require('express');
const objectId = require('mongodb').ObjectId;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
console.log(process.env.DB_USER)



const port = process.env.PORT || 3003


const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5hufd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.get('/', (req , res) =>{
    res.send('hello bro.how are ..')
});


client.connect(err => {
  const collection = client.db("organicuser").collection("product");
  
  app.get('/events' , (req , res) =>{
    collection.find()
    .toArray((err , items) =>{
      res.send(items)
    })
  })


  app.get('/product/:id', (req, res) =>{
    const id = objectId(req.params.id)
    console.log(id)
    collection.find({ _id:id})
    .toArray((err,documents)=>{
      res.send(documents[0]);
    })
    
  })


  app.post('/addEvent' , (req , res)=>{
    const newEvent = req.body;
    console.log('adding new event:' , newEvent)
    collection.insertOne(newEvent)
    .then(result =>{
      console.log('insert count', result.insertedCount );
      res.send(result.insertedCount > 0)
    })
  })


  console.log('database connect')
  // perform actions on the collection object
  
});



app.use(cors());
app.use(bodyParser.json())
app.listen(process.env.PORT || port);