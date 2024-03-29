const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 3000;

app.use(cors());
  app.use(express.json());
  
  
  app.get('/', (req, res)=>{
      res.send('House Hunter server is ready');
  })
  
  app.listen(port, ()=>{
      console.log('SERVER IS RUNNING!!', port);  
  })

  //HouseHunter
  //pw89YcXJbWFeyVWU


  const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.nztpc23.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db("HouseHunterDB");
const usersCollection = database.collection("users");
const housesCollection = database.collection("houses");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    //get api for some data
    app.get('/users', async (req, res) =>{
        
        console.log(req.query.email, req.query.password);
        let query = {};
        if(req.query?.email && req.query.password){
            query = {email: req.query.email,
                password: req.query.password
            }
        }

        const cursor = usersCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get('/houses', async(req, res) =>{

        let query = {};

        if(req.query?.city){
            query = {city: req.query.city
            }
        }

        const cursor = housesCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);

      }

      )
    

    //get api for all data
   

    //post api
    app.post("/users", async (req, res) => {
        console.log(req.body);
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
        console.log(result);       
    });

    app.post("/houses", async (req, res) => {
        console.log(req.body);
        const newHouse = req.body;
        const result = await housesCollection.insertOne(newHouse);
        res.send(result);
        console.log(result);       
    });


    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);