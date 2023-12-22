const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
app.use(cors())
app.use(express.json())
app.get('', (req, res)  => {
    res.send("The spark tasker is running now...")
})

console.log(process.env.DB_NAME);
console.log(process.env.DB_PASSWORD);

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@mursalin.bxh3q56.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    const taskCollections = client.db('spark-tasker').collection('my-tasks');

    app.post('/add-tasks', async(req, res) =>{
        const receive = req.body;
        console.log(receive);
        const result = await taskCollections.insertOne(receive)
        res.send(result)
        console.log(result);
    })
    app.get('/my-todos', async(req, res) => {
        const email = req.query.email;
        console.log(email);
        const result = await taskCollections.find({taskUser: email}).toArray();
        console.log('resp', result);
        res.send(result)
    })

    


    client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`The current port ${port} is running`);
})