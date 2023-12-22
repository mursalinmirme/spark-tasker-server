const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
app.get('', (req, res)  => {
    res.send("The spark tasker is running now...")
})



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<spark-tasker>:<lhhjAmKjOPqmF2aY>@mursalin.bxh3q56.mongodb.net/?retryWrites=true&w=majority";

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