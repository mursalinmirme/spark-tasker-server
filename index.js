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

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        res.send(result);
    })
    app.get('/my-todos', async(req, res) => {
        const email = req.query.email;
        console.log(email);
        const result = await taskCollections.find({taskUser: email}).toArray();
        res.send(result)
    })
    app.get('/update-task/:id', async(req, res) => {
        const updateId = req.params.id;
        console.log('update id', updateId);
        const result = await taskCollections.findOne({_id: new ObjectId(updateId)});
        res.send(result)
    })

    app.delete('/delete-task/:id', async(req, res) => {
        const deleteId = req.params.id;
        const result = await taskCollections.deleteOne({_id: new ObjectId(deleteId)});
        res.send(result)
    })

    app.put('/update-task/:id', async(req, res) => {
        const updateVersion = req.body;
        const id = req.params.id;
        const options = { upsert: true };
        const updateDoc = {
          $set: updateVersion,
        };
        console.log('update versions is', updateVersion);
        const result = await taskCollections.updateOne({_id: new ObjectId(id)}, updateDoc, options);
        res.send(result);
        console.log(result);
    })

    app.put('/update-todo/:id', async(req, res) => {
      const updateId = req.params.id;
      console.log('update Mr is', updateId);
      const updteStatus = req.body;
      console.log('update body is ', updteStatus);
      const updateDoc = {
        $set: {
          status: updteStatus.status,
        },
      };
      const result = await taskCollections.updateOne({_id: new ObjectId(updateId)}, updateDoc);
      console.log('updated result is', result);
      res.send(result);
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