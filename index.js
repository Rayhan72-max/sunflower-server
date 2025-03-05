const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json())

//sunflower
//j1h1I5b5X3zVmUSC



const uri = "mongodb+srv://sunflower:j1h1I5b5X3zVmUSC@cluster0.zd2hkzs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const campaigns= client.db("SunFlower").collection("campaigns")
    const donations= client.db("SunFlower").collection("donations")
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const result = campaigns.find()
    
    app.get("/campaign",async (req,res)=>{
      const campaign = campaigns.find();
      const result =await campaign.toArray()
      res.send(result)
    })

    app.get("/details/:id",async (req,res)=>{
      const id = req.params.id;
      console.log("id is", id);
      const query = {_id: new ObjectId(id)};
      const campaign = await campaigns.findOne(query);
      
      res.send(campaign)
    })

    app.get("/mycampaign/:email",async(req,res)=>{
      const email = req.params.email;
      console.log("email is",email);
      const query = {email: email};
      const mycampaign = campaigns.find(query);
      const result = await mycampaign.toArray();
      res.send(result);
    })

    app.post("/campaign",async(req,res)=>{
      const campaign = req.body;
      console.log(campaign);
      const result = await donations.insertOne(campaign)
      res.send(result);
    })

    app.post("/donation",async(req,res)=>{
      const donation = req.body;
      const {_id,...d} = donation;
      
      console.log(d);
      const result = await donations.insertOne(d)
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>console.log(`runnig on port ${port}`))



